const { Sequelize } = require('sequelize');



require('dotenv').config();
const sequelize = new Sequelize(
    'test-db',
    'root',
    'Didar1982',
    {
        host: '-app',
        dialect: 'mysql',
        port: 3306
    }
);
sequelize.authenticate()
    .then(() => console.log('Database connected.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
