var express = require("express");
var router = express.Router();
var prisma = require("../../config/prisma");
var { authorize_user } = require('../auth/authMiddleware')

/**
 * GET /appointments/:id
 * Get an appointment by ID
 */
router.get("/:id", async function (req, res, next) {
  try {
    
    const appointmentId = req.params.id;

    const appointment = await prisma.appointment_requests.findFirst({ where: { id: appointmentId } });

    res.json({ message: "Get appointment by ID", appointmentId: appointmentId,  appointment: appointment });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /appointments/allUserAppointments
 * Get all appointments for specific user. 
 */
router.get("/", async function (req, res, next) {
    try {
        
        const userId = await authorize_user(req);
        const appointment = await prisma.appointment_requests.findMany({ where: { patient_user_id: userId } });

        res.json({ message: "Get all user appointments",  appointment: appointment });
    } catch (error) {
      
        next(error);
    }
});

module.exports = router;