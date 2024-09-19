// models/userActivity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UserActivity = sequelize.define('UserActivity', {
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    last_message: {
        type: DataTypes.DATE,
        allowNull: false
    },
    message_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    gift_received: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = UserActivity;
