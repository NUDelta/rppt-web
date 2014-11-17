Template.debugURL.events({
    'submit form': function (e) {
        e.preventDefault();
        e.stopPropagation();

        jwplayer('player').stop();
        var stream = $('#URL').val();

        jwplayer('player').setup({
            file: stream,
            image: 'imgs/stickies.jpg',
            height: '360',
            width: '540',
            rtmp: {
                bufferlength: 3
            }
        });

        jwplayer('player').play()
    }
});