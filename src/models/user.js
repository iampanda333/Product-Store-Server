const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../db/sql');

// 1: The model schema.
//var modelDefinition = {
const UserSchema = {    
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    token: {
        type: Sequelize.STRING,
        allowNull: true
    }
};

// 2: The model options.
var modelOptions = {
    // instanceMethods: {
    //     comparePasswords: comparePasswords
    // },
    hooks: {
        beforeValidate: hashPassword
    }
};

// 3: Define the User model.
var UserModel = db.define('user', UserSchema, modelOptions);

// function comparePasswords(password, callback) {
//     bcrypt.compare(password, this.password, function(error, isMatch) {
//         if(error) {
//             return callback(error);
//         }

//         return callback(null, isMatch);
//     });
// }

function hashPassword(user) {
    if(user.changed('password')) {
        return bcrypt.hash(user.password, 10).then(function(password) {
            user.password = password;
        });
    }
}

module.exports = UserModel;