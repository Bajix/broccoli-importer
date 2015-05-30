var exportBrocfile = require('./brocfile'),
  exportAssets = require('./assets'),
  exportMain = require('./main'),
  exportAMD = require('./amd');

module.exports = [
  exportBrocfile,
  exportAssets,
  exportAMD,
  exportMain
];