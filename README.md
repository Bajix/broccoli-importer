Broccoli Importer
------

A simple tool for resolving Brocfiles defined in modules as merge-able trees.

## Install
From NPM:

> npm install broccoli-importer --save

## Import external brocfile trees

For packages that contain a Brocfile in their directory, simply require those modules as you would normally, and `broccoli-importer` will take care of finding the Brocfile, and exporting a modified tree with relative paths. This offers a competitive, flexible standard for managing client side assets using npm.

### `importTree(module)`

`module` *{NodeJS Module ID}*


```javascript
var importTree = require('broccoli-importer'),
  mergeTrees = require('broccoli-merge-trees');

var trees = [
  'canjs',
  'jquery',
  'bourbon',
  'bitters',
].map(importTree);

module.exports = mergeTrees(trees);
```

`importTree` will resolve each module, find it's Brocfile and export a modified tree with proper relative paths.

## Manually import module file trees

In a lot of cases, modules won't have defined brocfiles. In those cases, you can use the alternate call signature to pull in assets within those modules.

### `importTree(module, options)`

`module` *{CommonJS Module name}*

See [NodeJS Modules](https://nodejs.org/api/modules.html#modules_modules)

### `Options`

See [Broccoli Funnel](https://www.npmjs.com/package/broccoli-funnel) for options documentation

The working directory when configuring funnel options is the directory containing the package.json main file.

#### Usage

If the module you're importing has the following file structure:

```bash
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

```bash
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

var bourbon = importTree('bourbon', {
   srcDir: '/', // We're importing relative to node_modules/bourbon/app/assets/stylesheets
   destDir: 'bourbon'
});

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
    /\.scss/,
    /test/
  ]
});

```

## License

Broccoli Importer was originally written by [Thomas Sieverding](https://github.com/Bajix) and is licensed under the [MIT license](LICENSE).
