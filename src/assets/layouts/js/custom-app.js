$(document).on("mouseenter", "ul.nav li.dropdown", function() {
  $(this)
    .find(".dropdown-menu")
    .stop(false, false)
    .delay(0)
    .fadeIn(0);
});

$(document).on(
  "mouseleave",
  "ul.nav li.dropdown, ul.dropdown-menu",
  function() {
    $(this)
      .find(".dropdown-menu")
      .stop(false, false)
      .delay(0)
      .fadeOut(0);
  }
);

$(document).on("click", "ul.nav li.dropdown, ul.dropdown-menu", function() {
  $(this)
    .find(".dropdown-menu")
    .stop(false, false)
    .delay(0)
    .fadeOut(0);
});

// $(document).on('click', '.toggle h4', function () {
//   $(this).toggleClass('open');
//   $(this).parents('.toggle').find('.toggle-box').slideToggle();
// });
$(document).on("click", ".closet", function() {
  $(".app-sidebar-overlay").removeClass("open");
  $(".app-sidebar").removeClass("open");
  $("body").removeClass("app-body");
});

$(document).on("click", ".remove-tag", function() {
  $(".color").removeClass("active");
});

$(document).on("click", ".fa.fa-minus", function() {
  $(this.parentElement.parentElement).toggleClass("closed");
  var tab_id = $(this).attr("app-data");
  $("#" + tab_id).toggleClass("hide");
});
