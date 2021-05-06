const TodoController = require('../controllers/todoController')
const ApiController = require ('../controllers/apiController')
const {authorized} = require('../middlewares/auth')
const router = require('express').Router()

router.get('/weather', ApiController.getWeather)
router.get('/', TodoController.getTodo)
router.post('/', TodoController.addTodo)
router.get('/:id',authorized, TodoController.getTodoId)
router.put('/:id',authorized, TodoController.putTodo)
router.patch('/:id',authorized, TodoController.patchTodo)
router.delete('/:id',authorized, TodoController.deleteTodo)


module.exports = router