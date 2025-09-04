//====================BOOTSTRAP INIT=================//

var scrollTargetModal = '.modal.show .modal-body';

$(document).on('show.bs.modal', '.modal', function (event) {
  var zIndex = 1040 + (10 * $('.modal:visible').length);
  $(this).css('z-index', zIndex);
  setTimeout(function () {
    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
  }, 0);
});
$(document).ready(function () {
  $('[data-tooltip]').tooltip({
    container: 'body',
    boundary: 'window',
    html: true
  });
  $('[data-tooltip-full]').tooltip({
    template: '<div class="tooltip tooltip-full" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
    container: 'body',
    boundary: 'window',
    html: true
  });

  $('[data-toast=toast]').on('click', function () {
    var id = $(this).attr('toast-target');
    $(id).toast('show')
  })
  $('.toast').toast({
    delay: 300000
  })
  $('.modal').on('shown.bs.modal', function (e) {
    $('[data-tooltip]').tooltip('hide');
    var modalId  = $(this).attr('id');
    if ($(window).width() < 769) {
      blockScroll('#' + modalId + '.show');
    }
  });

  $('.modal').on('hide.bs.modal', function (e) {
    var modalId  = $(this).attr('id');
    if ($(window).width() < 769) {
      enableScroll('#' + modalId + '.show');
    }
  });

  $(document).on('click', '.dropdown-click', function (e) {
    e.stopPropagation();
  });
  console.log($.fn.dropdown.Constructor.Default)
});
(function () {
  // hold onto the drop down menu                                             
  var dropdownMenu;

  // and when you show it, move it to the body                                     
  $(window).on('show.bs.dropdown', function (e) {
    // grab the menu        
    dropdownMenu = $(e.target).find('.dropdown-menu');
  
    // detach it and append it to the body
    $('body').append(dropdownMenu.detach());

    // grab the new offset position
    var eOffset = $(e.target).offset();

    // make sure to place it where it would normally go (this could be improved)

    dropdownMenu.css({
      'min-width': $(e.target)[0].offsetWidth,
      'display': 'block',
      'top': eOffset.top + $(e.target).outerHeight(),
      'left': eOffset.left
    });
    if(dropdownMenu.hasClass('width-auto')) {
      dropdownMenu.css({
        'max-width': $(e.target)[0].offsetWidth,
      })
    }
  });

  // and when you hide it, reattach the drop down, and hide it normally                                                   
  $(window).on('hide.bs.dropdown', function (e) {
    // $(e.target).append(dropdownMenu.detach());
    dropdownMenu.hide();
  });
})();
//====================END BOOTSTRAP INIT=================//