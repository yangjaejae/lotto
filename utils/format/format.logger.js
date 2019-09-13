const { createLogger, format, transports } = require("winston")
require("winston-daily-rotate-file")
const fs = require("fs")

const logDir = "logs"
const env = 'debug';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

let transport_arr = [];
transport_arr.push(new transports.Console({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  )
}));

// if(LOG_ENV.LEVEL == "prod"){
//   transport_arr.push(new transports.DailyRotateFile({
//     level: "debug",
//     filename: `${logDir}/eos_api_%DATE%.log`,
//     datePattern: "YYYY-MM-DD",
//     zippedArchive: true,
//     maxSize: "20m",
//     maxFiles: "14d"
//   }));
// }

const logger = createLogger({
  level: env === "dev" ? "debug" : "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.json()
  ),
  transports: transport_arr
})

module.exports = {
  logger: logger
}