jade-filter
===========

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/jade-filter.svg)](https://greenkeeper.io/)

Filter mixin for jade using transformers

This module over-rides the compiler for jade so that you get completely re-vamped filter support built on top of mixins.  You can use any of the filters in [transformers](https://github.com/ForbesLindesay/transformers).  Note that to use any of these transformations you must also have the corresponding library installed.

## API

```javascript
var jade = require('jade');
var filter = require('jade-filter');

jade.renderFile('path/to/file.jade', filter(optionsAndLocals), function (err, res) {
  //res
});
```

## Examples

### Render some markdown inline

```jade
+filter('markdown').
  # Heading 1

  Hello from some **markdown**.
```

### Render some markdown from a file

```jade
+filter('markdown')
  include path/to/markdown.md
```

### Minify some coffee-script

The following example will compile the coffee-script to JavaScript, then minify it and wrap it in the propper script tags.

```jade
+filter('uglify')
  +filter('coffee').
    value = 42
```

