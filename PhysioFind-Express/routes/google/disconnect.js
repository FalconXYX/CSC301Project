var express = require('express')
var router = express.Router()
var prisma = require('../../config/prisma')
var { authorize_user } = require('../auth/authMiddleware')

/**
 * DELETE /api/google/disconnect
 * Removes stored Google OAuth tokens for the authenticated user
 */
router.delete('/disconnect', async function (req, res, next) {
  try {
    const userId = await authorize_user(req)

    await prisma.users.update({
      where: { id: userId },
      data: {
        google_access_token: null,
        google_refresh_token: null,
        google_token_expiry: null,
        google_calendar_id: null,
      },
    })

    res.json({ message: 'Google Calendar disconnected' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
