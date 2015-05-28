var Importer = require('../../lib/importer');

describe('Broccoli Importer', function() {
  it('Makes paths relative', function() {
    var tree = Importer.loadTree('sub-tree');
    assert.equal(tree, 'lib/sub-tree/assets');
  });
});