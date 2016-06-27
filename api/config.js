var baseUrl = '127.0.0.1';
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://192.168.1.2';
}

var user = {
  login: baseUrl + '/login'
};

module.exports = {
  user
};