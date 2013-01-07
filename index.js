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


Compiler.prototype.visitMixin = function(mixin){
  var name = mixin.name.replace(/-/g, '_') + '_mixin'
    , args = mixin.args || ''
    , block = mixin.block
    , attrs = mixin.attrs
    , pp = this.pp;

  if (mixin.call) {
    if (pp) this.buf.push("__indent.push('" + Array(this.indents + 1).join('  ') + "');")
    if (block || attrs.length) {

      this.buf.push(name + '.call({');

      if (block) {
        this.buf.push('block: function(){');

        if (name === 'filter_mixin') this.buf.push('var oldBuf = buf; buf = [];');

        // Render block with no indents, dynamically added when rendered
        this.parentIndents++;
        var _indents = this.indents;
        this.indents = 0;
        this.visit(mixin.block);
        this.indents = _indents;
        this.parentIndents--;

        if (name === 'filter_mixin') this.buf.push('var resBuf = buf; buf = oldBuf; return resBuf.join("")');

        if (attrs.length) {
          this.buf.push('},');
        } else {
          this.buf.push('}');
        }
      }

      if (attrs.length) {
        var val = this.attrs(attrs);
        if (val.inherits) {
          this.buf.push('attributes: merge({' + val.buf
              + '}, attributes), escaped: merge(' + val.escaped + ', escaped, true)');
        } else {
          this.buf.push('attributes: {' + val.buf + '}, escaped: ' + val.escaped);
        }
      }

      if (args) {
        this.buf.push('}, ' + args + ');');
      } else {
        this.buf.push('});');
      }

    } else {
      this.buf.push(name + '(' + args + ');');
    }
    if (pp) this.buf.push("__indent.pop();")
  } else {
    this.buf.push('var ' + name + ' = function(' + args + '){');
    this.buf.push('var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};');
    this.parentIndents++;
    this.visit(block);
    this.parentIndents--;
    this.buf.push('};');
  }
};

function filter() {
  var nested = 0;
  return function (type, options) {
    if (nested === 0)
      if (locals.transformers[type].outputFormat === 'css')
        buf.push('<style>')
      else if (locals.transformers[type].outputFormat === 'js')
        buf.push('<script>')
    nested++;
    buf.push(locals.transformers[type].renderSync(this.block(), options || this.attributes));
    nested--;
    if (nested === 0)
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