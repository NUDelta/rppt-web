Template.paperStream.rendered = function () {

  Meteor.call('webCreateStream', session, 'publisher', function (err, cred) {
    if (err) {
      alert(err);
    } else {
      let stream = OT.initSession(cred.key, cred.stream);
      stream.connect(cred.token, function(err) {
        // make publisher element on cc same dimensions as camera stream
        var properties = {
          width : 256,
          height : 144
        };
        publisher = OT.initPublisher('publisher', properties);
        stream.publish(publisher);
      });
      Meteor.call('webCreateStream', session, 'subscriber', function(err, cred) {
        if (err) {
            alert(err);
        } else {
            let stream = OT.initSession(cred.key, cred.stream);
            stream.connect(cred.token);
            stream.on("streamCreated", function(event) {
              let properties = {
                  width: 375,
                  height: 667,
                  name: 'iPhone Stream',
                  mirror: false,
                  style: {
                    audioLevelDisplayMode: 'on',
                    buttonDisplayMode: 'on'
                  }
              };
              stream.subscribe(event.stream, 'paper', properties);
              $('#paper').css('outline', 'none');
          });
        }
      });
    }
  });
};
