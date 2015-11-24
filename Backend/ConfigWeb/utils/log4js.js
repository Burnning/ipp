var log4js = require('log4js');

log4js.configure({
  appenders: [
    {
      type: 'console'
    }, {
      type: 'file',
      filename: 'logs/log.log',
      maxLogSize: 50000000,
      backups: 10,
      category: 'gbtouch'
    }
  ],
  replaceConsole: true
});
var logger = log4js.getLogger('一体化配置');
logger.setLevel('debug');            //log4js的输出级别6个: trace, debug, info, warn, error, fatal);

exports.Logger = logger;