// The bus that handles dispatching signal changes to right signals.
function EventBus() {
  this.signals = {}; // I ended up not using this.
  this.handlers = new Multimap();
  this.channel = new Channel();
  this.idgenerator = idGenerator();
}

// Include sender information so that it is possible to identify where the
// message should be dispatched to. Also helps MultiSourceChannel to identify
// what parts to replace with an incoming message.
EventBus.prototype.dispatch = function(source, val) {
  return this.channel.put({source: source.sid, value: val});
};

EventBus.prototype.register = function(signal) {
  var id = this.idgenerator();
  this.signals[id] = signal;
  return id;
};

EventBus.prototype.listen = function(handler, signal) {
  this.handlers.put(signal.sid, handler);
};

// Event bus's loop. Receive a message, get handlers for it,
// and dispatch the message to all of those handlers.
EventBus.prototype.runner = function() {
  var that = this;
  return function* () {
    while(true) {
      var message = yield that.channel.take();
      var handlers = that.handlers.values[message.source];
      if (handlers) {
        for (var i = 0; i < handlers.length; i++) {
          var handler = handlers[i];
          yield handler.inbox.put(message);
        }
      }
    }
  };
};

var eventbus = new EventBus();
go(eventbus.runner());
