/** @jsx React.DOM */

var React = require('react');
var Link = require('react-nested-router').Link;
var contactStore = require('../stores/contact');

var App = module.exports = React.createClass({

  getInitialState: function() {
    return { loaded: false, contacts: [] };
  },

  componentWillMount: function() {
    this.ref = contactStore.all(this.setStateFromStore);
  },

  componentWillUnmount: function() {
    this.ref.destroy();
  },

  setStateFromStore: function(state) {
    this.setState({
      contacts: state.records,
      loaded: state.loaded
    });
  },

  renderLinks: function() {
    return this.state.contacts.map(function(contact) {
      return <li><Link to="contact" id={contact.id}>{contact.first}</Link></li>
    });
  },

  render: function() {
    return (
      <div className="container">
        <h1>Contacts</h1>
        <ul>
          {this.state.loaded ? this.renderLinks() : <li>Loading ...</li>}
        </ul>
        {this.props.activeRoute || <h2>Welcome</h2>}
      </div>
    );
  }

});

