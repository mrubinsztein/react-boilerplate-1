/** @jsx React.DOM */
var Route = require('react-nested-router').Route;

module.exports = (
  <Route location="history" handler={require('../components/app')}>
    <Route name="contact" path="/contact/:id" handler={require('../components/contact')} />
  </Route>
);

