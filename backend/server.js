import cluster from 'cluster'
import os from 'os'
import app from './app.js'

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection — server will continue running:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception — server will continue running:', err)
})

const PORT = process.env.PORT || 5000

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length
  console.log(`Primary process ${process.pid} is running`)
  console.log(`Forking ${numCPUs} workers...`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Restarting...`)
    cluster.fork()
  })
} else {
  app.listen(PORT, () => {
    console.log(`Worker process ${process.pid} listening on port ${PORT}`)
  })
}
