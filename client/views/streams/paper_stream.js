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
        stream.publish(publisher, function() {
          showKeyboard();
        });
        $('#publisher').css('outline', 'none');
      });
    }
  });
};



function showKeyboard() {
  tracking.ColorTracker.registerColor('red', function(r, g, b) {
  if (r > 195 && g < 100 && b < 100) {
    return true;
  }
    return false;
  }); 

  var colors = new tracking.ColorTracker(['red']);

  var red_detected = false;

  colors.on('track', function(event) {
    if (event.data.length > 0) { // if red square found in this frame
      if (!red_detected){ // if we didn't have red in previous frame
        
        // call for keyboard
        Meteor.call('showKeyboard', session, (err, res) => {
            if (err) {
                // This should actually never hit.
                console.log('message failed');
            } else {
                console.log('show message succeeded');
            }
        }); 
        
        red_detected = true;
      }
    }
    else {
      if (red_detected){ 
        
        Meteor.call('hideKeyboard', session, (err, res) => {
            if (err) {
                // This should actually never hit.
                console.log('message failed');
            } else {
                console.log('hide message succeeded');
            }
        }); 

        red_detected = false;
      }
    }
  });

  tracking.track('.OT_video-element', colors);
}