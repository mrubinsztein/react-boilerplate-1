var genericStore = require('./generic');

module.exports = genericStore({
  url: 'http://addressbook-api.herokuapp.com/contacts',
  rootKey: 'contact'
});

