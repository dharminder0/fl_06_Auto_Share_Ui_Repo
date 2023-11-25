$(document).ready(function () {
  $('.toggle h4').click(function() {
    $(this).toggleClass('open');
    $(this).parents('.toggle') .find('.toggle-box').slideToggle();
  });
}); 


$(document).ready(function () {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  $('.menu-toggler').click(function() {
    $('header').toggleClass('open');      
    $('body').toggleClass('menu-toggler-body'); 
  });

  $('ul.nav li.dropdown').hover(function() {
      $(this).find('.dropdown-menu').stop(false, false).delay(0).fadeIn(0);
    }, function() {
      $(this).find('.dropdown-menu').stop(false, false).delay(0).fadeOut(0);
  });

  $(document).on('click','.app-data',function () {
    var tab_id = $(this).attr('app-data');  
    $('.app-sidebar').removeClass('open');
    $("#"+tab_id).addClass('open');
    $('.app-sidebar-overlay').addClass('open');
    $('body').addClass('app-body');
  });

  $('.app-sidebar-overlay').click(function() {
    $(this).removeClass('open');
    $('.app-sidebar').removeClass('open');
  });

  $('.portlet-head .closet').click(function() {
    $('.app-sidebar-overlay').removeClass('open');
    $('.app-sidebar').removeClass('open');
  });

  $("input[name$='mode']").click(function() {
    var test = $(this).val();
    $("div.mode").hide();
    $(".modes" + test).show();
  });

  $('.recurring-btn').click(function() {
    $(this).parents('.app-sidebar') .find('.recurring-data').slideToggle();
  });

  $('.time-btn').click(function() {
    $(this).parents('.app-sidebar') .find('.time-data').slideToggle();
  });

  $('.attendees').click(function() {
    $('.list-unstyled.sub-menu').toggleClass('hide');
  });

  $(document).on('click','.steps-1',function () {
    $('.step-1').addClass('hide');
    $('.step-2').removeClass('hide');
    $('.steps-list li:nth-child(1)').removeClass('active');
    $('.steps-list li:nth-child(1)').addClass('actived');
    $('.steps-list li:nth-child(2)').addClass('active');
  });
  $(document).on('click','.steps-2',function () {
    $('.step-1').addClass('hide');
    $('.step-2').addClass('hide');
    $('.step-3').removeClass('hide');
    $('.steps-list li:nth-child(2)').removeClass('actived');
    $('.steps-list li:nth-child(2)').addClass('actived');
    $('.steps-list li:nth-child(3)').addClass('active');
  });




});























$(document).ready(function () {
// multi hr scroll hour list
  var $divs = $('.scroll-hour-list-hr-1, .scroll-hour-list-hr-2');
  var sync = function(e){
    //alert("sincr");
    var $other = $divs.not(this).off('scroll');
    var other = $other.get(0);
    var percentage = this.scrollLeft / (this.scrollWidth - this.offsetWidth);
    other.scrollLeft = percentage * (other.scrollWidth - other.offsetWidth);
    setTimeout( function(){ $other.on('scroll', sync ); },10);
  }
  $divs.on( 'scroll', sync);

   // multi vrt scroll hour list
  var master = "scroll-hour-list-vet-1"; 
  var slave = "scroll-hour-list-vet-2"; 
  var master_tmp;
  var slave_tmp;
  var timer;    
  var sync = function ()
  {
    if($(this).attr('id') == slave)
    {
      master_tmp = master;
      slave_tmp = slave;
      master = slave;
      slave = master_tmp;
    }    
    $("#" + slave).unbind("scroll");    
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);    
    var x = percentage * ($("#" + slave).get(0).scrollHeight - $("#" + slave).get(0).offsetHeight);
    $("#" + slave).scrollTop(x);    
    if(typeof(timer) !== 'undefind')
      clearTimeout(timer);    
    timer = setTimeout(function(){ $("#" + slave).scroll(sync) }, 200)  }  
    $('#' + master + ', #' + slave).scroll(sync);

  
// hour-grid---------------------------

  // multi hr scroll hour grid
  var $divshg = $('.scroll-hour-grid-hr-1, .scroll-hour-grid-hr-2');
  var sync = function(e){
    //alert("sincr");
    var $otherhg = $divshg.not(this).off('scroll');
    var otherhg = $otherhg.get(0);
    var percentage = this.scrollLeft / (this.scrollWidth - this.offsetWidth);
    otherhg.scrollLeft = percentage * (otherhg.scrollWidth - otherhg.offsetWidth);
    setTimeout( function(){ $otherhg.on('scroll', sync ); },10);
  }
  $divshg.on( 'scroll', sync);

   // multi vrt scroll hour grid
  var masterhg = "scroll-hour-grid-vet-1"; 
  var slavehg = "scroll-hour-grid-vet-2"; 
  var masterhg_tmp;
  var slavehg_tmp;
  var timer;    
  var sync = function ()
  {
    if($(this).attr('id') == slavehg)
    {
      masterhg_tmp = masterhg;
      slavehg_tmp = slavehg;
      masterhg = slavehg;
      slavehg = masterhg_tmp;
    }    
    $("#" + slavehg).unbind("scroll");    
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);    
    var x = percentage * ($("#" + slavehg).get(0).scrollHeight - $("#" + slavehg).get(0).offsetHeight);
    $("#" + slavehg).scrollTop(x);    
    if(typeof(timer) !== 'undefind')
      clearTimeout(timer);    
    timer = setTimeout(function(){ $("#" + slavehg).scroll(sync) }, 200)  }  
    $('#' + masterhg + ', #' + slavehg).scroll(sync);

// day ---------------------------

  // multi hr scroll day
  var $divsday = $('.scroll-day-hr-1, .scroll-day-hr-2');
  var sync = function(e){
    //alert("sincr");
    var $otherday = $divsday.not(this).off('scroll');
    var otherday = $otherday.get(0);
    var percentage = this.scrollLeft / (this.scrollWidth - this.offsetWidth);
    otherday.scrollLeft = percentage * (otherday.scrollWidth - otherday.offsetWidth);
    setTimeout( function(){ $otherday.on('scroll', sync ); },10);
  }
  $divsday.on( 'scroll', sync);

   // multi vrt scroll day
  var masterday = "scroll-day-vet-1"; 
  var slaveday = "scroll-day-vet-2"; 
  var masterday_tmp;
  var slaveday_tmp;
  var timer;    
  var sync = function ()
  {
    if($(this).attr('id') == slaveday)
    {
      masterday_tmp = masterday;
      slaveday_tmp = slaveday;
      masterday = slaveday;
      slaveday = masterday_tmp;
    }    
    $("#" + slaveday).unbind("scroll");    
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);    
    var x = percentage * ($("#" + slaveday).get(0).scrollHeight - $("#" + slaveday).get(0).offsetHeight);
    $("#" + slaveday).scrollTop(x);    
    if(typeof(timer) !== 'undefind')
      clearTimeout(timer);    
    timer = setTimeout(function(){ $("#" + slaveday).scroll(sync) }, 200)  }  
    $('#' + masterday + ', #' + slaveday).scroll(sync);


// week ---------------------------

  // multi hr scroll week
  var $divsweek = $('.scroll-week-hr-1, .scroll-week-hr-2');
  var sync = function(e){
    //alert("sincr");
    var $otherweek = $divsweek.not(this).off('scroll');
    var otherweek = $otherweek.get(0);
    var percentage = this.scrollLeft / (this.scrollWidth - this.offsetWidth);
    otherweek.scrollLeft = percentage * (otherweek.scrollWidth - otherweek.offsetWidth);
    setTimeout( function(){ $otherweek.on('scroll', sync ); },10);
  }
  $divsweek.on( 'scroll', sync);

   // multi vrt scroll week
  var masterweek = "scroll-week-vet-1"; 
  var slaveweek = "scroll-week-vet-2"; 
  var masterweek_tmp;
  var slaveweek_tmp;
  var timer;    
  var sync = function ()
  {
    if($(this).attr('id') == slaveweek)
    {
      masterweek_tmp = masterweek;
      slaveweek_tmp = slaveweek;
      masterweek = slaveweek;
      slaveweek = masterweek_tmp;
    }    
    $("#" + slaveweek).unbind("scroll");    
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);    
    var x = percentage * ($("#" + slaveweek).get(0).scrollHeight - $("#" + slaveweek).get(0).offsetHeight);
    $("#" + slaveweek).scrollTop(x);    
    if(typeof(timer) !== 'undefind')
      clearTimeout(timer);    
    timer = setTimeout(function(){ $("#" + slaveweek).scroll(sync) }, 200)  }  
    $('#' + masterweek + ', #' + slaveweek).scroll(sync);


// month ---------------------------

  // multi hr scroll month
  var $divsmonth = $('.scroll-month-hr-1, .scroll-month-hr-2');
  var sync = function(e){
    //alert("sincr");
    var $othermonth = $divsmonth.not(this).off('scroll');
    var othermonth = $othermonth.get(0);
    var percentage = this.scrollLeft / (this.scrollWidth - this.offsetWidth);
    othermonth.scrollLeft = percentage * (othermonth.scrollWidth - othermonth.offsetWidth);
    setTimeout( function(){ $othermonth.on('scroll', sync ); },10);
  }
  $divsmonth.on( 'scroll', sync);

   // multi vrt scroll month
  var mastermonth = "scroll-month-vet-1"; 
  var slavemonth = "scroll-month-vet-2"; 
  var mastermonth_tmp;
  var slavemonth_tmp;
  var timer;    
  var sync = function ()
  {
    if($(this).attr('id') == slavemonth)
    {
      mastermonth_tmp = mastermonth;
      slavemonth_tmp = slavemonth;
      mastermonth = slavemonth;
      slavemonth = mastermonth_tmp;
    }    
    $("#" + slavemonth).unbind("scroll");    
    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);    
    var x = percentage * ($("#" + slavemonth).get(0).scrollHeight - $("#" + slavemonth).get(0).offsetHeight);
    $("#" + slavemonth).scrollTop(x);    
    if(typeof(timer) !== 'undefind')
      clearTimeout(timer);    
    timer = setTimeout(function(){ $("#" + slavemonth).scroll(sync) }, 200)  }  
    $('#' + mastermonth + ', #' + slavemonth).scroll(sync);

  });







































//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {
    
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    
    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    
    
});
$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
});
$(document).ready(function () {
  var owl = $('.owl-carousel');
    owl.owlCarousel({
      margin: 100,
      nav: true,
      loop: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 3
        },
        1000: {
          items: 5
        }
      }
    })
  });
