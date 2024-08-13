const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db');
const Products = require('./products');

const ShoppingCart = sequelize.define('shoppingCart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        defaultValue: [],
        references: {
            model: 'user',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    product_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'products', 
            key: 'id',
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'shoppingCart',
    timestamps: false,
});

ShoppingCart.belongsTo(Products, {
    foreignKey: 'product_id',
    as: 'products'
});

module.exports = ShoppingCart;