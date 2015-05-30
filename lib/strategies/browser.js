var funnel = require('broccoli-funnel'),
  findup = require('findup-sync'),
  util = require('../util'),
  path = require('path');

module.exports = function exportAssets( module ) {
  var basename = path.basename(module, '.js').replace(/js$/, ''),
    modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    cwd = process.cwd();

  var file = findup('package.json', {
    cwd: moduleDir
  }), baseDir = file && path.dirname(file);

  if (baseDir && baseDir !== cwd) {
    var pkg = require(file);

    if (pkg.hasOwnProperty('browser') && typeof pkg.browser === 'string') {
      var exportPath = path.resolve(baseDir, pkg.browser),
        exportDir = path.dirname(exportPath);

      return util.resolveTree(function() {
        return funnel('./', {
          include: [
            path.basename(exportPath, '.js') + '.*'
          ]
        })
      }, exportDir);
    }
  }
}
