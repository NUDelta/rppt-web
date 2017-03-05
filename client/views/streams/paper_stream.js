Template.paperStream.rendered = function () {
  Meteor.call('webCreateStream', session, 'publisher', function(err, cred) {
    if (err) {
      alert(err);
    } else {
      let stream = OT.initSession(cred.key, cred.stream);
      stream.connect(cred.token, function(err) {
        publisher = OT.initPublisher();
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
                  height: 550,
                  width: 309,
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


function trackElements() {
  
  defineColors();
  var colors = new tracking.ColorTracker(['red', 'green', 'blue']);
  
  var frame_index = 0

  colors.on('track', function(frame) {
    frame_index = frame_index + 1;
    if (!(frame_index % 50)) {
      console.log(frame_index)
      overlayPhoto(frame);
      trackCamera(frame);
      trackKeyboard(frame);
    }
  });

  tracking.track('.OT_video-element', colors);
};

testFunction = function(){
  console.log('work plz');
}