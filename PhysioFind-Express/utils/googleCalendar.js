const { google } = require('googleapis')
const prisma = require('../config/prisma')
const { encrypt, decrypt } = require('./encrypt')

function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
}

/**
 * Builds an authenticated OAuth2 client for a user.
 * Automatically refreshes the access token if expired.
 */
async function getAuthenticatedClient(userId) {
  const user = await prisma.users.findUnique({ where: { id: userId } })

  if (!user?.google_access_token || !user?.google_refresh_token) {
    throw new Error('User has not connected Google Calendar')
  }

  const oauth2Client = createOAuthClient()

  oauth2Client.setCredentials({
    access_token: decrypt(user.google_access_token),
    refresh_token: decrypt(user.google_refresh_token),
    expiry_date: user.google_token_expiry ? new Date(user.google_token_expiry).getTime() : null,
  })

  // Auto refresh if token is expired or about to expire (within 5 minutes)
  const expiryDate = user.google_token_expiry ? new Date(user.google_token_expiry).getTime() : 0
  const isExpired = expiryDate < Date.now() + 5 * 60 * 1000

  if (isExpired) {
    const { credentials } = await oauth2Client.refreshAccessToken()

    await prisma.users.update({
      where: { id: userId },
      data: {
        google_access_token: encrypt(credentials.access_token),
        google_token_expiry: new Date(credentials.expiry_date),
      },
    })

    oauth2Client.setCredentials(credentials)
  }

  return oauth2Client
}

/**
 * Creates a Google Calendar event for an appointment.
 * Returns the created event ID.
 */
async function createCalendarEvent(userId, { summary, description, start, end }) {
  const auth = await getAuthenticatedClient(userId)
  const user = await prisma.users.findUnique({ where: { id: userId } })
  const calendar = google.calendar({ version: 'v3', auth })

  const response = await calendar.events.insert({
    calendarId: user.google_calendar_id || 'primary',
    requestBody: {
      summary,
      description,
      start: { dateTime: start, timeZone: 'America/Toronto' },
      end: { dateTime: end, timeZone: 'America/Toronto' },
    },
  })

  return response.data.id
}

/**
 * Updates an existing Google Calendar event.
 */
async function updateCalendarEvent(userId, eventId, { summary, description, start, end }) {
  const auth = await getAuthenticatedClient(userId)
  const user = await prisma.users.findUnique({ where: { id: userId } })
  const calendar = google.calendar({ version: 'v3', auth })

  await calendar.events.update({
    calendarId: user.google_calendar_id || 'primary',
    eventId,
    requestBody: {
      summary,
      description,
      start: { dateTime: start, timeZone: 'America/Toronto' },
      end: { dateTime: end, timeZone: 'America/Toronto' },
    },
  })
}

/**
 * Deletes a Google Calendar event.
 */
async function deleteCalendarEvent(userId, eventId) {
  const auth = await getAuthenticatedClient(userId)
  const user = await prisma.users.findUnique({ where: { id: userId } })
  const calendar = google.calendar({ version: 'v3', auth })

  await calendar.events.delete({
    calendarId: user.google_calendar_id || 'primary',
    eventId,
  })
}

module.exports = {
  createOAuthClient,
  getAuthenticatedClient,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
}
