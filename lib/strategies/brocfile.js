var findup = require('findup-sync'),
  util = require('../util'),
  path = require('path');

module.exports = function exportBrocfile( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    cwd = process.cwd();

  var brocfile = findup('Brocfile.js', {
    cwd: moduleDir,
    nocase: true
  });

  if (brocfile && path.dirname(brocfile) !== cwd) {
    return util.resolveTree(function() {
      return require(brocfile);
    }, moduleDir);
  }
}
