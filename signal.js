// Base signal that other signals should inherit.
// This registers itself to given eventbus.
function Signal(eventbus, initialValue) {
  this.eventbus = eventbus;
  this.currentValue = initialValue;
  this.sid = eventbus.register(this);
}

Signal.prototype.listen = function(signal) {
  this.eventbus.listen(this, signal);
};

Signal.prototype.send = function(val) {
  this.currentValue = val;
  return this.eventbus.dispatch(this, val);
};

// LiftN works like lifts in Elm.
// This uses MultiSourceChannel to combine the results.
function LiftN(eventbus, fun, signals) {
  var that = this;
  var appliedInitialValue = fun.apply(null, signals.map(function(s){
    return s.currentValue;
  }));

  Signal.call(this, eventbus, appliedInitialValue);

  var channelInitialValues = signals.map(function(s) {
    return {source: s, value: s.currentValue};
  });

  signals.forEach(function(s) {
    that.listen(s);
  });

  this.inbox = new MultiSourceChannel(channelInitialValues);
  this.fun = fun;
}

LiftN.prototype = Object.create(Signal.prototype);

// Common pattern in receiving and responding to messages:
// Receive a change from other signal, calculate result for it,
// and send the result to event bus.
function receiveRespond(signal, callback) {
  return function* () {
    while(true) {
      var message = yield signal.inbox.take();
      var result = callback(message);
      if (typeof result !== 'undefined') {
        yield signal.send(result);
      }
    }
  };
}

LiftN.prototype.runner = function() {
  var that = this;
  return receiveRespond(this, function(messages) {
    return that.fun.apply(null, messages.map(getValue));
  });
};

// FoldP works like foldp in Elm.
// Current value works as the accumulator.
function FoldP(eventbus, fun, initialValue, signal) {
  Signal.call(this, eventbus, initialValue);
  this.inbox = new OneValueChannel();
  this.fun = fun;
  this.listen(signal);
}

FoldP.prototype = Object.create(Signal.prototype);

FoldP.prototype.runner = function() {
  var that = this;
  return receiveRespond(this, function(message) {
    return that.fun.call(null, message.value, that.currentValue);
  });
};
