$.fn.extend({
  toggleText: function (a, b) {
    return this.text(this.text() == b ? a : b);
  }
});

$.fn.toggleReadonly = function () {
  return this.each(function () {
    var $this = $(this);
    if ($this.prop('readonly')) {
      $this.prop('readonly', false);
    } else {
      $this.prop('readonly', true);
    }
  });
};

$(document).ready(function () {
  // btn inside accodion
  $('[data-control] [data-toggle="modal"]').on('click', function (e) {
    e.stopPropagation();
    $($(this).attr('data-target')).modal('show')
  })
  // end btn inside accodion
  $('.flight-bottom-mobile-sticky-overlay').on('click', function () {
    $('.flight-bottom-mobile-sticky [data-control]').trigger('click')
  })
  $('.chekcbox-show-hide input').on('change', function () {
    var id = $(this).attr('id').replace('for-', '');
    if ($(this).is(':checked')) {
      $('#' + id).removeClass('section-hide');
    } else {
      $('#' + id).addClass('section-hide')
    }
  })
  $('body').addClass('body-two-way')
  $('[name=pageSelect]').on('change', function () {
    $('body').removeClass('body-one-way')
    $('body').removeClass('body-two-way');
    if ($(this).is(':checked')) {
      $('body').addClass($(this).attr('value'))
    }
  });
  $('[toggle-show]').on('click', function () {
    var id = $(this).attr('toggle-show');
    var idEl = '[toggle-show-id=' + id + ']';
    $(idEl).toggleClass('show');
    var modalHeight = $(idEl).find('.uinline-modal-wrap').height();
    if ($(idEl).hasClass('show') && deviceIsMobile) {
      blockScroll(idEl + ' .modal-body')
    } else {
      enableScroll(idEl + ' .modal-body')
    }
    $(idEl).find('.uinline-modal-backdrop').toggleClass('show').css('height', modalHeight);
  });
  $('.uinline-modal-backdrop').on('click', function () {
    var id = $(this).attr('toggle-show');
    var idEl = '[toggle-show-id=' + id + ']';
    if (deviceIsMobile) {
      enableScroll(idEl + ' .modal-body')
    }
    $(idEl).removeClass('show');
    $(this).removeClass('show');
  })
  if ($(window).width() <= 480) {
    $('body').append('<div class="dropdown-backdrop"></div>')
  }
  var dropdownMenu;
  $('.dropdown').on('shown.bs.dropdown', function (e) {
    dropdownMenu = $(e.target);
  });

  $('.dropdown-mobile-wrap').on('shown.bs.dropdown', function (e) {
    if ($(window).width() <= 480) {
      blockScroll('body > .dropdown-mobile.show .dropdown-body');
    }
    $('.dropdown-backdrop').addClass('show');
  });

  $('.dropdown-mobile-wrap').on('hide.bs.dropdown', function (e) {
    if ($(window).width() <= 480) {
      enableScroll('body > .dropdown-mobile.show .dropdown-body');
    }
    $('.dropdown-backdrop').removeClass('show');
  });

  $('.dropdown-select-search').on('shown.bs.dropdown', function (e) {
    if (window.innerWidth > 480) {
      document.querySelector('.dropdown-menu.show input').focus()
    }
  });

  $(document).on('click', '.dropdown-menu.show .dropdown-select-list > li', function () {
    var dataAttr = $(this).data();
    Object.keys(dataAttr).forEach(function (el) {
      dropdownMenu.find('[data-' + el + ']').html(dataAttr[el]).addClass('color-default')
      if (el == 'title') {
        document.querySelector('.dropdown-menu.show .form-group [data-' + el + ']').value = dataAttr[el]
        document.querySelector('.dropdown-menu.show .form-group [data-' + el + ']').dispatchEvent(new Event('change', { bubbles: true }))

      }

    });
    $(this).addClass('selected');
    dropdownMenu.find('[data-toggle="dropdown"]').dropdown('toggle');
  });
  $('.dropdown-close').on('click', function () {
    dropdownMenu.find('[data-toggle="dropdown"]').dropdown('toggle')
  });

  $(document).on('change', '.dropdown-menu.show .dropdown-select-multiple-list > li [type="checkbox"]', function () {
    console.log(dropdownMenu)
    dropdownMenu.find('[data-title]').html('3 hãng hàng không').addClass('color-default');
  });

})


if (document.querySelector('.glider-flight-history')) {

  var gliderFlightHistory = new Glider(document.querySelector('.glider-flight-history'), {
    slidesToScroll: 1,
    slidesToShow: 4,
    draggable: true,
    duration: 2,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        }
      }, {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
        }
      }, {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }, {
        breakpoint: 0,
        settings: {
          slidesToShow: 1.2,
        }
      }
    ]
  });
}

if (document.querySelector('.glider-flight-list-date')) {
  var gliderFlightDate = new Glider(document.querySelector('.glider-flight-list-date'), {
    slidesToScroll: 1,
    slidesToShow: 7,
    draggable: true,
    duration: 2,
    arrows: {
      prev: '.flight-list-date .gliderjs-prev',
      next: '.flight-list-date .gliderjs-next'
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 7,
        }
      }, {
        breakpoint: 0,
        settings: {
          slidesToShow: 'auto',
          itemWidth: 70,
        }
      }
    ]
  });
}

if (document.querySelector('.glider-ticket')) {
  var gliderTicket = new Glider(document.querySelector('.glider-ticket'), {
    slidesToShow: 1,
    draggable: true,
    draggable: false,
    scrollLock: true,
    dots: '.dots',
    arrows: {
      prev: '.glider-prev',
      next: '.glider-next'
    }
  });
  $('#modalTicket').on('shown.bs.modal', function () {
    gliderTicket.refresh()
  })
}