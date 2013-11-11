function setImmediate(fun) {
  window.setTimeout(fun, 0);
}

// Co-routines done using ES6 generators
// http://swannodette.github.io/2013/08/24/es6-generators-and-csp/
function go_(machine, step) {
  while(!step.done) {
    var machineState = step.value();

    switch (machineState.state) {
    case "park":
      setImmediate(function() { go_(machine, step); });
      return;
    case "continue":
      step = machine.next(machineState.value);
      break;
    }
  }
}

function go(machine) {
  var gen = machine();
  go_(gen, gen.next());
}

function continueState(val) {
  return {state: "continue", value: val};
}

function parkState() {
  return {state: "park"};
}
