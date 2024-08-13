const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust the path to where you configure Sequelize

const Reviews = sequelize.define('Reviews', {
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'products', 
            key: 'id', 
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'users', 
            key: 'uuid', 
        },
        onDelete: 'CASCADE'
    },
    content: {
        type: DataTypes.STRING(255), 
        allowNull: false,
        validate: {
            len: {
                args: [1, 100], 
                msg: "Review content must be between 1 and 100 words"
            }
        }
    },
    submission_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, 
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isDeleted: {
    type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    isFlagged: {
        type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
}, {
    tableName: 'reviews',
    timestamps: false
});

module.exports = Reviews;
