/**
 * Configuration File 
 */
const dotenv = require('dotenv');
const path = require('path');

/**
 * getting the given environment
*/
dotenv.config({
    path: path.resolve('./', process.env.NODE_ENV + '.env')
});

module.exports = {
    
    ENUM_NODE_ENV:{
        Development: "development",
        Production: "production"
    },
    /** setting default values */
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 80,
    VERSION:  process.env.VERSION || 'NONE',
    /*BD*/
    HOST_BD: process.env.HOST_BD,
    USER_BD: process.env.USER_BD,
    PASSWORD_BD: process.env.PASSWORD_BD,
    DATABASE: process.env.DATABASE,
    PORT_BD: process.env.PORT_BD,
    /*Token */
    JWT_KEY: process.env.JWT_KEY || '#%kEYj#W#T',
    SECRETKEY: process.env.secretKey || '',
}

console.log("Environment settings ::::", module.exports);