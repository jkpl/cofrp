function idGenerator() {
  var lastId = 0;
  return function() {
    return ++lastId;
  };
}

function getSource(o) {
  return o.source.sid;
}

function getValue(o) {
  return o.value;
};

function Multimap() {
  this.values = {};
}

Multimap.prototype.put = function(key, value) {
  var existingValues = this.values[key];
  if (existingValues) {
    existingValues.push(value);
  } else {
    this.values[key] = [value];
  }
};
