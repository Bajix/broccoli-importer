var findup = require('findup-sync'),
  util = require('../util'),
  path = require('path');

module.exports = function exportAssets( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    cwd = process.cwd();

  var file = findup('package.json', {
    cwd: moduleDir
  });

  if (file && path.dirname(file) !== cwd) {
    var pkg = require(file),
      directories = pkg.directories;

    if (directories.hasOwnProperty('assets')) {
      return util.resolveTree(function() {
        return funnel(directories.assets);
      }, path.dirname(file));
    }
  }
}
