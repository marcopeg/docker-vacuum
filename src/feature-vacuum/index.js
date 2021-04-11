const prettyMs = require('pretty-ms');

const { FEATURE_NAME } = require('./hooks');
const { start } = require('./daemon');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FINISH',
    name: FEATURE_NAME,
    handler: ({ getContext, getConfig }) => {
      const log = getContext('logger');
      const delay = getConfig('vacuum.delay');
      const interval = getConfig('vacuum.interval');
      const rules = getConfig('vacuum.rules');
      const isPruneEnabled = getConfig('vacuum.prune.enabled');
      const pruneVolumes = getConfig('vacuum.prune.volumes');

      log.info(`docker-vacuum config`, {
        rules,
        delay,
        interval,
        isPruneEnabled,
        pruneVolumes,
      });

      log.info(`Starting docker-vacuum in ${prettyMs(delay)}`);
      setTimeout(
        () => start({ interval, rules, isPruneEnabled, pruneVolumes }, { log }),
        delay,
      );
    },
  });
};
