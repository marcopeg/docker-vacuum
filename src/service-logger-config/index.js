const { LOGGER_TRANSPORTS } = require('@forrestjs/service-logger');
const { FEATURE_NAME } = require('./hooks');

module.exports = ({ registerAction }) => {
  registerAction({
    name: FEATURE_NAME,
    hook: LOGGER_TRANSPORTS,
    handler: ({ winston, registerTransport }, { getEnv }) => {
      const { combine, timestamp, label, prettyPrint } = winston.format;

      const serviceLabel = label({ label: 'DockerVacuum' });

      const format =
        getEnv('NODE_ENV') !== 'production'
          ? combine(timestamp(), serviceLabel, prettyPrint())
          : combine(timestamp(), serviceLabel);

      registerTransport(new winston.transports.Console({ format }));
    },
  });
};
