const { authenticate } = require('../middlewares/auth')
const router = require('express').Router()
const todoRoute = require('./todoRoutes')
const userRoute = require('./userRoutes')

router.use('/', userRoute)
router.use(authenticate)
router.use('/todos', todoRoute)

module.exports = router


