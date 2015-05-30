var funnel = require('broccoli-funnel'),
  findup = require('findup-sync'),
  util = require('../util'),
  path = require('path'),
  fs = require('fs');

function findRoot( module, dir ) {
  var pathnames = fs.readdirSync(dir),
    basename = path.basename(module, '.js').replace(/js$/, '')

  var folders = [
    'assets',
    'dist',
    'amd'
  ];

  for (var i = 0; i < folders.length; i++) {
    var folder = folders[i];
    if (~pathnames.indexOf(folder)) {
      if (util.isDirectory(folder, dir)) {
        return findRoot(module, path.join(dir, folder));
      }
    }
  }

  var includes = pathnames.filter(function( pathname ) {
    return ~pathname.indexOf(basename);
  });

  if (includes.length > 0) {
    var excludes = pathnames.filter(function( pathname ) {
      if (pathname !== basename && util.isDirectory(pathname, dir)) {
        return true;
      }
      return false;
    });

    if (excludes.length === 0) {
      return dir;
    }
  }

  return false;
}

module.exports = function exportAMD( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    baseDir = findRoot(module, moduleDir),
    basename = path.basename(module, '.js').replace(/js$/, '')

  if (baseDir) {
    return util.resolveTree(function() {
      return funnel('./', {
        include: [
          basename + '/**/*',
          basename + '.*'
        ]
      })
    }, baseDir);
  }
}