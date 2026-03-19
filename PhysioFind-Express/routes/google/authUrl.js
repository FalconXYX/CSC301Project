var express = require('express')
var router = express.Router()
var { createOAuthClient } = require('../../utils/googleCalendar')
var { authorize_user } = require('../auth/authMiddleware')

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
]

/**
 * GET /api/google/auth-url
 * Returns the Google OAuth consent URL for the authenticated user
 */
router.get('/auth-url', async function (req, res, next) {
  try {
    const userId = await authorize_user(req)

    const oauth2Client = createOAuthClient()

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: userId,
    })

    res.json({ url })
  } catch (error) {
    next(error)
  }
})

module.exports = router
