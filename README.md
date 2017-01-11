### 1.compiler and compilation:
Among the two most important resources while developing plugins are the compiler and compilation objects. Understanding their roles is an important first step in extending the Webpack engine.

The `compiler` object represents the fully configured Webpack environment. This object is built once upon starting Webpack, and is configured with all operational settings including options, loaders, and plugins. When applying a plugin to the Webpack environment, the plugin will receive a reference to this compiler. Use the compiler to access the main Webpack environment.

A `compilation` object represents a single build of versioned assets. While running Webpack development middleware, a new compilation will be created each time a file change is detected, thus generating a new set of compiled assets. A compilation surfaces information about the present state of module resources, compiled assets, changed files, and watched dependencies. The compilation also provides many callback points at which a plugin may choose to perform custom actions.

### 2.The structure of compiler instance as follows:
```js
 Compiler {
  _plugins: {},
  outputPath: '',
  outputFileSystem: null,
  inputFileSystem: null,
  recordsInputPath: null,
  recordsOutputPath: null,
  records: {},
  fileTimestamps: {},
  contextTimestamps: {},
  resolvers: 
   { normal: Tapable { _plugins: {}, fileSystem: null },
     loader: Tapable { _plugins: {}, fileSystem: null },
     context: Tapable { _plugins: {}, fileSystem: null } },
  parser: 
   Parser {
     _plugins: 
      { 'evaluate Literal': [Object],
        'evaluate LogicalExpression': [Object],
        'evaluate BinaryExpression': [Object],
        'evaluate UnaryExpression': [Object],
        'evaluate typeof undefined': [Object],
        'evaluate Identifier': [Object],
        'evaluate MemberExpression': [Object],
        'evaluate CallExpression': [Object],
        'evaluate CallExpression .replace': [Object],
        'evaluate CallExpression .substr': [Object],
        'evaluate CallExpression .substring': [Object],
        'evaluate CallExpression .split': [Object],
        'evaluate ConditionalExpression': [Object],
        'evaluate ArrayExpression': [Object] },
     options: undefined },
  options: 
   { entry: 
      [ '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/webpack-dev-server/client/index.js?http://localhost:8080',
        './index.js' ],
     output: 
      { publicPath: '',
        filename: 'bundle.js',
        path: '/',
        libraryTarget: 'var',
        sourceMapFilename: '[file].map[query]',
        hotUpdateChunkFilename: '[id].[hash].hot-update.js',
        hotUpdateMainFilename: '[hash].hot-update.json',
        crossOriginLoading: false,
        hashFunction: 'md5',
        hashDigest: 'hex',
        hashDigestLength: 20,
        sourcePrefix: '\t',
        devtoolLineToLine: false },
     module: 
      { loaders: [Object],
        unknownContextRequest: '.',
        unknownContextRecursive: true,
        unknownContextRegExp: /^\.\/.*$/,
        unknownContextCritical: true,
        exprContextRequest: '.',
        exprContextRegExp: /^\.\/.*$/,
        exprContextRecursive: true,
        exprContextCritical: true,
        wrappedContextRegExp: /.*/,
        wrappedContextRecursive: true,
        wrappedContextCritical: false },
     plugins: [ HelloWorldPlugin {} ],
     context: '/Users/qingtian/Desktop/webpack-demo-plugin',
     debug: false,
     devtool: false,
     cache: true,
     target: 'web',
     node: 
      { console: false,
        process: true,
        global: true,
        setImmediate: true,
        __filename: 'mock',
        __dirname: 'mock' },
     resolve: 
      { fastUnsafe: [],
        alias: {},
        packageAlias: 'browser',
        modulesDirectories: [Object],
        packageMains: [Object],
        extensions: [Object] },
     resolveLoader: 
      { fastUnsafe: [],
        alias: {},
        modulesDirectories: [Object],
        packageMains: [Object],
        extensions: [Object],
        moduleTemplates: [Object] },
     optimize: { occurenceOrderPreferEntry: true } },
  context: '/Users/qingtian/Desktop/webpack-demo-plugin' }
```
### 3.Examples
 example 1:
```js
HelloWorldPlugin.prototype.apply = function(compiler) {
   console.log('----------compiler--------');
  // Setup callback for accessing a compilation:
  compiler.plugin("compilation", function(compilation) {
    // Now setup callbacks for accessing compilation steps:
    compilation.plugin("optimize", function() {
      console.log("Assets are being optimized.");
    });
  });
};
```
Because `compiler` object is built once upon starting Webpack,so the first console.log will print once,while the second one will always print while file changes!
example 2(webpack-md5-hash):
```js
"use strict";
var md5 = require("md5");
function compareModules(a,b) {
    if (a.resource < b.resource) {
        return -1;
    }
    if (a.resource > b.resource) {
        return 1;
    }
    return 0;
}
function getModuleSource (module) {
    var _source = module._source || {};
    return _source._value || "";
}
function concatenateSource (result, module_source) {
    return result + module_source;
}
function WebpackMd5Hash () {
}
WebpackMd5Hash.prototype.apply = function(compiler) {
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("chunk-hash", function(chunk, chunkHash) {
            var source = chunk.modules.sort(compareModules).map(getModuleSource).reduce(concatenateSource, ''); // we provide an initialValue in case there is an empty module source. Ref: http://es5.github.io/#x15.4.4.21
            var chunk_hash = md5(source);
            //source is content of file
            chunkHash.digest = function () {
                return chunk_hash;
            };
        });
    });
};
module.exports = WebpackMd5Hash;
```
note:This example shows how to write a pluin of your own. Webpack-md5-hash have  disadvantages over chunkhash by generating a unqiue  hash value for every files . so, the change of hash of one file will not affect the other.
`(1)chunk.modules`: An array of modules that are included into a chunk. By extension(`module.fileDependencies`), you may look through each module's dependencies to see what raw source files fed into a chunk.The structure of module as follows(abridged):
```js
DependenciesBlock {
  dependencies: 
   [ CommonJsRequireDependency {
       module: [Object],
       request: './PooledClass',
       userRequest: './PooledClass',
       range: [Object],
       loc: [Object],
       optional: false },
     RequireHeaderDependency { module: null, range: [Object], loc: [Object] },
     CommonJsRequireDependency {
       module: [Object],
       request: './ReactElement',
       userRequest: './ReactElement',
       range: [Object],
       loc: [Object],
       optional: false },
     RequireHeaderDependency { module: null, range: [Object], loc: [Object] },
     CommonJsRequireDependency {
       module: [Object],
       request: 'fbjs/lib/emptyFunction',
       userRequest: 'fbjs/lib/emptyFunction',
       range: [Object],
       loc: [Object],
       optional: false },
     RequireHeaderDependency { module: null, range: [Object], loc: [Object] },
     CommonJsRequireDependency {
       module: [Object],
       request: './traverseAllChildren',
       userRequest: './traverseAllChildren',
       range: [Object],
       loc: [Object],
       optional: false },
     RequireHeaderDependency { module: null, range: [Object], loc: [Object] } ],
  blocks: [],
  variables: [],
  context: '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/react/lib',
  reasons: [ ModuleReason { module: [Object], dependency: [Object] } ],
  debugId: 1058,
  lastId: -1,
  id: 80,//Here if id
  index: 80,
  index2: 88,
  chunks: //modules.chunks
   [ Chunk {
       id: 0,
       ids: [Object],
       name: 'main',
       modules: [Object],
       chunks: [],
       parents: [],
       blocks: [],
       origins: [Object],
       files: [],
       rendered: false,
       entry: true,
       initial: true } ],
  warnings: [],
  dependenciesWarnings: [],
  errors: [],
  dependenciesErrors: [],
  request: '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/react/lib/ReactChildren.js',
  userRequest: '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/react/lib/ReactChildren.js',
  rawRequest: './ReactChildren',
  parser: 
   Parser {
     _plugins: 
      { },
     options: undefined,
     scope: undefined,
     state: undefined,
     _currentPluginApply: undefined },
  resource: '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/react/lib/ReactChildren.js',//location of  module
  loaders: [],
  fileDependencies: [ '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/react/lib/ReactChildren.js' ],
  contextDependencies: [],
  error: null,
  _source: 
   OriginalSource {},
  meta: {},
  assets: {},
  built: true,
  _cachedSource: null,
  issuer: '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/react/lib/React.js',
  optional: false,
  building: undefined,
  buildTimestamp: 1484118529082,
  cacheable: true }
```
so,`module.resource` is location of the file in local disk. Structure of module._source is bellow:
```js
 _source: 
   OriginalSource {
     _value: '',//here is the source code of the file
     _name: '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/react-dom/lib/EnterLeaveEventPlugin.js' 
    },
```
It is clealy that module._source._value is the source code of the local file.

`(2)chunk.files`:An array of *output filenames* generated by the chunk. You may access these asset sources from theAn array of chunks (build outputs) in the compilation. Each chunk manages the composition of a final rendered assets. compilation.assets table.

`(3)compilation.chunks`:An array of chunks (build outputs) in the compilation. Each chunk manages the composition of a final rendered assets.

`(4)module.fileDependencies`: An array of source file paths included into a module. This includes the source JavaScript file itself (ex: index.js), and all dependency asset files (stylesheets, images, etc) that it has required. Reviewing dependencies is useful for seeing what source files belong to a module.As follows:
```js
resource: '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/debug/src/browser.js',
  loaders: [],
  fileDependencies: [ '/Users/qingtian/Desktop/webpack-demo-plugin/node_modules/debug/src/browser.js' ]
```
 
`(5)compilation.modules`: An array of modules (built inputs) in the compilation. Each module manages the build of a raw file from your source library.

Tips:This plugin of webpack-md5-hash solve the problem of chunkhash whose calculation of hash will combine the entry of js file and it's required css files which will result in that one file change will trigger the hash change of another file. But,with this plugin and `extract-text-webpack-plugin`, you will find that css files is separated from js file as a independent chunk, so ,we can calculate each hash individually!

### 4.Monitoring the watch graph
While running Webpack middleware, each compilation includes a fileDependencies array (`what files are being watched`) and a `fileTimestamps` hash that maps watched file paths to a timestamp. These are extremely useful for detecting what files have changed within the compilation:
Here is an example of fileTimestamp structure:
```js
 fileTimestamps: 
      { '/Users/sss/Desktop/webpack-demo-plugin/README.md': 1484127527000,
        '/Users/sss/Desktop/webpack-demo-plugin/ind.js': 1484127683648,
      }
```

```javascript
function MyPlugin() {
  this.startTime = Date.now();
  this.prevTimestamps = {};
}
MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    var changedFiles = Object.keys(compilation.fileTimestamps).filter(function(watchfile) {
      return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
    }.bind(this));
    this.prevTimestamps = compilation.fileTimestamps;
    callback();
  }.bind(this));
};

module.exports = MyPlugin;
```
You may also feed new file paths into the watch graph to receive compilation triggers when those files change. Simply push valid filepaths into the compilation.fileDependencies array to add them to the watch. Note: the fileDependencies array is rebuilt in each compilation, so your plugin must push its own watched dependencies into each compilation to keep them under watch.

### 5.Changed chunks
Similar to the watch graph, it's fairly simple to monitor changed chunks (or modules, for that matter) within a compilation by tracking their hashes.

```js
function MyPlugin() {
  this.chunkVersions = {};
}
MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    var changedChunks = compilation.chunks.filter(function(chunk) {
      var oldVersion = this.chunkVersions[chunk.name];
      //using chunk.name as key
      this.chunkVersions[chunk.name] = chunk.hash;
      return chunk.hash !== oldVersion;
    }.bind(this));
    callback();
  }.bind(this));
};
module.exports = MyPlugin
```















