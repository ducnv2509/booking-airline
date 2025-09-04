
var scrollTargetLp = 'body > .litepicker';
var elem = document.createElement('div');
elem.classList.add('litepicker-backdrop');
document.body.appendChild(elem);
(function () {
  if (typeof Event !== 'function') {
    window.Event = CustomEvent;
  }
})();

var today = new Date()
today = new Date().setDate(today.getDate());

var lp = [];
var lpr = [];

var titleFrom = 'Từ ngày';
var titleTo = 'Đến ngày';

var opts = {
  format: 'LL, DD MMM, YYYY',

  plugins: window.innerWidth <= 480 ? ['mobilefriendly'] : '',
  lang: 'vi-VN',
  dropdowns: {
    "minYear": 2020,
    "maxYear": 2022,
    "months": true,
    "years": true
  },
  tooltipText: {
    "one": "ngày",
    "other": "ngày"
  },
  mobilefriendly: {
    breakpoint: 480,
  },
}

var optsRange = {
  singleMode: false,
  numberOfColumns: window.innerWidth > 768 ? 2 : 1,
  numberOfMonths: window.innerWidth > 768 ? 2 : 1,
}

var optsRange2ndInput = {
  singleMode: false,
  numberOfColumns: window.innerWidth > 768 ? 2 : 1,
  numberOfMonths: window.innerWidth > 768 ? 2 : 1,
  allowRepick: false,
  minDate: today,
  maxDate: null,
  resetButton: true,
}

function getDayOfTheWeek (el, i, a, lp) {
  if (lp.getDate()) {
    var startDateDofW = lp.getDate().dateInstance.toLocaleString(opts.lang, { weekday: 'short' });
    el.value = el.value.replace('LL', startDateDofW)
  }
  if (lp.getEndDate()) {
    var endDateDofW = lp.getEndDate().dateInstance.toLocaleString(opts.lang, { weekday: 'short' });
    a[i + 1].value = a[i + 1].value.replace('LL', endDateDofW);
  }
}

function isStartDateAddActive (start, end, className) {
  start.classList.remove(className)
  end.classList.remove(className)

  if (isStartDate) {
    start.classList.add(className)
  } else {
    end.classList.add(className)
  }
}

function GetFormattedDate (date) {

  var fullDate = date.dateInstance;
  var day = fullDate.getDate();
  var month = fullDate.getMonth() + 1;
  var year = fullDate.getFullYear();
  return day + " thg " + month + ", " + year;
}
function camelCase (input) {
  return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

function mergeObjects (obj1, obj2) {
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

function getLightpickOption (el) {
  var attr = el.attributes;
  var overideOpts = {
    element: el,
  };
  if (el.getAttribute("lp-single-mode") == 'false') {
    overideOpts = mergeObjects(optsRange, overideOpts);
  }
  for (var key in attr) {
    var element = attr[key];
    if (typeof element === "object") {
      if (!element.name.indexOf('lp-')) {
        var name = camelCase(element.name.replace('lp-', ''))
        var val = element.value
        if (val == 'true') {
          val = true
        }
        if (val == 'false') {
          val = false
        }
        console.log(name)
        overideOpts[name] = val
      }

    }
  }
  return mergeObjects(opts, overideOpts);
}

[].forEach.call(document.querySelectorAll('.lite-picker'), function (el, i, a) {
  var lpOptions = getLightpickOption(el);
  lpicker = new Litepicker(lpOptions).on('hide', function (element) {
    getDayOfTheWeek(el, i, a, lp[i]);
    el.dispatchEvent(new Event('change', { bubbles: true }))
    enableScroll(scrollTargetLp);
  }).on('mobilefriendly.show', function (el) {
    blockScroll(scrollTargetLp);
  }).on('render:day', function (day, date) {
    if (day.classList.contains('is-in-range') | day.classList.contains('is-start-date') | day.classList.contains('is-end-date')) {
      day.setAttribute("lpcurrent", "true")
    }
    if (day.classList.contains('is-start-date')) {
      day.setAttribute("lpstart", "true")
    }
    if (day.classList.contains('is-end-date')) {
      day.setAttribute("lpend", "true")
    }
  }).on('render', function (ui) {
    getDayOfTheWeek(el, i, a, lp[i]);
    if (window.innerWidth <= opts.mobilefriendly.breakpoint) {
      var title = el.getAttribute('header-text');
      ui.querySelector('.container__months').insertAdjacentHTML("afterbegin", '<div class="litepicker-mobile-header"><div class="litepicker-mobile-header--main"><div class="row align-items-center"><div class="col"><div class="litepicker-mobile-header-title h3">' + title + '</div></div><div class="col-auto"><button type="button" class="litepicker__close-action ubg-transparent ubtn-circle-size-default ubtn-square ubg-hover ubg-active dropdown-close"><img src="media/icons-color/subdefault/default/24x24-close.svg" alt=""></button></div></div></div</div>')
      ui.querySelector('.litepicker__close-action').addEventListener('click', function () {
        lp[i].hide()
      })
    }
  });
  lp.push(lpicker)
});

var isStartDate = false;

[].forEach.call(document.querySelectorAll('.lite-picker-range-2nd'), function (el, i, a) {
  if (i % 2 == 0 || i == 0) {
    el.classList.add('lite-picker-range-2nd-start')
    var lpOptions = getLightpickOption(el);
    lpOptions['elementEnd'] = a[i + 1];
    lpOptions = mergeObjects(optsRange2ndInput, lpOptions);
    lpicker = new Litepicker(lpOptions).on('hide', function (element) {

      getDayOfTheWeek(el, i, a, lpr[i / 2]);

      el.dispatchEvent(new Event('change', { bubbles: true }));
      a[i + 1].dispatchEvent(new Event('change', { bubbles: true }));
      el.classList.remove('light-pick-focus')
      a[i + 1].classList.remove('light-pick-focus')
      enableScroll(scrollTargetLp);
    }).on('render:day', function (day, date) {
      // if (window.innerWidth < opts.mobilefriendly.breakpoint) {
      //   day.addEventListener('click', function (e) {
      //     if (isStartDate) {
      //       el.dispatchEvent(new Event('click', { bubbles: true }))

      //     } else {
      //       a[i + 1].dispatchEvent(new Event('click', { bubbles: true }))
      //     }
      //     e.prototype.shouldShown
      //   });
      // }
      if (day.classList.contains('is-in-range') | day.classList.contains('is-start-date') | day.classList.contains('is-end-date')) {
        day.setAttribute("lpcurrent", "true")
      }
      if (day.classList.contains('is-start-date')) {
        day.setAttribute("lpstart", "true")
      }
      if (day.classList.contains('is-end-date')) {
        day.setAttribute("lpend", "true")
      }
      if (this.ui.querySelector('.is-end-date')) {
        if (this.ui.querySelector('.is-end-date').classList.contains('is-flipped')) {
          this.ui.classList.add('backward-selected')
        } else {
          this.ui.classList.remove('backward-selected')
        }
      }

    }).on('show', function (el) {
      if (lpr[i / 2].ui.offsetLeft + lpr[i / 2].ui.offsetWidth >= window.innerWidth) {
        lpr[i / 2].ui.style.left = '';
        lpr[i / 2].ui.style.right = '10px';
      }
      // if (lpr[i / 2].ui.offsetTop + lpr[i / 2].ui.offsetHeight >= window.innerHeight) {
      //   lpr[i / 2].ui.style.top = '';
      //   lpr[i / 2].ui.style.bottom = '10px';
      // }
    }).on('before:click', function (el) {
      if (this.ui.classList.contains('backward-selected')) {
        this.clearSelection()
      }
    }).on('before:show', function (el) {
      var getMindate;
      var getMaxdate;
      if (lpr[i / 2].getStartDate()) {
        getMindate = lpr[i / 2].getStartDate()
      } else {
        getMindate = optsRange2ndInput.minDate
      }

      if (lpr[i / 2].getEndDate()) {
        getMaxdate = lpr[i / 2].getEndDate()
      } else {
        getMaxdate = optsRange2ndInput.maxDate
      }

      if (el.classList.contains('lite-picker-range-2nd-start')) {
        isStartDate = true;
        el.classList.add('light-pick-focus');
        a[i + 1].classList.remove('light-pick-focus');
        if (optsRange2ndInput.allowRepick) {
          lpr[i / 2].setOptions({ minDate: optsRange2ndInput.minDate, maxDate: getMaxdate })
        }

      } else {
        isStartDate = false;
        el.classList.add('light-pick-focus');
        a[i].classList.remove('light-pick-focus');
        if (optsRange2ndInput.allowRepick) {
          lpr[i / 2].setOptions({ maxDate: optsRange2ndInput.maxDate, minDate: getMindate })
        }
      }
    }).on('preselect', function (date1, date2) {
      isStartDateAddActive(a[i + 1], el, 'light-pick-focus');
      if (window.innerWidth < opts.mobilefriendly.breakpoint) {
        if (optsRange2ndInput.allowRepick) {
          if (isStartDate) {
            lpr[i / 2].ui.classList.add('litepicker-start-date')
          } else {
            lpr[i / 2].ui.classList.remove('litepicker-start-date')
          }
          var startDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-from');
          var endDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-to');
          isStartDateAddActive(endDateEl, startDateEl, 'active');
        }
      }
    }).on('mobilefriendly.show', function (el) {
      blockScroll(scrollTargetLp);
      if (!el.classList.contains('lite-picker-range-2nd-start')) {
        setTimeout(function () {
          lpr[i / 2].gotoDate(lpr[i / 2].getEndDate())
        }, 0)
      }
    }).on('render', function (ui) {
      getDayOfTheWeek(el, i, a, lpr[i / 2]);
      if (isStartDate) {
        var title = el.getAttribute('header-text')
      } else {
        var title = a[i + 1].getAttribute('header-text')
      }
      if (window.innerWidth < opts.mobilefriendly.breakpoint) {
        var startDate = '...';
        var endDate = '...';
        if ((lpr[i / 2].getStartDate() && lpr[i / 2].getStartDate())) {
          var startDate = GetFormattedDate(lpr[i / 2].getStartDate())
          var endDate = GetFormattedDate(lpr[i / 2].getEndDate())
        }
        ui.querySelector('.container__months').insertAdjacentHTML("afterbegin", '<div class="litepicker-mobile-header"><div class="litepicker-mobile-header--main"><div class="row align-items-center"><div class="col"><div class="litepicker-mobile-header-title h3">' + title + '</div></div><div class="col-auto"><button type="button" class="litepicker__close-action ubg-transparent ubtn-circle-size-default ubtn-square ubg-hover ubg-active dropdown-close"><img src="media/icons-color/subdefault/default/24x24-close.svg" alt=""></button></div></div></div><div class="litepicker-mobile-header-content"><div class="row row-8"><div class="col"><div class="litepicker-mobile-date litepicker-mobile-date-from"><div class="date">' + startDate + '</div></div></div><div class="col"><div class="litepicker-mobile-date litepicker-mobile-date-to"><div class="date">' + endDate + '</div></div></div></div></div></div>')
        ui.querySelector('.litepicker__close-action').addEventListener('click', function () {
          lpr[i / 2].hide()
        })
        if (optsRange2ndInput.allowRepick) {
          if (isStartDate) {
            lpr[i / 2].ui.classList.add('litepicker-start-date')
          } else {
            lpr[i / 2].ui.classList.remove('litepicker-start-date')
          }
          var startDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-from');
          var endDateEl = lpr[i / 2].ui.querySelector('.litepicker-mobile-date-to');
          isStartDateAddActive(startDateEl, endDateEl, 'active');
          startDateEl.addEventListener('click', function () {
            a[i].dispatchEvent(new Event('click', { bubbles: true }))
          });
          endDateEl.addEventListener('click', function () {
            a[i + 1].dispatchEvent(new Event('click', { bubbles: true }))
          })
        }
      }
    });
    lpr.push(lpicker)
  }
});