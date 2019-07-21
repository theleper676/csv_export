const bunyan = require('bunyan');
const config = require('config');
const _ = require('lodash');

const levels = {
  60: 'CRITICAL',
  50: 'ERROR',
  40: 'WARNING',
  30: 'INFO',
  20: 'DEBUG',
  10: 'DEBUG'
};

function GkeStream() {}
GkeStream.prototype.write = record => {
  if (!_.isPlainObject(record)) {
    throw new Error('error: raw stream got a non-object record: %j', record);
  }

  const {
    msg,
    pid,
    level,
    err,
    ...rest
  } = record;

  const logEntry = {
    severity: levels[level],
    ...rest,
  };

  if (err && err.stack) {
    logEntry.msg = msg;
    logEntry.eventTime = record.time;
    logEntry.message = err.stack;
    logEntry.serviceContext = {
      service: record.name,
      version: record.version,
    };
    logEntry.context = {
      user: record.accountId,
      httpRequest: {
        method: record.method,
        url: record.url,
        userAgent: record.userAgent,
        referrer: record.referrer,
        responseStatusCode: record.status,
        remoteIp: record.ip,
      },
    };
  } else if (msg) {
    logEntry.message = msg;
  }

  return console.log(JSON.stringify(logEntry)); // eslint-disable-line no-console
};

module.exports = (name, version) => {
  const loggerConfig = {
    name: name || 'main',
    level: config.logLevel || 'info',
    serializers: bunyan.stdSerializers,
    version,
  };

  if (config.util.getEnv('NODE_ENV') === 'development') {
    loggerConfig.stream = process.stdout;
  } else {
    loggerConfig.streams = [{
      type: 'raw',
      stream: new GkeStream(),
    }];
  }

  const log = bunyan.createLogger(loggerConfig);
  return log;
};