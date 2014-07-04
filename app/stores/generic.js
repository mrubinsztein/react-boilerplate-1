var k = function() {};
var $ = require('jquery');

module.exports = function(config) {

  var store = {};

  var cache = {
    loaded: false,
    map: {},
    records: []
  };

  store.all = function(handler) {
    var ref = makeRef(handler);

    notify();

    if (!cache.loaded)
      $.getJSON(config.url, function(res) {
        pushPayload(res);
        notify();
      });

    function notify() {
      ref.onChange({
        loaded: cache.loaded,
        records: cache.records
      });
    }

    return ref;
  };

  store.byId = function(id, handler) {
    var ref = makeRef(handler);

    var state = {
      loaded: !!cache.map[id],
      record: cache.map[id] || {id: id}
    };

    ref.update = function(props) {
      updateRecord(id, props);
      notify();
      var data = {};
      data[config.rootKey] = props;
      $.ajax({
        url: config.url+'/'+id,
        type: 'put',
        data: data
      }, function(res) {
        updateRecord(id, res[config.rootKey]);
        notify();
      });
    };

    notify();

    if (!state.loaded)
      load();

    function load() {
      $.getJSON(config.url+'/'+id, function(res) {
        pushRecord(res[config.rootKey]);
        state.loaded = true;
        state.record = cache.map[id];
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
    res[config.rootKey+'s'].forEach(pushRecord);
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

  return store;

};

