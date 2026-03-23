var express = require('express')
var router = express.Router()
var { google } = require('googleapis')
var { authorize_user } = require('../auth/authMiddleware')
var { getAuthenticatedClient } = require('../../utils/googleCalendar')

/**
 * GET /api/google/calendars
 * Returns the list of Google Calendars for the authenticated user
 */
router.get('/calendars', async function (req, res, next) {
  try {
    const userId = await authorize_user(req)
    const auth = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth })

    const response = await calendar.calendarList.list()

    const calendars = response.data.items.map((cal) => ({
      id: cal.id,
      summary: cal.summary,
      primary: cal.primary ?? false,
    }))

    res.json({ calendars })
  } catch (error) {
    next(error)
  }
})

module.exports = router
