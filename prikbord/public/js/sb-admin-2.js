$(function() {
    $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse')
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse')
        }

        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var calendarDate = moment();
    calendarDate.locale('nl');

    var datePicker = $('.datepicker').datepicker({
      format: "dd/mm/yyyy",
      weekStart: 1,
      language: "nl-BE",
      forceParse: false,
      todayBtn: "linked",
      todayHighlight: true
    }).on('changeDate', function(e){
      var date = e.date;
      $.cookie('date', date.toJSON(), {expires: 1});
      // TODO: Reload messages
      if($('.page-messages').length > 0){
        document.location.reload(true);
      }
    });

  if($.cookie('date')){
    datePicker.datepicker('update', moment($.cookie('date')).toDate());
  };

  $('[data-action="resolve"]').on('click', function(e){
    e.preventDefault();
    var $this = $(this);
    $this.button('Afhandelen...');
    $.post('/messages/resolve', {message: $this.closest('.message').attr('data-message')}, function(data){
      console.log(data);
      if(data.error){
        $this.removeClass('btn-default').addClass('btn-error').text('Er ging iets mis');
      } else {
        $this.removeClass('btn-defult').addClass('btn-success').html('<i class="fa fa-check fa-fw"></i>&nbsp; Afgehandeld');
        $this.closest('.panel-info').removeClass('panel-info').addClass('panel-default');
        $this.closest('.panel-danger').removeClass('panel-danger').addClass('panel-default');
      }
    });
  });

  // Get the unresolved count

  $.getJSON('/messages/unresolved/count', {}, function(data){
    if(data.count){
      $('.unresolved-count').text(data.count);
    } else {
      $('.unresolved-count').text("0");
    }
  });

  $('#page-wrapper').on('submit', 'form.addComment', function(e){
    e.preventDefault();

    var form = $(this);

    $.post(form.attr('action'), form.serialize(), function(data){
      form.closest('.message').replaceWith(data);
    });
  });

  $('.dropdown').on('click', '.clearNotifications', function(e){
    e.preventDefault();
    $.get('/notifications/clear', function(data){
      $('.dropdown-alerts').html(data);d
    });
  });

  // GET NOTIFICATIONS

  moment.locale('nl');

  var poll = function(){
    $.get('/notifications/html', function(data){
      $('.dropdown-alerts').html(data);
    });

    Notification.requestPermission(function(status) {
      if(status == "granted"){
        var notifications = [];
        $.getJSON('/notifications/json', function(data){
          $(data).each(function(i, item){
            moment.locale('nl');
            var n = new Notification(item.message, {body:  moment(item.date).fromNow()});
            $(n).click(function(e){
              e.preventDefault();
              window.focus();
              window.location.href = item.link;
            });
            notifications.push(n);
            // this also shows the notification
          });
          if(data.length > 0){
            $.post('/notifications/showOnDesktop', function(data){
              setTimeout(function(){poll();}, 1000 * 1800);
            }, 'json');
          }
        });
      }
    });
  };

  poll();
  // Desktop notifications and shit

  $('input.datepicker').each(function(){
    var datePicker = $(this).datepicker({
      format: "dd/mm/YYYY",
      weekStart: 1,
      language: "nl-BE",
      forceParse: false,
      todayBtn: "linked",
      todayHighlight: true
    }).on('changeDate', function(e){
      var date = e.date;
      $.cookie('date', date.toJSON(), {expires: 1});
      // TODO: Reload messages
      if($('.page-messages').length > 0){
        document.location.reload(true);
      }
    });
  });
});
