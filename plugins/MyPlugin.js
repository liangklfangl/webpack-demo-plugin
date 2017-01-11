function HelloWorldPlugin(options) {
  // Setup the plugin instance with options...
}

/*
 Plugins are instanceable objects with an apply method on their prototype. This apply method is 
 called once by the Webpack compiler while installing the plugin. The apply method is given a 
 reference to the underlying Webpack compiler, which grants access to compiler callbacks
*/
HelloWorldPlugin.prototype.apply = function(compiler) {
  // console.log(compiler);
  // compiler.plugin('done', function() {
  //   console.log('Hello World!'); 
  // });
   // console.log('----------compiler--------');
  // Setup callback for accessing a compilation:
  compiler.plugin("compilation", function(compilation) {
     compilation.plugin("chunk-hash", function(chunk, chunkHash) {
         chunk.modules.forEach(function(module,index){
            console.log('chunk--->\\n',module);
         });
     })
    // Now setup callbacks for accessing compilation steps:
    compilation.plugin("optimize", function() {
      console.log("Assets are being optimized.");
    });
  });
};

module.exports = HelloWorldPlugin;