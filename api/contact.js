export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, subject, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // ── Send email via Resend (set RESEND_API_KEY in Vercel env vars) ──
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (RESEND_API_KEY) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: 'hanithpulimi6767@gmail.com',
          reply_to: email,
          subject: `[Portfolio] ${subject || `New message from ${name}`}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
              <h2 style="color:#006747;margin-bottom:4px;">New Portfolio Message</h2>
              <p style="color:#6b7280;font-size:13px;margin-top:0;">Sent via hanithpulimi.dev</p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
              <table style="width:100%;font-size:14px;color:#374151;">
                <tr><td style="padding:6px 0;font-weight:600;width:80px;">Name</td><td>${name}</td></tr>
                <tr><td style="padding:6px 0;font-weight:600;">Email</td><td><a href="mailto:${email}" style="color:#006747;">${email}</a></td></tr>
                <tr><td style="padding:6px 0;font-weight:600;">Subject</td><td>${subject || '—'}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
              <p style="font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
          `,
        }),
      })
      if (!emailRes.ok) {
        const err = await emailRes.text()
        console.error('Resend error:', err)
      }
    } catch (err) {
      console.error('Failed to send email:', err)
    }
  } else {
    // Fallback: just log (works in dev / before Resend is configured)
    console.log('\n📬 Contact Form Submission')
    console.log(`From:    ${name} <${email}>`)
    console.log(`Subject: ${subject || '(none)'}`)
    console.log(`Message: ${message}\n`)
  }

  return res.status(200).json({ success: true, message: 'Message received!' })
}
