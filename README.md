Broccoli Importer
------

A simple tool for exporting assets defined in modules as merge-able trees.

## Install
From NPM:

> npm install broccoli-importer --save

## Import trees heuristically

For packages that don't contain a Brocfile in their directory, `broccoli-importer` will heuristically determine a suitable strategy for exporting file trees. Authors can manually assist in this by either creating an `assets` folder, or defining `directories.assets` within package.json.

### `importTree(module)`

`module` *{NodeJS Module ID}*

```javascript
var importTree = require('broccoli-importer'),
  mergeTrees = require('broccoli-merge-trees');

var trees = [
  'canjs',
  'jquery',
  'bourbon',
].map(importTree);

module.exports = mergeTrees(trees);
```

This should automagically work for most packages.

For packages that contain a Brocfile in their directory, simply require those modules as you would normally, and `broccoli-importer` will take care of finding the Brocfile, and exporting a modified tree with relative paths. This offers a competitive, flexible standard for managing client side assets using npm.

## Manually import module file trees

In cases in which `importTree` does not export as expected, you can use the alternate call signature to manually export assets within those modules, giving much greater flexibility.

### `importTree(module, options)`

`module` *{CommonJS Module name}*

See [NodeJS Modules](https://nodejs.org/api/modules.html#modules_modules)

### `Options`

See [Broccoli Funnel](https://www.npmjs.com/package/broccoli-funnel) for options documentation

The working directory when configuring funnel options is the directory containing the package.json main file.

#### Usage

If the module you're importing has the following file structure:

```
├── LICENSE.md
├── README.md
├── app
│   └── assets
│       └── stylesheets <-- Working Directory while importing
│           ├── _bourbon.scss <-- Package.json Main
│           ├── addons
│           │   ├── ...
│           ├── css3
│           │   ├── ...
│           ├── functions
│           │   ├── ...
│           ├── helpers
│           │   ├── ...
│           └── settings
│               ├── ...
├── package.json
└── pkg
    └── ...
```

And your app has the following file structure:

```
.
├── Brocfile.js
├── assets
│   ├── admin
│   │   ├── controller.js
│   │   ├── main.js
│   │   ├── map.js
│   │   ├── styles.scss
│   │   ├── ui
│   │   │   ├── form.scss
│   │   │   └── layout.scss
│   │   └── views
│   │       └── layout.stache
│   ├── config.js
│   ├── grid
│   │   ├── config.scss
│   │   └── core.scss
│   ├── router
│   │   ├── controller.js
│   │   └── map.js
│   ├── test
│   │   ├── config.js
│   │   ├── index.html
│   │   ├── setup.js
│   │   └── store.js
│   ├── user
│   │   ├── controller.js
│   │   ├── model.js
│   │   ├── styles.scss
│   │   ├── test
│   │   │   ├── fixtures.json
│   │   │   ├── index.html
│   │   │   ├── spec.js
│   │   │   └── store.js
│   │   └── views
│   │       ├── show.stache
│   │       ├── edit.stache
│   │       └── index.stache
│   └── util.js
├── node_modules
│   ├─- ...
├── package.json
```


You can select a subsection of this module via importTree:

```javascript
var mergeTrees = require('broccoli-merge-trees'),
  importTree = require('broccoli-importer'),
  compileSASS = require('broccoli-sass'),
  funnel = require('broccoli-funnel'),
  out = [];

// This exports identically to `importTree('bourbon')`
var bourbon = importTree('bourbon', {
   srcDir: '/', // We're importing relative to node_modules/bourbon/app/assets/stylesheets
   destDir: 'bourbon'
});


// This exports identically to `importTree('canjs')`, except doesn't filter out `jquery.js`
var CanJS = importTree('canjs', {
  srcDir: 'dist/amd'
});

var assets = mergeTrees([
  CanJS,
  bourbon,
  'assets' // Our local assets folder
]);

out.push(assets);
out.push(compileSASS([assets], 'admin/styles.scss', 'admin/styles.css'));
out.push(compileSASS([assets], 'user/styles.scss', 'user/styles.css'));

var out = mergeTrees(out, {
  overwrite: true
});

module.exports = funnel(out, {
  allowEmpty: true,
  exclude: [
    /\.scss/
  ]
});
```

The resulting file tree will look like:

```
.
├── assets
│   ├── user
│   ├── admin
│   │   ├── controller.js
│   │   ├── main.js
│   │   ├── map.js
│   │   ├── styles.css
│   │   └── views
│   │       └── layout.stache
│   ├── bourbon
│   │   └── ...
│   ├── can.js
│   ├── can
│   │   └── ...
│   ├── config.js
│   ├── jquery.js
│   ├── router
│   │   ├── controller.js
│   │   └── map.js
│   ├── test
│   │   ├── config.js
│   │   ├── index.html
│   │   ├── setup.js
│   │   └── store.js
│   ├── user
│   │   ├── controller.js
│   │   ├── model.js
│   │   ├── styles.css
│   │   ├── test
│   │   │   ├── fixtures.json
│   │   │   ├── index.html
│   │   │   ├── spec.js
│   │   │   └── store.js
│   │   └── views
│   │       ├── show.stache
│   │       ├── edit.stache
│   │       └── index.stache
│   └── util.js
```

## License

Broccoli Importer was originally written by [Thomas Sieverding](https://github.com/Bajix) and is licensed under the [MIT license](LICENSE).
