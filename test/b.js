var jquery = require('./utils/jquery');
var common = require('./common-for-ab');
module.exports = {
  name: 'b',
  use: jquery.name,
  use3: common.name
};