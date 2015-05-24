var Importer = require('../../index.js');

describe('Broccoli Importer', function() {
  it('Resolves paths', function() {
    var brocfile = Importer.resolveBrocfile('sub-tree');

    assert.match(brocfile, /Brocfile.js$/);
  });
});