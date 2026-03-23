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

    await calendar.events.delete({
      calendarId: user.google_calendar_id,
      eventId: appointment.google_event_id,
      sendUpdates: 'all'
    })

    await prisma.appointment_requests.delete({ where: { id: appointmentId } });

    res.json({ message: "Appointment deleted", appointmentId: appointmentId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;