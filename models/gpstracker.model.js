const Sequelize = require('sequelize');

const db = require('../config/db');

const GPS = db.define('gpstracks', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    imei: Sequelize.BIGINT,
    track_date: Sequelize.DATEONLY(),
    track_time: Sequelize.TIME(),
    track_lng: Sequelize.DECIMAL(11, 7),
    track_lat: Sequelize.DECIMAL(11, 7),
    speed: Sequelize.DECIMAL(10, 1),
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

// const Sincronizar = async () => {
//     await db.sync({ force: true });
//     console.log("All models were synchronized successfully.");
// }
// Sincronizar();  // Esto me lo inventé leyendo la documentación para encontrar como sincronizar la BD

module.exports = GPS;