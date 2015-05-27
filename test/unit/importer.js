var Importer = require('../../lib/importer');

describe('Broccoli Importer', function() {
  it('Resolves paths', function() {
    var brocfile = Importer.resolveBrocfile('sub-tree');

    assert.match(brocfile, /Brocfile.js$/);
  });

  it('Makes paths relative', function() {
    var tree = Importer.loadTree('sub-tree');
    assert.equal(tree, 'lib/sub-tree/assets');
  });
});