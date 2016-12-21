$('document').ready(function() {
   
   setInterval(function(){
    var rand = Math.random();
    if(rand < 0.2) {
        $('body').css('background-color', 'red');
    } else if (rand < 0.4) {
        $('body').css('background-color', 'lime');
    } else if (rand < 0.6) {
        $('body').css('background-color', 'blue');
    } else if (rand < 0.8) {
        $('body').css('background-color', 'purple');
    } else if (rand < 1) {
        $('body').css('background-color', 'orange');
    }
   }, 1);
   setInterval(function(){
    var rand = Math.random();
    if(rand < 0.2) {
        $('#text').css('color', 'red');
    } else if (rand < 0.4) {
        $('#text').css('color', 'lime');
    } else if (rand < 0.6) {
        $('#text').css('color', 'blue');
    } else if (rand < 0.8) {
        $('#text').css('color', 'purple');
    } else if (rand < 1) {
        $('#text').css('color', 'orange');
    }
   }, 1);
});