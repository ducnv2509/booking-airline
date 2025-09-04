function blockScroll (el) {
  var srcollTarget = document.querySelector(el);
  bodyScrollLock.disableBodyScroll(srcollTarget, {
    allowTouchMove: el => {
      while (el && el !== document.body) {
        if (el.getAttribute('body-scroll-lock-ignore') !== null) {
          return true;
        }

        el = el.parentElement;
      }
    },
  });
}

function enableScroll (el) {
  var srcollTarget = document.querySelector(el);
  bodyScrollLock.enableBodyScroll(srcollTarget);
}