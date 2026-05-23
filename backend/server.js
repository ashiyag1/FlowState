import app from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Tarang-FlowState Express server running on port ${PORT}`)
})
