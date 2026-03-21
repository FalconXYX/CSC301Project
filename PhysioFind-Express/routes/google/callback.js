var express = require('express')
var router = express.Router()
var prisma = require('../../config/prisma')
var { createOAuthClient } = require('../../utils/googleCalendar')
var { encrypt } = require('../../utils/encrypt')

/**
 * GET /api/google/callback
 * Handles the OAuth callback from Google, exchanges code for tokens and stores them
 */
router.get('/callback', async function (req, res, next) {
  try {
    const { code, state } = req.query

    if (!code) {
      return res.redirect('http://localhost:5173/account?google=error')
    }

    const userId = state
    const oauth2Client = createOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    await prisma.users.update({
      where: { id: userId },
      data: {
        google_access_token: encrypt(tokens.access_token),
        google_refresh_token: encrypt(tokens.refresh_token),
        google_token_expiry: new Date(tokens.expiry_date),
      },
    })

    res.redirect('http://localhost:5173/account?google=connected')
  } catch (error) {
    next(error)
  }
})

module.exports = router
