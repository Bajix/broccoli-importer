var funnel = require('broccoli-funnel'),
  findup = require('findup-sync'),
  path = require('path');

function resolveBrocfile( module ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath);

  var brocfile = findup('Brocfile.js', {
    cwd: moduleDir,
    nocase: true
  });

  if (brocfile === null) {
    throw new Error('Brocfile.js not found');
  }

  return brocfile;
}

function walkTrees( tree, dirname ) {
  if (typeof tree === 'string') {
    return path.relative(dirname, tree);
  }

  if (typeof tree === 'object' && tree.hasOwnProperty('inputTree')) {
    tree.inputTree = walkTrees(tree.inputTree, dirname);
  }

  if (typeof tree === 'object' && tree.hasOwnProperty('inputTrees')) {
    tree.inputTrees = tree.inputTrees.map(function( tree ) {
      return walkTrees(tree, dirname);
    });
  }

  return tree;
}

function loadBrocfile( module ) {
  var brocfile = resolveBrocfile(module),
    baseDir = path.dirname(brocfile),
    cwd = process.cwd();

  process.chdir(baseDir);

  var tree = require(brocfile);

  tree = walkTrees(tree, cwd);

  process.chdir(cwd);

  return tree;
}

function createTree( module, options ) {
  var modulePath = require.resolve(module),
    moduleDir = path.dirname(modulePath),
    cwd = process.cwd();

  process.chdir(moduleDir);

  var tree = funnel(moduleDir, options);

  tree = walkTrees(tree, cwd);

  process.chdir(cwd);

  return tree;
}

exports.resolveBrocfile = resolveBrocfile;
exports.loadBrocfile = loadBrocfile;
exports.createTree = createTree;