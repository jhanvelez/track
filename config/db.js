const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gps', 'root', 'Tecnolab2023**', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: false
    },
    timezone: "-05:00"
});

module.exports = sequelize;