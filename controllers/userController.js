const {User} = require('../models')
const {unhashPassword} = require('../helpers/bcrypt')
const{generateToken} = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library')

class UserController {

    static register(req, res, next) {
        let {username, email, password} = req.body
        User.create({username, email, password})

        .then(data => {
            let info = {
                id: data.id,
                username: data.username,
                email: data.email
            }
            res.status(201).json(info)
        })

        .catch (err => {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                next({status: 400,errors: err.errors})
            } else {
                next({status: 500})
            }
        })
    }

    static login (req, res, next) {
        let {email, password} = req.body
        User.findOne({
            where:{email}
        })
        .then(data => {
            if (data){
                if (unhashPassword(password, data.password)){
                    //console.log(data);
                    let access_token = generateToken ({
                        id: data.id,
                        username: data.username,
                        email: data.email
                    })
                    //console.log(access_token);
                    res.status(200).json({access_token, username: data.username})
                } else {
                    next({status: 401, errors: [{ message: "Invalid Email/Password" }]})
                }
            } else {
                next({status: 401, message: "Email not found, please register first"})
            }
        })
        .catch(() => {
             //console.log("r");
            next(err)
        })
    }
    static handleGoogleLogin(req, res, next){
        const { id_token } = req.body
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let email
        let username

        client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket => {
            console.log("ini harus disini");
            const payload = ticket.getPayload()
            console.log(payload, 'ini payload');
            email = payload.email
            username = payload.name
            return User.findOne({
                where: {
                    email
                }
            })
        })
        .then(data => {
            console.log(data, 'ini data');
            if(!data){
                return User.create({
                    email,
                    username,
                    password: Math.random()*1000+'rahasia'
                })
            } else {
                return data
            }
        })
        .then(data => {
            let access_token = generateToken({
                id: data.id,
                username: data.username,
                email: data.email
            })
            //console.log(access_token, 'ini access token');
            res.status(200).json({access_token, username: data.username})
        })
        .catch(err => {
            next(err)
        })
    }
}


module.exports = UserController