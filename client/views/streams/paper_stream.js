Template.paperStream.rendered = function () {

    Meteor.call('createSession', 'publisher', function(err, res) {
        if (err) {
            console.log(err);
        }
        else {
            var session = OT.initSession(res.key, res.session);
            session.connect(res.token, function(err) {
                var properties = {height: 460, width: 320, name: 'Paper Stream', mirror: false, style: {audioLevelDisplayMode: "on", buttonDisplayMode: "on"}};
                var publisher = OT.initPublisher('publisher', properties);
                session.publish(publisher);

                $('#publisher').css('outline', 'none');
            });
        }
    });
};
