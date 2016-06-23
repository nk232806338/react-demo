var jquery = require('./utils/jquery');
var es6 = require('./es6');
var common = require('./common-for-ab');
module.exports = {
  name: 'a',
  use: jquery.name,
  use2: es6.name,
  use3: common.name
};