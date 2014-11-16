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
    $this.button('Afhandelen...')
    $.post('/messages/resolve', {message: $this.closest('.message').attr('data-message')}, function(data){
      console.log(data);
      if(data.error){
        $this.removeClass('btn-default').addClass('btn-error').text('Er ging iets mis');
       console.log('Some error happened');
      } else {
        $this.removeClass('btn-default').addClass('btn-success').text('Afgehandeld');
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

});
