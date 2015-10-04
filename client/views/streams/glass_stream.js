Template.glassStream.rendered = function () {

    Meteor.call('createSession', 'subscriber', function(err, res) {
        if (err) {
            console.log(err);
        } else {
            let session = OT.initSession(res.key, res.session);
            session.on("streamCreated", function(event) {
                let height = 320,
                    width = 480,
                    style = { backgroundImageURI: "stickies.jpg" }
                let properties = { height: height, width: width, name: "Glass Stream", style: style };
                let subscriber = session.subscribe(event.stream, "subscriber", properties);

                $('#subscriber').css('outline', 'none');
              });

            session.connect(res.token);
        }
    });
};
