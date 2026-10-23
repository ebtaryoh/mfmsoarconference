/**
 * Generates an RFC 5545 iCalendar (.ics) format file string
 * Compatible with Apple Calendar, Google Calendar, Microsoft Outlook, and mobile devices
 */

export function generateConferenceICS(): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MFM Youth Ministry//SOAR 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:SOAR 2026 - Higher Together',
    'X-WR-TIMEZONE:Africa/Lagos',
    'BEGIN:VEVENT',
    `UID:soar-2026-conference-main@mfmyouth.org`,
    `DTSTAMP:${now}`,
    'DTSTART;TZID=Africa/Lagos:20261210T090000',
    'DTEND;TZID=Africa/Lagos:20261213T170000',
    'SUMMARY:SOAR 2026: Higher Together (MFM Youth Ministry)',
    'DESCRIPTION:Mountain of Fire and Miracles Ministries Youth Ministry National Conference: SOAR 2026.\\nTheme: Higher Together.\\nDaily sessions run 9:00 AM - 5:00 PM.\\nBring your digital ticket QR pass for fast gate turnstile clearance.',
    'LOCATION:MFM Prayer City Multipurpose Hall, KM 12 Lagos-Ibadan Expressway, Ogun State, Nigeria',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'DESCRIPTION:Reminder: SOAR 2026 begins tomorrow at MFM Prayer City Multipurpose Hall',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

export function downloadICSFile(filename = 'SOAR-2026-Conference.ics') {
  const icsData = generateConferenceICS()
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
