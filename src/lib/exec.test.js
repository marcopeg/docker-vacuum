const path = require('path');
const { exec } = require('./exec');

describe('lib/exec', () => {
  test('it should run under cwd', async () => {
    const res = await exec('pwd');
    expect(res.trim()).toEqual(process.cwd());
  });

  test('it should allow to change cwd', async () => {
    const res = await exec('pwd', {
      cwd: __dirname,
    });
    expect(res.trim()).toEqual(__dirname);
  });
});
