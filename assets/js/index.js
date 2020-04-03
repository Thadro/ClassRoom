$(document).ready(function(){

    $('#sign-in-to-chat').mouseenter(function(){
        $('#a-btn').css({
            'color' : '#eb2a5c',
            transitionDuration: '0.5s'
        })
    })

    $('#sign-in-to-chat').mouseleave(function(){
        $('#a-btn').css({
            'color' : '#F7F7F2',
            transitionDuration: '0.5s'
        })
    })
})