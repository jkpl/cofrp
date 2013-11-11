var contentElement = window.document.getElementById("content");
var box1 = window.document.getElementById("box1");
var box2 = window.document.getElementById("box2");

function clickCounter(pos, clicks) {
  return clicks + 1;
}

function positionAndClicksToString(pos, clicks) {
  var position = ["{x: ", pos.x, ", y: ", pos.y, "}"].join("");
  return "[" + [position, clicks].join(", ") + "]";
}

function displayString(str) {
  contentElement.innerHTML = str;
}

function displayResult(result) {
  averageResult.innerHTML = result;
}

function boxSizeForBox1(pos) {
  var rect = box1.getBoundingClientRect(),
      x = Math.max(pos.x - rect.left, 0),
      y = Math.max(pos.y - rect.top, 0);
  box1.style.width = x + "px";
  box1.style.height = y + "px";
}

function boxSizeForBox2(pos) {
  var rect = box2.getBoundingClientRect(),
      x = Math.max(pos.x - rect.left, 0);
  box2.style.width = x + "px";
}

var mouseClickCount = new FoldP(eventbus, clickCounter, 0, mouseClick);

var mousePositionAndClicksToString = new LiftN(
  eventbus, positionAndClicksToString, [mousePosition, mouseClickCount]);

var displayMousePositionAndClicks = new LiftN(
  eventbus, displayString, [mousePositionAndClicksToString]);

var box1SizeFollowsMousePosition = new LiftN(
  eventbus, boxSizeForBox1, [mousePosition]);

var box2SizeFollowsMouseClicks = new LiftN(
  eventbus, boxSizeForBox2, [mouseClick]);

go(mouseClickCount.runner());
go(mousePositionAndClicksToString.runner());
go(displayMousePositionAndClicks.runner());
go(box1SizeFollowsMousePosition.runner());
go(box2SizeFollowsMouseClicks.runner());
