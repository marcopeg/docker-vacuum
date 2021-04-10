const { exec } = require('./exec');

const dockerRmi = async (imageId) => exec(`docker rmi -f ${imageId}`);

module.exports = { dockerRmi };
