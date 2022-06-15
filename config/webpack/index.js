const utils = require('../utils');

utils.copySyncIfDoesntExist('./config/main.js', './config/main.local.js');
utils.createIfDoesntExist('./build');
utils.createIfDoesntExist('./build/public');

if (process.env.NODE_ENV === 'production')
{
  module.exports = require('./prod');
}
else if (process.env.NODE_ENV === 'development')
{
  module.exports = require('./dev');
}
else
{
  module.exports = require('./local');
}
