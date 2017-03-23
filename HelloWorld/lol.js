var shake = 10;
$('document').ready(function() {
   
   setInterval(function(){
    var rand = Math.random();
    $('#container').css('left', (Math.random()*shake+(50-shake/2))+'%');
    $('#container').css('top', (Math.random()*shake+(50-shake/2))+'%');
    $('img').css('left', (Math.random()*75)+'%');
    $('img').css('top', (Math.random()*75)+'%');
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
        $('body').css('color', 'red');
    } else if (rand < 0.4) {
        $('body').css('color', 'lime');
    } else if (rand < 0.6) {
        $('body').css('color', 'blue');
    } else if (rand < 0.8) {
        $('body').css('color', 'purple');
    } else if (rand < 1) {
        $('body').css('color', 'orange');
    }
   }, 1);
});