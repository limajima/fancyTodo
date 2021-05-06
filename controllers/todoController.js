const e = require('express')
const {Todo, User} = require('../models')

class TodoController {
    static getTodo (req, res,next) {
        Todo.findAll({
            // include: {
            //     model: User,
            //     attributes: ['username']
            // },
            order: [["due_date", "ASC"]],
            where: {UserId: req.userData.id }
            
            //attributes: {exclude: ["createdAt","updatedAt"]}
        })
        .then(data => {
            res.status(200).json(data) 
        })
        .catch(err => {
            next(err)
        })
    }

    static addTodo(req, res, next) {
        const rawData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            UserId: req.userData.id //
        }

        Todo.create(rawData)
        .then(data => {
            res.status(201).json(data)
        })

        .catch(err => {
            if(err.name === "SequelizeValidationError") {
                next({status: 400, errors: err.errors})
         
            } else {
                next(err)
            }
        })
    }

    static getTodoId (req, res, next) {
        Todo.findByPk (req.params.id)
        .then(data => {
            if(data) {
                res.status(200).json(data)
            } else {
                next({status: 404})
            }
        })
        .catch(err => {
           next(err)
        })
    }

    static putTodo(req, res, next) {
       
        // const rawData = {
        //     title: req.body.title,
        //     description: req.body.description,
        //     status: req.body.status,
        //     due_date: req.body.due_date
        // }
        const {title, description, status, due_date} = req.body
        //console.log(rawData);

        Todo.update({title, description, status, due_date}, {
            where: {id: req.params.id},
            returning: true
        })

        .then(data => {
            //console.log(data);
            if(data[0]) {
                res.status(200).json(data[1])
            }
            else {
               next({status: 404})
            }
        // })
        // .then(data => {
        //     console.log(data);
        //     res.status(200).json(data)
        })
        .catch(err => {
            //console.log(err);
            if(err.name === "SequelizeValidationError") {//
                // res.status(400).json({message: "Due date not valid"})
                next({status: 400, errors: err.errors})
            } else {
                next(err)
            }
        })
    }

    static patchTodo(req, res, next) {
        // const stat = {
        //     status: req.body.status
        // }
        const {status} = req.body
        Todo.update({status}, {
            where: {id: req.params.id},
            returning: true
        })

        .then(data => {
            //console.log(data);
            if(data[0]) {
                let result = data[1][0].dataValues
                res.status(200).json(result)
                // return Todo.findByPk(id)
            } else {
                next({status: 404})
            }
        })

        // .then(data => {
        //     res.status(200).json(data)
        // })

        .catch(err => {
            if(err.name === "SequelizeValidationError") {
                next({status: 400, errors: err.errors})
            } else {
                next(err)
            }
        })
    }

    static deleteTodo (req, res) {

        Todo.destroy({
            where: {id:req.params.id}
        })

        .then(data => {
            if(data) {
                res.status(200).json({message:"Todo success to be deleted"})
            } else {
                next({status: 404})
            }
        })
        .catch(err => {
            next(err)
        })

    }


}

module.exports = TodoController