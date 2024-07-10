import express from 'express'
const app = express()
const router = express.Router()
const port = 3000
app.use(router)
router.get('/', (req, res) => {
  res.status(200).json({
    data: [{ id: 1, user: 'Nguyen Tam Trieu Vu' }]
  })
})

app.listen(port, () => {
  console.log('server running...')
})
