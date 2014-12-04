/** @jsx React.DOM */

var React = require('react');

var Band = React.createClass({
  render: function() {
    return (
      <div class="band-description">
        <h2>{this.props.name}</h2>
        <p>{this.props.description}</p>
      </div>
    );
  }
});

module.exports = Band;