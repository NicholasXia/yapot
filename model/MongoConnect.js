var mongoose = require('mongoose');
var url ='mongodb://localhost/weixincms';
mongoose.connect(url);
global.db = mongoose.createConnection(url);