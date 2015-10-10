Template.paperStream.rendered = function () {
    Meteor.call('webCreateStream', session, 'publisher', function(err, cred) {
        if (err) {
            alert(err);
        } else {
            let stream = OT.initSession(cred.key, cred.stream);
            stream.connect(cred.token, function(err) {
                let properties = {
                        height: 460,
                        width: 320,
                        name: 'Paper Stream',
                        mirror: false,
                        style: {
                            audioLevelDisplayMode: 'on',
                            buttonDisplayMode: 'on'
                        }
                    },
                    publisher = OT.initPublisher('publisher', properties);
                stream.publish(publisher);
                $('#publisher').css('outline', 'none');
            });
        }
    });
};
