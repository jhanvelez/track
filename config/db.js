const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('trackinglab_gps', 'trackinglab_gps', 'Tecnolab2023**', {
    host: '204.93.224.133',
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: false
    },
    timezone: "-05:00"
});

module.exports = sequelize;