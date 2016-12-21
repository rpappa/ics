function message(e) {
  console.log('Server: ' + e.data);
};

$(document).ready(() => {
    
    Materialize.updateTextFields();
    var name = randomName();
    
    // $('body').append(`<span>Messaging under the alias: ${name}</span><br>`);
    $('#username').val(name);
    
    var server = connectToServer('wss://chat-backend-rpappa.c9users.io/', function() {
        // server.setRoom(navigator.userAgent.split(" ")[navigator.userAgent.split(" ").length - 1]);
        server.setRoom("Safari/537.36");
        server.onRawMessage(message);
        server.sendRawMessage('ping');
        server.onChatMessage(function(text, user) {
            var scrolldown = $('body').scrollTop() ==$(document).height()-$(window).height();
            
          $('#messages').append(
`<div class="card grey lighten-3"><div class="card-content black-text"><span class="card-title">${user}</span><p id="text">${text}</p></div></div>`);
        
            if(scrolldown) {
                $('html, body').scrollTop($(document).height());
            }
        });
        // server.sendChatMessage('test', name);
        server.listRooms((rooms, pops) => {
            console.log(rooms);
            console.log(pops);
        });
        
        $( "#messageForm" ).submit(function( event ) {
            event.preventDefault();
            server.sendChatMessage($('#message').val(), $('#username').val());
            $('#message').val('');
        });
    });
});


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