if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const {errorHandler} = require('./middlewares/errorHandler')
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routers/index')
const port = 3000

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(cors())
app.use('/', router)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`this app is running on port ${port}`)
})