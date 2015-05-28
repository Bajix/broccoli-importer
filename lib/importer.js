var resolveTree = require('./resolve-tree'),
  funnel = require('broccoli-funnel'),
  findup = require('findup-sync'),
  path = require('path');

function resolveBrocfile( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath);

  var brocfile = findup('Brocfile.js', {
    cwd: moduleDir,
    nocase: true
  });

  if (brocfile) {
    return resolveTree(function() {
      return require(brocfile);
    }, moduleDir);
  }
}

function loadTree( module ) {
  return resolveBrocfile(module);
}

function createTree( module, options ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath);

  return resolveTree(function() {
    return funnel(moduleDir, options);
  }, moduleDir);
}

exports.resolveBrocfile = resolveBrocfile;
exports.createTree = createTree;
exports.loadTree = loadTree;