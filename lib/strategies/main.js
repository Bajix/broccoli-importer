var resolveTree = require('../resolve-tree'),
  funnel = require('broccoli-funnel'),
  path = require('path'),
  fs = require('fs');

function isDirectory( name, dir ) {
  var pathname = path.join(dir, name),
    stat  = fs.statSync(pathname);

  return stat.isDirectory();
}

function findRoot( module, dir ) {
  var pathnames = fs.readdirSync(dir);

  var folders = [
    'assets',
    'dist',
    'amd'
  ];

  for (var i = 0; i < folders.length; i++) {
    var folder = folders[i];
    if (~pathnames.indexOf(folder)) {
      if (isDirectory(folder, dir)) {
        return findRoot(module, path.join(dir, folder));
      }
    }
  }

  return dir;
}

module.exports = function exportMain( module ) {
  var basename = path.basename(module, '.js').replace(/js$/, ''),
    modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    exportDir = findRoot(module, moduleDir);

  return resolveTree(function() {
    var srcDir = path.relative(moduleDir, exportDir),
      pathnames = fs.readdirSync(exportDir);

    for (var i = 0; i < pathnames.length; i++) {
      var pathname = pathnames[i];
      if (!path.extname(pathname)) {
        if (pathname !== basename && isDirectory(pathname, exportDir)) {
          return funnel('./', {
            srcDir: srcDir,
            destDir: basename
          });
        }
      }
    }

    return srcDir;
  }, moduleDir);
}