const bytes = require('bytes');
const moment = require('moment');
const { exec } = require('./exec');

const separator = '-:@:-';

const parseLine = (line) => {
  const [uuid, digest, repository, tag, lifetime, ctime, size] = line.split(
    separator,
  );
  return {
    repository,
    tag,
    uuid,
    digest,
    lifetime,
    ctime: {
      string: ctime,
      date: moment(ctime, 'YYYY-MM-DD hh:mm:ss'),
    },
    size: {
      string: size,
      bytes: bytes(size),
    },
  };
};

const parseResponse = (res) => {
  const lines = res
    .trim()
    .split('\n')
    .filter((line) => line.trim());
  return lines.map(parseLine);
};

const dockerImages = async () => {
  const res = await exec(
    `docker images --format "{{.ID}}${separator}{{.Digest}}${separator}{{.Repository}}${separator}{{.Tag}}${separator}{{.CreatedSince}}${separator}{{.CreatedAt}}${separator}{{.Size}}"`,
  );
  return parseResponse(res);
};

module.exports = { parseLine, parseResponse, dockerImages };
