exports.config = {
  specs: ['testing/test-spec.js'],
  capabilities: {
    browserName: 'chrome',
    platformName: 'Android',
    platformVersion: '7.0',
    deviceName: 'Android Emulator'
  },
  allScriptsTimeout: 50000
};
