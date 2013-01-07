/*!
 * Jade - Compiler
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var oldCompiler = require('jade').Compiler;
var transformers = require('transformers');

/**
 * Initialize `Compiler` with the given `node`.
 *
 * @param {Node} node
 * @param {Object} options
 * @api public
 */

var Compiler = function Compiler(node, options) {
  oldCompiler.apply(this, arguments);
};

/**
 * Compiler prototype.
 */

Compiler.prototype = Object.create(oldCompiler.prototype);
Compiler.prototype.constructor = Compiler;



  /**
   * Compile parse tree to JavaScript.
   *
   * @api public
   */

Compiler.prototype.compile = function(){
  this.buf = ['var interp;'];
  if (this.pp) this.buf.push("var __indent = [];");
  this.lastBufferedIdx = -1;
  this.buf.push('var filter_mixin = (' + filter.toString() + '())');
  this.visit(this.node);
  return this.buf.join('\n');
};

function filter() {
  var nested = 0;
  return function (type, options) {
    if (0 === nested++)
      if (locals.transformers[type].outputFormat === 'css')
        buf.push('<style>')
      else if (locals.transformers[type].outputFormat === 'js')
        buf.push('<script>')
    var oldBuf = buf; buf = [];
    this.block()
    oldBuf.push(locals.transformers[type].renderSync(buf.join(''), options || this.attributes));
    buf = oldBuf;
    if (0 === --nested)
      if (locals.transformers[type].outputFormat === 'css')
        buf.push('</style>')
      else if (locals.transformers[type].outputFormat === 'js')
        buf.push('</script>')
  }
}

module.exports = function (obj) {
  obj = obj || {};
  obj.compiler = Compiler;
  obj.transformers = transformers;
  return obj;
};