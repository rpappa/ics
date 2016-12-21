$(document).ready(function() {
  $(document).on( "scroll", function() {
    if($( document ).scrollTop() < 100) {
      $('.header').fadeOut(100);
    } else {
      $('.header').fadeIn(100);
    }
  } );
  setTimeout(function() 
  {
    $('.topleft').toggleClass("tlTranslate");
    $('.bottomright').toggleClass("brTranslate");
    $('.topright').toggleClass("trTranslate");
    $('.bottomleft').toggleClass("blTranslate");
    
    $('.topleft').toggleClass("centerTranslate");
    $('.bottomright').toggleClass("centerTranslate");
    $('.topright').toggleClass("centerTranslate");
    $('.bottomleft').toggleClass("centerTranslate");
    $('html, body').animate({
      scrollTop: 0
   }, 1200);
    setTimeout(function() {
      $( document ).scrollTop(0);
      setTimeout(function(){$('#loading').fadeOut(500);}, 100)
    }, 2000);
  }, 750);
});