const { FEATURE_NAME } = require('./hooks');
const { start } = require('./daemon');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FINISH',
    name: FEATURE_NAME,
    handler: ({ getContext, getConfig }) => {
      const log = getContext('logger');
      const interval = getConfig('vacuum.interval');
      const rules = getConfig('vacuum.rules');
      const isPruneEnabled = getConfig('vacuum.prune.enabled');
      const pruneVolumes = getConfig('vacuum.prune.volumes');

      log.info('Starting DockerVacuum...');
      start({ interval, rules, isPruneEnabled, pruneVolumes }, { log });
    },
  });
};
