var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { google } = require('googleapis')
var { authorize_user } = require('../auth/authMiddleware')
var { getAuthenticatedClient } = require('../../utils/googleCalendar')

/**
 * DELETE /appointments/:id
 * Delete an appointment by ID
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const userId = await authorize_user(req);
    const auth = await getAuthenticatedClient(userId)
    const appointmentId = req.params.id;
    const appointment = await prisma.appointment_requests.findFirst({ where: { id: appointmentId } })
    const user = await prisma.users.findFirst({ where: { id: userId } })
    const calendar = google.calendar({ version: "v3", auth: auth })

    await prisma.appointment_requests.delete({ where: { id: appointmentId } });

    // Delete from patient's calendar
    await calendar.events.delete({
      calendarId: user.google_calendar_id,
      eventId: appointment.google_event_id,
      sendUpdates: 'all'
    })

    // Delete from practitioner's calendar by finding event in the original time slot
    if (appointment.practitioner_id && appointment.preferred_start && appointment.preferred_end) {
      try {
        const practitioner = await prisma.practitioners.findFirst({ where: { id: appointment.practitioner_id } })
        const practitionerUser = await prisma.users.findFirst({ where: { id: practitioner.user_id } })
        const practitionerAuth = await getAuthenticatedClient(practitionerUser.id)
        const practitionerCalendar = google.calendar({ version: 'v3', auth: practitionerAuth })
        const events = await practitionerCalendar.events.list({
          calendarId: practitionerUser.google_calendar_id,
          timeMin: appointment.preferred_start.toISOString(),
          timeMax: appointment.preferred_end.toISOString(),
          singleEvents: true,
        })
        for (const event of events.data.items ?? []) {
          await practitionerCalendar.events.delete({
            calendarId: practitionerUser.google_calendar_id,
            eventId: event.id,
            sendUpdates: 'all',
          })
        }
      } catch {
        // Practitioner has no Google Calendar connected — skip
      }
    }

    res.json({ message: "Appointment deleted", appointmentId: appointmentId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;