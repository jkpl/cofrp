mousePosition = new Signal(eventbus, {x: 0, y: 0});

window.onmousemove = function(e) {
  mousePosition.send({x: event.clientX, y: event.clientY})();
};

mouseClick = new Signal(eventbus, {x: 0, y: 0});

window.document.body.onclick = function(e) {
  mouseClick.send({x: event.clientX, y: event.clientY})();
};
