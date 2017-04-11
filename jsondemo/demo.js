tags = [];
cards = [];

$(document).ready(()=> {
    $.ajax({ 
        type: 'GET', 
        url: 'cards.json', 
        dataType: 'json',
        success: function (data) { 
            console.log(data);
            cards = data.cards;
            for(i = 0; i < cards.length; i++) {
                $('#cards').append(`<div class="card"><span>${cards[i].title}</span><br><span>${cards[i].desc}</span><div class="image"><img src="${cards[i].img}" /></div></div>`)
            
                for(t = 0; t < cards[i].tags.length; t++) {
                    if(tags.indexOf(cards[i].tags[t]) == -1) {
                        tags.push(cards[i].tags[t]);
                        console.log(tags);
                        $('#tags').append(`<span class="tag cat">${cards[i].tags[t]} </span>`)
                    }
                }
                $('.tag.cat').click(function(){
                    $('.card').remove();
                    for(i = 0; i < cards.length; i++) {
                        console.log($(this).text() + ", " + JSON.stringify(cards[i].tags));
                        if(cards[i].tags.indexOf($(this).text().trim()) != -1) {
                            $('body').append(`<div class="card"><span>${cards[i].title}</span><br><span>${cards[i].desc}</span><div class="image"><img src="${cards[i].img}" /></div></div>`)
                        }
                    }
                });
                $('.tag.all').click(function(){
                    $('.card').remove();
                    for(i = 0; i < cards.length; i++) {
                        $('body').append(`<div class="card"><span>${cards[i].title}</span><br><span>${cards[i].desc}</span><div class="image"><img src="${cards[i].img}" /></div></div>`)
                    }
                })
            }
        },
        error: (er)=>{
            console.log(JSON.parse(er.responseText));
        }
    });
});

function bindClicks() {
    
}