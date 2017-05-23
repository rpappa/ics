/*
Place the generic card html in this string. Put in placeholders to be filled in. Make sure the highest-level element of the card has the "card" class.
Uses a template literal for multi-line strings: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals (strings wrapped in ` `)
$title$ - title of card
$subtitle$ - subtitle of card
$desc$ - description of card
$img$ - image location for card
$created$ - created-by attribution for card
*/
cardhtml = `<div class="card">
                <span style="font-weight:bold;">$title$</span><span style="font-size:11px"> - $subtitle$</span><br>
                <span>$desc$</span>
                <div class="image">
                    <img src="$img$" />
                </div>
                <span class="createdby">$created$</span>
            </div>`

// element selector that cards will be appended to (ideally a div)
element = '#cards';





var tags = [];
var cards = [];

function appendHTML(el, obj) {
    newhtml = cardhtml.replace("$title$", obj.title)
    .replace("$subtitle$", obj.subtitle)
    .replace("$desc$", obj.desc)
    .replace("$img$", obj.img)
    .replace("$created$", "Created by: " + obj.created);
    el.append(newhtml); // generate card html
}

$(document).ready(()=> {
    $.ajax({ 
        type: 'GET', 
        url: 'math.json', // url of the json file
        dataType: 'json',
        success: function (data) { 
            
            //console.log(data); // debug
            cards = data.cards; // grab cards from returned file
            
            /*
            This segment loops through each card, and adds its HTML and tags to the page, and binds click events for the tags
            */
            for(i = 0; i < cards.length; i++) {
                appendHTML($(element), cards[i]); // add card html to page
            
                /*
                loop through each tag, if it hasn't already been added to the page, add it
                */
                for(t = 0; t < cards[i].tags.length; t++) {
                    if(tags.indexOf(cards[i].tags[t]) == -1) { // check if it hasn't already been added
                        tags.push(cards[i].tags[t]); // add tag to list
                        //console.log(tags); // debug
                        
                        /*
                            This appends the tag html. Might need to change depending on tag implementation
                            This uses template literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
                        */
                        $('#tags').append(`<span class="tag cat">${cards[i].tags[t]}</span><span class="tag"> - </span>`) 
                    }
                }
                
                // bind click event for category tag
                $('.tag.cat').click(function(){
                    $('.card').remove(); // remove all cards (elements with the class "card")
                    
                    // loop through all cards
                    for(i = 0; i < cards.length; i++) {
                        // console.log($(this).text() + ", " + JSON.stringify(cards[i].tags)); // debug
                        if(cards[i].tags.indexOf($(this).text().trim()) != -1) { // if the card's tags contains the tag the user clicked on 
                                                                                /* 
                                                                                !!! important !!! - might need to change the $(this).text().trim() based off how the tags are done in html
                                                                                */
                                                                            
                            appendHTML($(element), cards[i]); // add the card since it has the tag we're looking for
                        }
                    }
                });
                
                // finally bind click event for the "all" tag
                $('.tag.all').click(function(){
                    $('.card').remove();
                    for(i = 0; i < cards.length; i++) {
                        appendHTML($(element), cards[i]); // add all cards
                    }
                })
            }
            
        },
        error: (er)=>{
            console.log(JSON.parse(er.responseText)); // log parse error to console
        }
    });
});

/* demo.js

Note to those reading this code, especially in the context of Intro to Computer Science:
There is some usage of javascript arrow functions, aka "fat arrows", notated like
(param1, param2, ...) => { ... }
This is equivalent to
function(param1, param2, ...) { ... }
Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

Copyright (c) 2017 Ryan Pappa

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
