var resolveTree = require('../resolve-tree'),
  findup = require('findup-sync'),
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
      return resolveTree(function() {
        return funnel(directories.assets);
      }, path.dirname(file));
    }
  }
}
