const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db');

const Products = sequelize.define('Products', {
    id: {
        type: DataTypes.CHAR(36),
        defaultValue: Sequelize.literal('UUID()'),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    isSpecial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        validate: {
            min: 0, 
            max: 100 
        }
    },
}, {
    tableName: 'products',
    timestamps: false,
});

module.exports = Products;
// code for mysql
/*
CREATE TABLE products (
    id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    isSpecial BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
); */
