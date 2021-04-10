const { exec } = require('./exec');

const dockerSystemPrune = (flags) => exec(`docker system prune ${flags}`);

module.exports = { dockerSystemPrune };
