import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })

  console.log('\n📬 New Contact Message')
  console.log('─────────────────────────────────')
  console.log(`From:    ${name} <${email}>`)
  console.log(`Subject: ${subject || '(no subject)'}`)
  console.log(`Message: ${message}`)
  console.log('─────────────────────────────────\n')

  res.json({ success: true, message: 'Message received!' })
})

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`🚀 Portfolio API running on http://localhost:${PORT}`)
})
