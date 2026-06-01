import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection — server will continue running:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception — server will continue running:', err)
})

// Load .env BEFORE any module that depends on it (ESM hoists static imports)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

// Local dev: use JSON file, not MongoDB (on Vercel, api/index.js imports app.js directly)
process.env.MONGODB_URI = ''

const app = (await import('./app.js')).default

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
