var k = function() {};
var $ = require('jquery');

var cache = {
  loaded: false,
  map: {},
  records: []
};

var url = 'http://addressbook-api.herokuapp.com/contacts';

exports.all = function(handler) {
  var ref = makeRef(handler);

  notify();

  if (!cache.loaded)
    $.getJSON(url, function(res) {
      pushPayload(res);
      notify();
    });

  function notify() {
    ref.onChange({
      loaded: cache.loaded,
      contacts: cache.records
    });
  }

  return ref;
};

exports.byId = function(id, handler) {
  var ref = makeRef(handler);

  var state = {
    loaded: !!cache.map[id],
    contact: cache.map[id] || {id: id}
  };

  ref.update = function(props) {
    updateRecord(id, props);
    notify();
    $.ajax({
      url: url+'/'+id,
      type: 'put',
      data: {contact: props}
    }, function(res) {
      updateRecord(id, res.contact);
      notify();
    });
  };

  notify();

  if (!state.loaded)
    load();

  function load() {
    $.getJSON(url+'/'+id, function(res) {
      pushRecord(res.contact);
      state.loaded = true;
      state.contact = cache.map[id];
      notify();
    });
  }

  function notify() {
    ref.onChange(state);
  }

  return ref;
};

function makeRef(handler) {
  var ref = {};
  ref.onChange = handler;
  ref.destroy = function() { ref.onChange = k; };
  return ref;
}

function pushPayload(res) {
  res.contacts.forEach(pushRecord);
  cache.loaded = true;
}

function pushRecord(record) {
  // if two refs are racing, ignore
  // a smarter store would know what was being requested and just piggy
  // back on one request for all refs to that resource.
  if (cache.map[record.id])
    return;
  cache.records.push(record);
  cache.map[record.id] = record;
}

function updateRecord(id, props) {
  var record = cache.map[id];
  for (var prop in props)
    record[prop] = props[prop];
}

