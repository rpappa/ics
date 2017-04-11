$(document).ready(()=> {
   $('.card').click((e)=> {
       if($('.card').hasClass('img-expand')) {
            $('.card').removeClass('img-expand');
            if($(e.target).is("i")) return;
            $('img').animate({'margin-top': '-200px'}, {duration:500, queue:true});
            $('.card-image').animate({'height': '80px'}, {duration:500, queue:true});
       } else {
            $('.card').addClass('img-expand');
            if($(e.target).is("i")) return;
            $('img').animate({'margin-top': '0'}, {duration:500, queue:true});
            $('.card-image').animate({'height': '400px'}, {duration:500, queue:true});
       }
       
   });
   $('.btn-floating').click(()=>{
       if($('.card-content').hasClass('expand')) {
           $('.card-content').removeClass('expand');
       } else {
           $('.card-content').addClass('expand');
       }
       
   });
});