var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { google } = require('googleapis')
var { getAuthenticatedClient } = require('../../utils/googleCalendar')

/**
 * POST /appointments/freeBusy/:id
 * POST practitioner's availablity 
 */
router.post("/:id", async function (req, res, next) {
  try {
    const practitionerId = req.params.id;
    const { dateStart, dateEnd, excludeId } = req.body;

    // Query existing appointments from the database for this practitioner
    const dbAppointments = await prisma.appointment_requests.findMany({
      where: {
        practitioner_id: practitionerId,
        ...(excludeId ? { id: { not: excludeId } } : {}),
        preferred_start: { lt: dateEnd },
        preferred_end: { gt: dateStart },
      },
      select: { preferred_start: true, preferred_end: true },
    });

    const dbBusy = dbAppointments
      .filter(a => a.preferred_start && a.preferred_end)
      .map(a => ({ start: a.preferred_start, end: a.preferred_end }));

    // Also try Google Calendar if the practitioner has it connected
    let gcalBusy = [];
    try {
      const practitioner = await prisma.practitioners.findFirst({ where: { id: practitionerId } });
      const user = await prisma.users.findFirst({ where: { id: practitioner.user_id } });
      const auth = await getAuthenticatedClient(user.id);
      const calendar = google.calendar({ version: 'v3', auth });
      const calendarId = user.google_calendar_id;
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: dateStart,
          timeMax: dateEnd,
          items: [{ id: calendarId }],
        },
      });
      gcalBusy = response.data.calendars?.[calendarId]?.busy ?? [];
    } catch {
      // Google Calendar not connected or token expired — fall back to DB only
    }

    const busy = [...dbBusy, ...gcalBusy];
    res.json({ message: "Get practitioner freeBusy by ID", response: busy });
  } catch (error) {
    next(error);
  }
});

module.exports = router;