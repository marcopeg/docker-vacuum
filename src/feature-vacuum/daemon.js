const prettyMs = require('pretty-ms');

const { dockerSystemPrune } = require('../lib/docker-system-prune');
const { dockerImageBusyList } = require('../lib/docker-image-busy-list');
const { dockerImageRetain } = require('../lib/docker-image-retain');

const loop = async (...args) => {
  const [
    { interval = 600000, rules = [], isPruneEnabled, pruneVolumes },
    { log },
  ] = args;

  const next = () => {
    log.info(`next loop in ${prettyMs(interval)}`);
    setTimeout(() => loop(...args), interval);
  };

  log.info(`run docker-vacuum`, {
    rules,
    interval,
  });

  try {
    // delete dangling images
    if (isPruneEnabled) {
      const args = `${pruneVolumes ? '--volumes' : ''} -f`;
      const pruneResult = await dockerSystemPrune(args);
      log.info('docker system prune', { args, output: pruneResult });
    }

    // Find out images related to running containers
    const busyImages = (await dockerImageBusyList()).map((image) => image.uuid);
    log.verbose('currently used images', { images: busyImages });

    // delete images with retentions
    const { deleted: deletedImages, errors, state } = await dockerImageRetain(
      rules,
      busyImages,
    );
    log.verbose('remove obsolete images (full state)', { state });
    log.info('remove obsolete images', { deletedImages });
    errors.length && log.warn('some images were not removed', { errors });
  } catch (err) {
    log.error(err.message);
    log.debug(err);
  }

  next();
};

// Start interface
// may be enriched with stop/pause
const start = (settings = {}, dependencies) => loop(settings, dependencies);

module.exports = { start };
