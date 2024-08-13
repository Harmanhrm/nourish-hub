const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust the path to where you configure Sequelize

const User = sequelize.define('User', {
    uuid: {
        type: DataTypes.CHAR(36),
        defaultValue: Sequelize.literal('UUID()'),
        primaryKey: true,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    mail: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sign_up_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, 
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    activityLevel: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'none'
    },
    dietaryPreferences: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'none'
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'not selected'
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      sign_up_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
