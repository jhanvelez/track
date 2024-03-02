const Sequelize = require('sequelize');

const db = require('../config/db');

const GPS = db.define('geocercas', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    longitudes: Sequelize.JSON, // Aquí está la corrección
    id_grupo: Sequelize.INTEGER,
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
})

module.exports = GPS;