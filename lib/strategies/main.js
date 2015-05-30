var funnel = require('broccoli-funnel'),
  util = require('../util'),
  path = require('path'),
  fs = require('fs');

function findRoot( module, dir ) {
  if (~dir.indexOf('dist/cjs')) {
    return findRoot(module, path.resolve(dir, '../'));
  }

  var pathnames = fs.readdirSync(dir);

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

  return dir;
}

module.exports = function exportMain( module ) {
  var basename = path.basename(module, '.js').replace(/js$/, ''),
    modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    exportDir = findRoot(module, moduleDir);

  return util.resolveTree(function() {
    var srcDir = path.relative(moduleDir, exportDir) || '/',
      pathnames = fs.readdirSync(exportDir);

    for (var i = 0; i < pathnames.length; i++) {
      var pathname = pathnames[i];
      if (!~pathname.indexOf(basename)) {
        return funnel('./', {
          srcDir: srcDir,
          destDir: basename,
          exclude: [
            'package.json',
            'bower.json',
            'README.md'
          ]
        });
      }
    }

    return funnel('./', {
      srcDir: srcDir,
      exclude: [
        'package.json',
        'bower.json',
        'README.md',
        'LICENSE'
      ]
    });
  }, moduleDir);
}