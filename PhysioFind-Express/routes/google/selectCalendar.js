var express = require('express')
var router = express.Router()
var prisma = require('../../config/prisma')
var { authorize_user } = require('../auth/authMiddleware')

/**
 * POST /api/google/calendar
 * Saves the user's selected Google Calendar ID
 */
router.post('/calendar', async function (req, res, next) {
  try {
    const userId = await authorize_user(req)
    const { calendarId } = req.body

    if (!calendarId) {
      return res.status(400).json({ error: 'calendarId is required' })
    }

    await prisma.users.update({
      where: { id: userId },
      data: { google_calendar_id: calendarId },
    })

    res.json({ message: 'Calendar selected successfully' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
