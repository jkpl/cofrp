// Channel for queuing multiple messages.
function Channel() {
  this.values = [];
}

Channel.prototype.put = function(val) {
  var that = this;
  return function() {
    // Putting a value to channel does not block here
    // like it did in the example linked above.
    that.values.push(val);
    return continueState(null);
  };
};

Channel.prototype.take = function() {
  var that = this;
  return function() {
    if (that.values.length === 0) {
      return parkState();
    } else {
      return continueState(that.values.pop());
    }
  };
};

// Channel for only the latest message.
function OneValueChannel() {
}

OneValueChannel.prototype.put = function(val) {
  var that = this;
  return function() {
    that.value = val;
    return continueState(null);
  };
};

OneValueChannel.prototype.take = function() {
  var that = this;
  return function() {
    if (typeof that.value === 'undefined') {
      return parkState();
    } else {
      var value = that.value;
      that.value = undefined;
      return continueState(value);
    }
  };
};

// Channel for messages from multiple sources.
function MultiSourceChannel(initialValues) {
  this.sources = initialValues.map(getSource);
  this.values = initialValues;
  this.hasValue = false;
}

MultiSourceChannel.prototype.put = function(val) {
  var that = this;
  return function() {
    var sourcePos = that.sources.indexOf(val.source);
    if (sourcePos >= 0) {
      that.values[sourcePos] = val;
      that.hasValue = true;
    }
    return continueState(null);
  };
};

MultiSourceChannel.prototype.take = function() {
  var that = this;
  return function() {
    if (that.hasValue) {
      that.hasValue = false;
      return continueState(that.values);
    } else {
      return parkState();
    }
  };
};
