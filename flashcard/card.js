// What does this do? Flip the card? 
$(document).ready(()=> {
   $('.card').click(function(e) {
       if($(this).hasClass('img-expand')) {
            $(this).removeClass('img-expand');
            if($(e.target).is("i")) return;
            $(this).find('img').animate({'margin-top': '-200px'}, {duration:500, queue:true});
            $(this).find('.card-image').animate({'height': '80px'}, {duration:500, queue:true});
       } else {
            $(this).addClass('img-expand');
            if($(e.target).is("i")) return;
            $(this).find('img').animate({'margin-top': '0'}, {duration:500, queue:true});
            $(this).find('.card-image').animate({'height': '400px'}, {duration:500, queue:true});
       }
       
   });
   $('.btn-floating').click(function() {
       if($(this).parent().find('.card-content').hasClass('expand')) {
           $(this).parent().find('.card-content').removeClass('expand');
       } else {
           $(this).parent().find('.card-content').addClass('expand');
       }
       
   });
});