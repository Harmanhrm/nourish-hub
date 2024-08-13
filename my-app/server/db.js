const { Sequelize } = require('sequelize');



require('dotenv').config();
const sequelize = new Sequelize(
    'root',
    'root',
    'Didar1982',
    {
        host: '34.129.78.155',
        dialect: 'mysql',
        port: 3306
    }
);
sequelize.authenticate()
    .then(() => console.log('Database connected.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
