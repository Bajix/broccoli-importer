var exportBrocfile = require('./brocfile'),
  exportBrowser = require('./browser'),
  exportAssets = require('./assets'),
  exportMain = require('./main'),
  exportAMD = require('./amd');

module.exports = [
  exportBrocfile,
  exportBrowser,
  exportAssets,
  exportAMD,
  exportMain
];