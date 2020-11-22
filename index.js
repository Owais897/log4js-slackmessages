const log4js = require("log4js");
require("dotenv").config();

const configuration = {
  appenders: {
    slack: {
      type: "@log4js-node/slack",
      token: process.env["token"], // token of bot // string
      channel_id: process.env["channel_id"], // string
      username: "channel",
    },
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["console"], level: "trace" },
    slack: { appenders: ["slack"], level: "error" },
    console: { appenders: ["console"], level: "trace" },
  },
};

log4js.configure(configuration);

const loggers = Object.keys(configuration.categories).reduce((acc, curr) => {
  if (curr === "default") return acc;
  acc[curr] = log4js.getLogger(curr);
  return acc;
}, {});

// log levels ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF -
const logLevels = [
  "trace",
  "error",
  "debug",
  "fatal",
  "warn",
  "info",
  "log",
  "mark",
];

const logger = {
  // getLogger: function (loggerType = "console") {
  //   return loggers[loggerType];
  // },
  ...logLevels.reduce((acc, curr) => {
    acc[curr] = function (...args) {
      Object.values(loggers).forEach((logger) => logger[curr](...args));
    };
    return acc;
  }, {}),
};

logger.error("error");
logger.fatal("fatal");
logger.debug("dubug");
logger.warn("warn");
logger.info("info");
logger.trace("trace");
logger.mark("mark");
