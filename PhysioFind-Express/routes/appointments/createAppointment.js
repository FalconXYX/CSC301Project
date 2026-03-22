var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { google } = require('googleapis')
var { authorize_user } = require('../auth/authMiddleware')
var { getAuthenticatedClient } = require('../../utils/googleCalendar')

/**
 * POST /appointments
 * Create a new appointment
 */
router.post("/", async function (req, res, next) {
  try {
    const userId = "ab81eccf-a278-41df-afde-29b4c56cfedb"
    const auth = await getAuthenticatedClient(userId)
    const user = await prisma.users.findFirst({ where: { id: userId } })
    const calendar = google.calendar({ version: 'v3', auth })
    const clinic = await prisma.clinics.findFirst({ where: { id: req.clinic_id } });
    const practitioner = await prisma.practitioners.findFirst({ where: { id: req.practitioner_id } })
    const practitionerUser = await prisma.users.findFirst({ where: { id: practitioner.user_id } })
    
    var appointment = await prisma.appointment_requests.findFirst({ where: { patient_user_id: userId, preferred_start: req.body.preferred_start, preferred_end: req.body.preferred_end, clinic_id: req.clinic_id, practitioner_id: req.practitioner_id } })
    if (appointment) {
      res.status(409).json({ error: 'Appointment already exists' })
    }
    else {
      const event = {
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
      };
      const response = await calendar.events.insert({
        calendarId: user.google_calendar_id,
        resource: event,
      });
      appointment = await prisma.appointment_requests.create({ data: { ...req.body, patient_user_id: userId, google_event_id: response.data.id }, });

      res.status(201).json({ appointment: appointment });
    }
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;