const { Sequelize } = require('sequelize');



require('dotenv').config();
const sequelize = new Sequelize(
    's4009171_fsd_a2',
    's4009171_fsd_a2',
    'Didar1982',
    {
        host: 'rmit.australiaeast.cloudapp.azure.com',
        dialect: 'mysql',
        port: 3306
    }
);
sequelize.authenticate()
    .then(() => console.log('Database connected.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;