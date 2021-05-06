const bcrypt = require('bcrypt');

function hashPassword(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

function unhashPassword(password, hashedPassword){
    return bcrypt.compareSync(password, hashedPassword); 
}

module.exports = { hashPassword, unhashPassword } 