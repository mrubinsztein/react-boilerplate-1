/** @jsx React.DOM */

var React = require('react');
var Link = require('react-router').Link;
var Band = require('./band');

var App = module.exports = React.createClass({

  render: function() {
    return (
      <div className="container">
        <Band name="The Beatles" description="This should be a long description..." />
        <ul>
          <li><Link to="index">Home</Link></li>
          <li><Link to="album">Foo</Link></li>
          <li><Link to="bar">Bar</Link></li>
        </ul>
        {this.props.activeRouteHandler()}
      </div>
    );
  },

  renderIndex: function() {
    return (
      <div>
        <h2>Index</h2>
      </div>
    );
  }

});

