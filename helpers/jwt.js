const jwt = require('jsonwebtoken');
//const secret = "secret"

function generateToken(payload){
    return jwt.sign(payload, process.env.JWT_KEY);
    // return jwt.sign(payload, secret);
}

function checkToken(payload){
    return jwt.verify(payload, process.env.JWT_KEY);
}

module.exports = {generateToken, checkToken} 