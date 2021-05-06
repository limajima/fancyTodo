'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo)
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty:{
          msg: "Please fill the Username"
        },
        len: {
          args:[5],
          msg: "Username at least 5 Characters"
        }
      },
      unique:true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty:{
          msg: "Please fill the Email"
        },
        isEmail: {
          msg: "Invalid Email Format !"
        }
      },
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Please fill the Password"
        },
        len: {
          args: [5],
          msg: "Password at least 5 Characters"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate(user, options) {
        user.password = hashPassword(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};