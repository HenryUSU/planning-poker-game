const winston = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, json, align, printf, errors } = winston.format;

//filter for error logs
const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

//filter for info logs
const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

// Define the common format once
const commonFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json(),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}  `)
);

const errorFormat = combine(
  errorFilter(),
  errors({ stack: true }),
  timestamp(),
  json(),
  align(),
  printf(
    (error) =>
      `[${error.timestamp}] ${error.level}: ${error.message} ${error.stack}`
  )
);
const infoFormat = combine(
  infoFilter(),
  timestamp(),
  json(),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const fileRotateTransportCombined = new winston.transports.DailyRotateFile({
  filename: "./logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  format: commonFormat,
});

const fileRotateTransportInfo = new winston.transports.DailyRotateFile({
  filename: "./logs/info-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  level: "info",
  format: infoFormat,
});
const fileRotateTransportError = new winston.transports.DailyRotateFile({
  filename: "./logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  level: "error",
  format: errorFormat,
});

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: commonFormat,

  transports: [
    fileRotateTransportCombined,
    fileRotateTransportError,
    fileRotateTransportInfo,
    new winston.transports.Console(),
  ],
});

module.exports = winstonLogger;
