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
    const clinic = await prisma.clinics.findFirst({ where: { id: req.body.clinic_id } });
    const practitioner = await prisma.practitioners.findFirst({ where: { id: req.body.practitioner_id } })
    const practitionerUser = await prisma.users.findFirst({ where: { id: practitioner.user_id } })
    const appointmentId = req.params.id;
    const appointment = await prisma.appointment_requests.findFirst({ where: { id: appointmentId } })

    const { meeting_type, ...appointmentData } = req.body;
    const eventLocation = meeting_type === 'Online' ? 'Online' : clinic.address_line1;

    // Update patient's calendar event
    await calendar.events.patch({
      calendarId: user.google_calendar_id,
      eventId: appointment.google_event_id,
      requestBody: {
        summary: "Appointment with GP " + practitionerUser.first_name + " " + practitionerUser.last_name + ".",
        location: eventLocation,
        description: practitioner.profession + " appointment with " + practitionerUser.first_name + " " + practitionerUser.last_name + " at " + clinic.name + ".",
        start: { dateTime: req.body.preferred_start, timeZone: 'UTC' },
        end: { dateTime: req.body.preferred_end, timeZone: 'UTC' },
      }
    })

    // Update practitioner's calendar event by finding it in the original time slot
    try {
      const practitionerAuth = await getAuthenticatedClient(practitionerUser.id)
      const practitionerCalendar = google.calendar({ version: 'v3', auth: practitionerAuth })
      const events = await practitionerCalendar.events.list({
        calendarId: practitionerUser.google_calendar_id,
        timeMin: appointment.preferred_start.toISOString(),
        timeMax: appointment.preferred_end.toISOString(),
        singleEvents: true,
      })
      for (const event of events.data.items ?? []) {
        await practitionerCalendar.events.patch({
          calendarId: practitionerUser.google_calendar_id,
          eventId: event.id,
          requestBody: {
            summary: "Appointment with " + user.first_name + " " + user.last_name + ".",
            location: eventLocation,
            description: practitioner.profession + " appointment with " + user.first_name + " " + user.last_name + " at " + clinic.name + ".",
            start: { dateTime: req.body.preferred_start, timeZone: 'UTC' },
            end: { dateTime: req.body.preferred_end, timeZone: 'UTC' },
          }
        })
      }
    } catch {
      // Practitioner has no Google Calendar connected — skip
    }

    const appointmentResponse = await prisma.appointment_requests.update({
      where: { id: appointmentId },
      data: appointmentData,
    });

    res.json({ appointment: appointmentResponse });
  } catch (error) {
    next(error);
  }
});

module.exports = router;