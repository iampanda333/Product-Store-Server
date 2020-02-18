const Sequelize = require('sequelize');

const db_details = {
    host: process.env.sql_host,
    port: process.env.sql_port,      
    dialect: 'mysql'
};

module.exports = new Sequelize(
    process.env.sql_db_name,
    process.env.sql_user,
    process.env.sql_password,
    db_details
);

// var config = require('../../config/config'),
//     Sequelize = require('sequelize');

// module.exports = new Sequelize(
//     config.db.name,
//     config.db.user,
//     config.db.password,
//     config.db.details
// );

