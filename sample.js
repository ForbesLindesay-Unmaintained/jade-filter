var jade = require('jade');

jade.renderFile('temp.jade', require('./')(), function (err, res) {
  if (err) throw err;
  console.log(res);
})