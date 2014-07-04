/** @jsx React.DOM */

var React = require('react');
var contactStore = require('../stores/contact');

var Contact = module.exports = React.createClass({

  getInitialState: function() {
    return { loaded: false, contact: {} };
  },

  componentWillMount: function() {
    this.ref = contactStore.byId(this.props.params.id, this.setStateFromStore);
  },

  componentWillUnmount: function() {
    this.ref.destroy();
  },

  setStateFromStore: function(state) {
    this.setState({
      contact: state.contact,
      loaded: state.loaded
    });
  },

  editName: function() {
    var name = prompt('First and last please').split(/\s/);
    this.ref.update({ first: name[0], last: name[1] });
  },

  render: function() {
    if (!this.state.loaded) {
      return <div><h2>Loading ...</h2></div>;
    }
    var contact = this.state.contact;
    return (
      <div>
        <h2>{contact.first} {contact.last}</h2>
        <img src={contact.avatar || 'http://placekitten.com/100/100'} height="100" width="100"/>
        <br/>
        <button onClick={this.editName}>Edit Name</button>
      </div>
    );
  }
});

