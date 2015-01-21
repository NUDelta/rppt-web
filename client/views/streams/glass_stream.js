Template.glassStream.rendered = function () {

    Meteor.call('createSession', 'subscriber', function(err, res) {
        if (err) {
            console.log(err);
        }
        else {
            var session = OT.initSession(res.key, res.session);
            session.on("streamCreated", function(event) {
                var style = {backgroundImageURI: "stickies.jpg"};
                var properties = {height: 320, width: 480, name: "Glass Stream", style: style};
                var subscriber = session.subscribe(event.stream, "subscriber", properties);

                $('#subscriber').css('outline', 'none');
              });

            session.connect(res.token);
        }
    });
};