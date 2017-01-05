/* 
https://github.com/rpappa/ics-messenger
https://github.com/rpappa/ics

chat.js

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

// handles a raw message from the server
function message(e) {
  console.log('Server: ' + e.data);
};

var window_focus = true;

$(document).ready(() => {
    
    Materialize.updateTextFields(); // make the input fields sexy
    var name = randomName(); // make a random name
    
    $('#username').val(name); // fill in our random name
    
    if(window.location.host.indexOf('c9users.io') != -1) {
        var url = 'wss://chat-backend-rpappa.c9users.io/'; // testing backend
    } else {
        var url = 'ws://icsmessage.rpappa.com:9009'; // "production" backend
    }
    
    // connect to the server
    var server = connectToServer(url, function() {
        server.setRoom("icsChat"); // an arbitrary room
        server.onRawMessage(message); // handle raw messages
        server.sendRawMessage('ping'); // test connection (see the developer console)
        
        // handle a chat message
        server.onChatMessage((text, user) => {
            
            // check if scroll is close to the bottom
            var scrolldown = Math.abs($('body').scrollTop() - ($(document).height()-$(window).height())) < 300;
            
            // format bbcode in the received message
            parseFormat(text, (out)=> {
                 // add the received message in a materialize card
                 $('#messages').append(
`<div class="card grey lighten-3"><div class="card-content black-text"><span class="card-title">${user}</span><p id="text">${out}</p></div></div>`);
            })
//           $('#messages').append(
// `<div class="card grey lighten-3"><div class="card-content black-text"><span class="card-title">${user}</span><p id="text">${text}</p></div></div>`);
        
            // if scroll is close to the bottom, scroll down
            if(scrolldown) {
                $('html, body').scrollTop($(document).height());
            }
            
            // give a little notification in the tab title if the window isn't in focus
            if(!window_focus) {
                $('title').text('ics chat *')
            } else {
                $('title').text('ics chat')
            }
        });
        
        // list rooms to console (not really used)
        server.listRooms((rooms, pops) => {
            console.log(rooms);
            console.log(pops);
        });
        
        // submit the message form when the send button is pressed
        $('#send').click(() => {
            $( "#messageForm" ).submit();
        })
        
        // handle a submit of the message form
        $( "#messageForm" ).submit(( event ) => {
            event.preventDefault(); // don't refresh the page
            server.sendChatMessage($('#message').val(), $('#username').val()); // send the message
            $('#message').val(''); // clear the message field
        });
    });
    
    // handle formatting buttons
    $('#link').click(() => {
        $('#message').focus()
        $('#message').val( $('#message').val() + "[url]inserturlhere[/url]");
    })
    $('#photo').click(() => {
        $('#message').focus()
        $('#message').val( $('#message').val() + "[img]insertimgurlhere[/img]");
    })
    $('#bold').click(() => {
        $('#message').focus()
        $('#message').val( $('#message').val() + "[b]boldtext[/b]");
    })
    $('#italic').click(() => {
        $('#message').focus()
        $('#message').val( $('#message').val() + "[i]italictext[/i]");
    })
    $('#size').click(() => {
        $('#message').focus()
        $('#message').val( $('#message').val() + "[big]bigtext[/big]");
    });
    $('#clear').click(()=> {
        $('.card').remove(); // remove all materialize cards
    })
});


// parse bbcode
function parseFormat(text, cb) {
    var result = XBBCODE.process({
      text: text,
      removeMisalignedTags: false,
      addInLineBreaks: false
    });
    // console.error("Errors", result.error);
    // console.log(result.html)
    cb(result.html);
}

// http://stackoverflow.com/questions/3479734/javascript-jquery-test-if-window-has-focus
$(window).focus(function() {
    window_focus = true;
    $('title').text('ics chat') // clear tab title notification
}).blur(function() {
    window_focus = false;
});

// https://github.com/rpappa/ics-messenger
function connectToServer(url, onopen) {
    var instance = {};
    
    instance.connection = new WebSocket(url);
    
    instance.connection.onmessage = function(e) {
        try {
            var obj = JSON.parse(e.data);
            if(obj.chat) {
                instance.chatHandler(obj.chat.text, obj.chat.username);
            } else if (obj.roomList && obj.roomPops) {
                if(instance.listRoomCallback) {
                    instance.listRoomCallback(obj.roomList, obj.roomPops);
                }
            } else {
                instance.rawHandler(e);
            }
        } catch (err) {
            instance.rawHandler(e);
        }
    };
    
    if(onopen) {
        instance.connection.onopen = onopen;
    }
    
    instance.sendRawMessage = (message) => {
        instance.connection.send(message);
    }
    
    instance.onRawMessage = (handler) => {
        instance.rawHandler = handler;
    }
    
    instance.room = -1;
    
    instance.setRoom = (room) => {
        instance.connection.send(JSON.stringify({'room': room}));
        instance.room = room;
    }
    
    instance.listRooms = (callback) => {
        instance.connection.send(JSON.stringify({'command': 'rooms'}));
        instance.listRoomCallback = callback;
    }
    
    instance.sendChatMessage = (text, username) => {
        instance.connection.send(JSON.stringify({
            'chat': {
                'text':text,
                'username':username
            }
        }));
    }
    
    instance.onChatMessage = (handler) => {
        instance.chatHandler = handler;
    }
    
    return instance;
}

// https://gist.github.com/rpappa/45d5b60fbe1af156e662523b8778760d

var colors = ['red', 'blue', 'green', 'orange', 'yellow', 'black', 'green', 'white', 'pink', 'fuchsia', 'purple', 'lime', 'colorful',
  'rainbow', 'neon', 'clear', 'aquamarine', 'milky', 'cyan', 'brown', 'grey', 'beige', 'maroon', 'violet', 'golden'];
var adj = ['young', 'smart', 'rich', 'frosted', 'glossy', 'circular', 'rectangular', 'living', 'dead', 'edible',
  'explosive', 'scared', 'minty', 'tasty', 'fresh', 'new', 'old', 'open', 'stolen', 'spicy', 'flammable', 'liquid',
  'oppressive', 'hidden', 'secret', 'giant', 'happy', 'invisible', 'solid', 'dying', 'untouchable', 'trippy', 'burnt',
  'unstable', 'scary', 'ancient', 'polite', 'married', 'sketchy', 'scary', 'toxic', 'winged', 'watery', 'glowing',
  'angry', 'speedy', 'hollow', 'overpriced', 'expensive', 'french', 'american', 'british', 'asian', 'australian', 'convex', 'concave',
  'wooden', 'brittle', 'cracked', 'shattered', 'compressed', 'greedy', 'evil', 'elite', 'dark', 'gentrifying', 'chinese',
  'african', 'omniscient', 'enchanted', 'abusive', 'female', 'male', 'non-binary', 'binary', 'foreign', 'conscious', 'pure', 'poor',
  'famous', 'rare', 'popular', 'illegal', 'common', 'pregnant', 'broke', 'political', 'psychotic', 'nervous', 'depressed', 'cute',
  'lonely', 'boring', 'desperate', 'guilty', 'powerful', 'rotten', 'communist', 'capitalist', 'grim', 'cryogenicallyfrozen'];
var noun = ['dog', 'cat', 'car', 'boat', 'coin', 'pie', 'bread', 'lamborghini', 'ferrari', 'phone', 'room', 'fish', 'website',
  'bird', 'chicken', 'essay', 'robot', 'box', 'apple', 'door', 'staircase', 'elephant', 'computer', 'folder',
  'cup', 'bowl', 'card', 'machine', 'store', 'burrito', 'taco', 'emoji', 'teacher', 'human', 'dolphin', 'peasant', 'disease',
  'coffee', 'student', 'athlete', 'wire', 'system', 'television', 'product', 'camera', 'window', 'grenade', 'game',
  'country', 'planet', 'meteor', 'president', 'soldier', 'advertisement', 'hamburger', 'circuit', 'racecar', 'anteater', 
  'textbook', 'moon', 'truck', 'hoverboard', 'song', 'flamingo', 'horse', 'brick', 'tractor', 'governor', 'noise', 'maid', 'uncle',
  'shame', 'writer', 'game', 'pot', 'berry', 'farm', 'squirrel', 'frog', 'stranger', 'crown', 'flame', 'throne', 'earthquake',
  'blade', 'sponge', 'bomb', 'bubble', 'pig', 'cracker', 'spoon', 'sparkle', 'star', 'snake', 'theory', 'mist', 'quill', 'icicle', 
  'dragon'];

function randomName() {
    if(Math.random() < 0.5) {
    var name = colors[Math.floor(Math.random() * colors.length)] + "" + adj[Math.floor(Math.random() * adj.length)] + "" +
    noun[Math.floor(Math.random() * noun.length)];
  } else {
    var name = adj[Math.floor(Math.random() * adj.length)] + "" + colors[Math.floor(Math.random() * colors.length)] + "" +
    noun[Math.floor(Math.random() * noun.length)];
  }
  return name;
}