const list = document.querySelector("main ul");

function scrollHorizontally(e) {
  e = window.event || e;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  list.scrollLeft -= (delta * 60); // Multiplied by 40
  e.preventDefault();
}

if (list.addEventListener) {
  // IE9, Chrome, Safari, Opera
  list.addEventListener('mousewheel', scrollHorizontally, false);
  // Firefox
  list.addEventListener('DOMMouseScroll', scrollHorizontally, false);
} else {
  // IE 6/7/8
  list.attachEvent('onmousewheel', scrollHorizontally);
}