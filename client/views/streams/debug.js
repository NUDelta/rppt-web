Template.debugURL.events({
    'submit form': function (e) {
        e.preventDefault();
        e.stopPropagation();

        jwplayer('player').play();
    }
});