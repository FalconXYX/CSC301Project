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
router.post("/user", async function (req, res, next) {
  try {
    const userId = await authorize_user(req);
    const auth = await getAuthenticatedClient(userId)
    const user = await prisma.users.findFirst({ where: { id: userId } })
    const calendar = google.calendar({ version: 'v3', auth })
    const clinic = await prisma.clinics.findFirst({ where: { id: req.body.clinic_id } });
    const practitioner = await prisma.practitioners.findFirst({ where: { id: req.body.practitioner_id } })
    const practitionerUser = await prisma.users.findFirst({ where: { id: practitioner.user_id } })

    var appointment = await prisma.appointment_requests.findFirst({ where: { patient_user_id: userId, preferred_start: req.body.preferred_start, preferred_end: req.body.preferred_end, clinic_id: req.body.clinic_id, practitioner_id: req.body.practitioner_id } })
    if (appointment) {
      res.status(409).json({ error: 'Appointment already exists' })
    }
    else {
      const { meeting_type, ...appointmentData } = req.body;
      const event = {
        summary: "Appointment with GP " + practitionerUser.first_name + " " + practitionerUser.last_name + ".",
        location: meeting_type === 'Online' ? 'Online' : clinic.address_line1,
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
      appointment = await prisma.appointment_requests.create({ data: { ...appointmentData, patient_user_id: userId, google_event_id: response.data.id }, });

      res.status(201).json({ appointment: appointment });
    }
    
  } catch (error) {
    next(error);
  }
});

/**
 * POST /appointments
 * Create a new appointment
 */
router.post("/practitioner", async function (req, res, next) {
  try {
    const userId = await authorize_user(req);
    const user = await prisma.users.findFirst({ where: { id: userId } })
    const clinic = await prisma.clinics.findFirst({ where: { id: req.body.clinic_id } });
    const practitioner = await prisma.practitioners.findFirst({ where: { id: req.body.practitioner_id } })
    const practitionerUser = await prisma.users.findFirst({ where: { id: practitioner.user_id } })
    const auth = await getAuthenticatedClient(practitionerUser.id)
    const calendar = google.calendar({ version: 'v3', auth })

    var appointment = await prisma.appointment_requests.findFirst({ where: { patient_user_id: userId, preferred_start: req.body.preferred_start, preferred_end: req.body.preferred_end, clinic_id: req.body.clinic_id, practitioner_id: req.body.practitioner_id } })
    if (!appointment) {
      res.status(409).json({ error: 'Appointment does not exist' })
    }
    else {
      const event = {
        summary: "Appointment with " + user.first_name + " " + user.last_name + ".",
        location: clinic.address_line1,
        description: practitioner.profession + " appointment with " + user.first_name + " " + user.last_name + " at " + clinic.name + ".",
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
        calendarId: practitionerUser.google_calendar_id,
        resource: event,
      });

      res.status(201).json({ response: response });
    }
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;