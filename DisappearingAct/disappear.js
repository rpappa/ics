/* disappear.js

Note to those reading this code, especially in the context of Intro to Computer Science:
There is heavy usage of javascript arrow functions, aka "fat arrows", notated like
(param1, param2, ...) => { ... }
This is equivalent to
function(param1, param2, ...) { ... }
Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

Copyright (c) 2016-2017 Ryan Pappa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var transition = true; // variable for if we are in a transition
var score = 0; // score in timed / whack mode

var good = new Audio('hit.wav'); // sfx for click / hit / whatever
var bad = new Audio('bad.wav'); // sfx for bad stuff
var sfx = getAudio(); // get audio setting


$(document).ready(() => {
    
    // set color of options
    $('.mode').css('color', invertBg($('body'))); // selector
    $('.active .mode').css('color', $('body').css("background-color")); // active selector text
    $('.pagination li.active').css({'background-color': invertBg($('body'))}); // active selector
    
    pos($('#circle'), rand(10, 90), rand(25, 75)); // sets the circle to a random position
    doShadow($('#circle')); // add circle
    $('#circle').css({'background-color': invertBg($('body'))}); // sets the background of the circle to the invert of the body background
    $('#circle').fadeIn(200, noTransition); // shows circle
    
    $('#score').css({'color': invertBg($('body'))}); //score color
   
    $('#circle').click(defaultCircleHandler); // assign handler to circle click
   
   /*
   * this whole block manages css for switching modes
   */
   $('#relax').click(() => {
       $('#endgame').fadeOut(340);
       $('.pagination .active a').css("color", $('#relax').css('color'));
       $('.active').removeClass('active').addClass('waves-effect').css("background-color", "");
       $('.pagination li:nth-child(1)').addClass('active'); 
       $('.active .mode').css('color', $('body').css("background-color")); // active selector text
       $('.pagination li.active').css({'background-color': invertBg($('body'))}); // active selectorconsole.log(mode);
       relaxMode();  
   });
   $('#timed').click(() => {
       $('#endgame').fadeOut(340);
       $('.pagination .active a').css("color", $('#timed').css('color'));
       $('.active').removeClass('active').addClass('waves-effect').css("background-color", "");
       $('.pagination li:nth-child(2)').addClass('active'); 
       $('.active .mode').css('color', $('body').css("background-color")); // active selector text
       $('.pagination li.active').css({'background-color': invertBg($('body'))}); // active selectorconsole.log(mode);
       timedMode();
   });
   $('#whack').click(() => {
       $('#endgame').fadeOut(340);
       $('.pagination .active a').css("color", $('#whack').css('color'));
       $('.active').removeClass('active').addClass('waves-effect').css("background-color", "");
       $('.pagination li:nth-child(3)').addClass('active'); 
       $('.active .mode').css('color', $('body').css("background-color")); // active selector text
       $('.pagination li.active').css({'background-color': invertBg($('body'))}); // active selector
       whackMode();
   });
   
   /* close highscores */
   $('#x').click(() => {
      $('#endgame').fadeOut(340);
      $('#relax').click();
   });
   
   /* restart game on click of restart button */ 
   $('.restart').click(() => {
       /* hide highscores */
       $('#endgame').fadeOut(340);
       
       if(mode == "timed") {
           // restart timed mode
           timedMode();
       }
       if(mode == "whack") {
           // restart whack mode
           whackMode();
       }
   });
   $(document).keydown((event) => {
       // handle keypresses if it's whack mode
        if(mode == "whack") {handleKeyPress(event.which)};
    });
    
    // handle muting of audio
    $('#audioBox').click(() => {
       sfx = !sfx; 
       saveAudio();
    });
    
    // if we start without sfx, indicate that on the checkbox
    if(!sfx) {
        $('#audioBox').click();
        sfx = !sfx;
    }
});


// handler for a circle click in timed and relax mode
function defaultCircleHandler() {
    if(sfx) { good.play();
    console.log(sfx)} // play sfx 
    if(transition) {
           return; // dont do anything if we are transitioning
   }
   transition = true; // we are transitioning
   $('#circle').fadeOut(200); // hide circle
   var newcolor = 'rgb(' + rand(0,256) + ',' + rand(0,256) + ',' + rand(0,256) + ')'; //new, random bg color
   $('body').animate({ //animate to new color
    'background-color': newcolor}, 200, 'swing', ()=>{ 
        // set color of options
        $('.mode').css('color', invertBg($('body')));
        $('.active .mode').css('color', $('body').css("background-color"));
        $('.pagination li.active').css('background-color', invertBg($('body')));
        //set color of timer and score
        $('#time').css({'color': invertBg($('body'))});
        $('#score').css({'color': invertBg($('body'))});
        // move circle, set color, reappear
        pos($('#circle'), rand(10, 90), rand(25, 75));
        $('#circle').css({'background-color': invertBg($('body'))});
        doShadow($('#circle')); //add shadow effect to circle
        $('#circle').fadeIn(200, noTransition);
   });
   // if we're in game increase score by 1
    if (started) {
        $('#score').stop();
        score += 1;
        $('#score').text(score);
        
        // show and hide score
        $('#scoreContainer').fadeIn(300, () => {
            setTimeout(() => {
                $('#scoreContainer').fadeOut(300);
            }, 200);
        });
    }
}

function handleKeyPress(e) {
    // if the pressed key is the same as what's in the circle
    if(String.fromCharCode(e) != $('#circleText').text()) {
        // if we're in game and the wrong key is pressed subtract 1 from score
        if(started) {
            score -= 1;
            if (sfx) {bad.play();} // play bad sfx
            $('#score').text(score);
            $('#scoreContainer').fadeIn(300, () => {
                setTimeout(() => {
                    $('#scoreContainer').fadeOut(300);
                }, 200);
            });
        }
        return;
    }
    if(transition) {
        return; // dont do anything if we are transitioning
    }
    transition = true; // we're transitioning
    $('#circle').fadeOut(190, () => {
        // set a random letter in the circle
        $('#circleText').text(String.fromCharCode(Math.floor(Math.random()*26) + 65));
    }); // hide circle
    
   var newcolor = 'rgb(' + rand(0,256) + ',' + rand(0,256) + ',' + rand(0,256) + ')'; //new, random bg color
   $('body').animate({ //animate to new color
    'background-color': newcolor}, 200, 'swing', ()=>{ 
        // set color of options
        $('.mode').css('color', invertBg($('body')));
        $('.active .mode').css('color', $('body').css("background-color"));
        $('.pagination li.active').css('background-color', invertBg($('body')));
        //set color of timer and score and letter
        $('#time').css({'color': invertBg($('body'))});
        $('#score').css({'color': invertBg($('body'))});
        $('#circleText').css('color', $('body').css("background-color"));
        // move circle, set color, reappear
        pos($('#circle'), rand(10, 90), rand(25, 75));
        $('#circle').css({'background-color': invertBg($('body'))});
        doShadow($('#circle')); //add shadow effect to circle
        $('#circle').fadeIn(200, noTransition);
   });
   // if we're in game increase score by 1
    if (started) {
        $('#score').stop();
        score += 1;
        $('#score').text(score);
        if(sfx) {good.play();} // play sfx
        // show and hide score
        $('#scoreContainer').fadeIn(300, () => {
            setTimeout(() => {
                $('#scoreContainer').fadeOut(300);
            }, 200);
        });
    }
}

// start in relax mode
var mode = "relax";

/* starts timed mode */
function timedMode() {
    $('#circleText').fadeOut(150);
    $('#circle').off( "click" ); $('#circle').click(defaultCircleHandler); // assign handler to circle click
    mode = "timed";
    score = 0
    $('#time').css({'color': invertBg($('body'))});
    $('#timer').fadeIn(300, () => {
        countDown(3, 0, "timed");
    });
    
}

/* starts whack mode */
function whackMode() {
    $('#circleText').text(String.fromCharCode(Math.floor(Math.random()*26) + 65));
    $('#circleText').css('color', $('body').css("background-color"));
    $('#circleText').fadeIn(150);
    $('#circle').off( "click" );
    mode = "whack";
    score = 0
    $('#time').css({'color': invertBg($('body'))});
    $('#timer').fadeIn(300, () => {
        countDown(3, 0, "whack");
    });
}

/* starts relax mode */
function relaxMode() {
    $('#circleText').fadeOut(150);
    $('#circle').off( "click" ); $('#circle').click(defaultCircleHandler); // assign handler to circle click
    $('#timer').fadeOut(300);
    score = 0;
    mode = "relax";
}

var interval; // holds the setInterval so it can be canceled later
var started = false; // are we in game??

/* starts the timer */
function startTimer(mode) {
    var s = 15; // seconds
    var ms = 0; // milliseconds
    var startTime = 0; // in ms since January 1st, 1970
    startTime = new Date().getTime(); // current ms since January 1st, 1970
    started = true; // we are in game
    interval = setInterval(() => {
        if(new Date().getTime() - startTime >= 100) { // if its been 100 ms (0.1 s)
            if(ms == 0) { // rounding stuff
                s -= 1;
                ms = 9;
            } else {
                ms -= 1;
            }
            $('#time').text(s + "." + ms); // set timer text
            startTime = new Date().getTime(); // set new startTime
            if(s == 0 && ms == 0) { // if time's run out
                clearInterval(interval); // stop timer
                started = false; // we're not in game
                addScore(score, mode); // add to highscores
                visualizeHighscores(mode); // show highscores
            }
        }
    }, 10);
}

/* 3... 2... 1... */
function countDown(time, n , mode) {
    clearInterval(interval); // stop timer just in case
    var ellipsis = "";
    if(n== 1) {
        ellipsis = "."
    }
    if(n == 2) {
        ellipsis = ".."
    }
    if(n == 3) {
        ellipsis = "..."
    }
    setTimeout(() => {
        $('#time').text(time + ellipsis); // set timer to countdown
        if(n == 3) {
            if(time != 0) {
                countDown(time-1, 0, mode);
            } else {
                var s = 60; // seconds
                var ms = 0; // milliseconds
                startTimer(mode);
            }
        } else {
            countDown(time, n+1, mode);
        }
    }, 250);
}

/* shows the highscores board */
function visualizeHighscores(mode) {
    $('#yourscore').text('Your Score: ' + score);
    $('#high').html(''); // clear list
  $('#endgame').fadeIn(340, ()=> { // show board
    var scores = getscores(mode); // get high scores
    scores.sort(function(a,b){return b - a}); // sort high scores
    //console.log(scores);
    for(i = 0; i <= 4; i++) {
      if(scores[i]) {
        $('#high').append('<li>'+scores[i]+'</li>'); // add top 4 scores
      }
    }
  });
}

/* stores score in localscorage */
function addScore(score, mode) {
  var scores;
  if(!localStorage.getItem("scores"+mode)) { // if there isn't a stored array
    scores = []; // make a new array
    scores.push(score); // add the only score
    localStorage["scores"+mode] = JSON.stringify(scores); // save to local storage
  } else {
    scores = JSON.parse(localStorage["scores"+mode]); // get scores
    scores.push(score); // add current score
    localStorage["scores"+mode] = JSON.stringify(scores); //save to storage
  }
}

/* retrieves array for the high scores for given mode */
function getscores(mode) {
  return JSON.parse(localStorage.getItem("scores"+mode));
}

/* save audio setting */
function saveAudio() {
    localStorage["audio"] = sfx;
}

/* get audio setting */
function getAudio() {
    if(!localStorage['audio']) {
        return true;
    } else {
        return JSON.parse((localStorage['audio']));
    }
}

/*
*  Helper function to put an element at a position
*  el: element
*  x: percentage x position
*  y: percentage y position
*/
function pos(el, x, y) {
    // centers an object within itself, and then sets top/left to percentages
    el.css({'-moz-transform': 'translateX(-50%) translateY(-50%)',
        '-webkit-transform': 'translateX(-50%) translateY(-50%)',
        'transform': 'translateX(-50%) translateY(-50%)',
        'top': y + '%',
        'left': x + '%'
    });
}

/*
* random number between
* bottom: bottom bound
* top: top bound
* returns int between bottom and top
*/
function rand(bottom, top) {
   return Math.floor((Math.random() * (top-bottom)) + bottom);
}

/*
* returns css of the inverted background color of the given element
* el: element
*/
function invertBg(el) {
    var bg = el.css("background-color"); // get background color of given element
    bg = bg.substr(4, bg.length-5); // extracts the x, y, z from rgb(x, y, z)
    var rgb = bg.split(','); // split into an array. r at [0], b at [1], g at [2]
    return 'rgb(' + (256-parseInt(rgb[0])) + ',' + parseInt(256-rgb[1]) + ',' + parseInt(256-rgb[2]) + ')' // find the invert by subtracting each color element from 256
}

/*
* adds a shadow to element based on position on screen
* el: element
*/
var shadowSize = 60;
function doShadow(el) {
    // get center coordinates as percentages
    var centerX = (parseInt(el.css('left'))/100*$(document).width()-$(document).width()/2)/$(document).width();
    var centerY = (parseInt(el.css('top'))/100*$(document).height()-$(document).height()/2)/$(document).height();
    
    // calculate shadow x/y based off position
    var shadowX = shadowSize * centerX;
    var shadowY = shadowSize * centerY;
    
    // generate css
    var css = {
        'box-shadow': `${shadowX}px ${shadowY}px 2px rgba(0,0,0,0.3)`,
    	'-moz-box-shadow': `${shadowX}px ${shadowY}px 2px rgba(0,0,0,0.3)`,
    	'-webkit-box-shadow': `${shadowX}px ${shadowY}px 2px rgba(0,0,0,0.3)`,
    	'-o-box-shadow': `${shadowX}px ${shadowY}px 2px rgba(0,0,0,0.3)`
    };
    
    // apply css
    el.css(css)
}

/*
* simply sets the transition variable to false
* used in anti-double-click system
*/
function noTransition() {
    transition = false;
}