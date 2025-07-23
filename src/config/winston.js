var appRoot = require('app-root-path');
var winston  = require('winston');

var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/src/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var logger =  winston.createLogger({
    format : winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp(), 
        winston.format.printf( info => `[${info.timestamp}] ${info.level} ${info.message} `)
         ),
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});


logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };


module.exports = logger;