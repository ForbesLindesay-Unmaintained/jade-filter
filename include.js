var filter_mixin = (function () {
  var nested = 0;
  return function (type, options) {
    if (0 === nested++) {
      if (locals.transformers[type].outputFormat === 'css')
        buf.push('<style>');
      else if (locals.transformers[type].outputFormat === 'js')
        buf.push('<script>');
    }
    var oldBuf = buf; buf = [];
    this.block();
    oldBuf.push(locals.transformers[type].renderSync(buf.join(''), options || this.attributes));
    buf = oldBuf;
    if (0 === --nested) {
      if (locals.transformers[type].outputFormat === 'css')
        buf.push('</style>');
      else if (locals.transformers[type].outputFormat === 'js')
        buf.push('</script>');
    }
  }
}());