var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { google } = require('googleapis')
var { authorize_user } = require('../auth/authMiddleware')
var { getAuthenticatedClient } = require('../../utils/googleCalendar')

/**
 * PUT /appointment/:id
 * Update an appointment by ID
 */
router.put("/:id", async function (req, res, next) {
  try {
    const userId = await authorize_user(req);
    const auth = await getAuthenticatedClient(userId)
    const user = await prisma.users.findFirst({ where: { id: userId } })
    const calendar = google.calendar({ version: 'v3', auth })
    const clinic = await prisma.clinics.findFirst({ where: { id: req.clinic_id } });
    const practitioner = await prisma.practitioners.findFirst({ where: { id: req.practitioner_id } })
    const practitionerUser = await prisma.users.findFirst({ where: { id: practitioner.user_id } })
    const appointmentId = req.params.id;
    const appointment = await prisma.appointment_requests.findFirst({ where: { id: appointmentId } })

    await calendar.events.patch({
      calendarId: user.google_calendar_id,
      eventId: appointment.google_event_id,
      requestBody: {
        summary: "Appointment with GP " + practitionerUser.first_name + " " + practitionerUser.last_name + ".",
        location: clinic.address_line1,
        description: practitioner.profession + " appointment with " + practitionerUser.first_name + " " + practitionerUser.last_name + " at " + clinic.name + ".",
        start: {
          dateTime: req.body.preferred_start,
          timeZone: 'UTC'
        },
        end: {
          dateTime: req.body.preferred_end,
          timeZone: 'UTC'
        },
      }
    })

    const appointmentResponse = await prisma.appointment_requests.update({
      where: { id: appointmentId },
      data: req.body,
    });

    res.json({ appointment: appointmentResponse });
  } catch (error) {
    next(error);
  }
});

module.exports = router;