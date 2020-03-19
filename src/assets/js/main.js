(function(){
  var $sidebar = $('#sidebar');
  var $navItem = $('.nav-item');

  $navItem.on('click', function () {
    $sidebar.toggleClass('opened');
  });
})();