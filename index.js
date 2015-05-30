var resolveTree = require('./lib/resolve-tree'),
  strategies = require('./lib/strategies'),
  funnel = require('broccoli-funnel'),
  path = require('path');

function loadTree( module ) {
  for (var i = 0; i < strategies.length; i++) {
    var treeExporter = strategies[i],
      tree = treeExporter(module);

    if (tree) {
      return tree;
    }
  }
}

function createTree( module, options ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath);

  return resolveTree(function() {
    return funnel(moduleDir, options);
  }, moduleDir);
}

module.exports = function( moduleName, options ) {
  var dirname = module.parent ? path.dirname(module.parent.id) : process.cwd();

  if (~moduleName.indexOf('./')) {
    moduleName = path.resolve(dirname, moduleName);
  }

  if (arguments.length === 2) {
    return createTree.apply(this, arguments);
  }
  return loadTree.apply(this, arguments);
}

delete require.cache[__filename];