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
          trackElements();
        });
        $('#publisher').css('outline', 'none');
      });
    }
  });
};



function trackElements() {

  defineColors();

  var colors = new tracking.ColorTracker(['red', 'green']);

  var red = false;
  var green = false;


  colors.on('track', function(event) {
    trackKeyboard(event);
    trackCamera(event);
  });

  tracking.track('.OT_video-element', colors);
};


function trackKeyboard(event, red) {
    // if there is a square detected
    if (event.data.length > 0){ 
      // loop through all squares
      event.data.forEach(function(rect) {
        // if there's a red square
        if(rect.color === 'red') {
          // if we didn't have red in previous frame
          if (!red){ // if we didn't have red in previous frame
            Meteor.call('showKeyboard', session, (err, res) => {
                if (err) {
                    // This should actually never hit.
                } else {
                }
            }); 
            red = true;
          } 
        }
      })
    }

    // if no square found in the frame
    else {
      if (red){ 
        Meteor.call('hideKeyboard', session, (err, res) => {
            if (err) {
                // This should actually never hit.
            } else {
            }
        }); 
        red = false;
      }
    }
  };

function trackCamera(event) {
    if (event.data.length > 0){
      event.data.forEach(function(rect) {
        if(rect.color === 'green') {
          Meteor.call('showCamera' rect.x, rect.y, rect.height, rect.width, (err, res) => {
            if (err) {
                // This should actually never hit.
            } else {
            });
        }
      }); 
    }
  };

function defineColors() {
  tracking.ColorTracker.registerColor('red', function(r, g, b) {
    if (r > 195 && g < 100 && b < 100) {
      return true;
    }
    return false;
  });

  tracking.ColorTracker.registerColor('green', function(r, g, b) {
    if (r < 50 && g > 200 && b < 50) {
      return true;
    }
    return false;
  });
}