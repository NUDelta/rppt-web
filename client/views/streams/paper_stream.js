Template.paperStream.rendered = function () {
  Meteor.call('webCreateStream', session, 'publisher', function(err, cred) {
    if (err) {
      alert(err);
    } else {
      let stream = OT.initSession(cred.key, cred.stream);
      stream.connect(cred.token, function(err) {
        let properties = {
              height: 550,
              width: 286,
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

var red = false;
var green = false;

function trackElements() {

  defineColors();

  var colors = new tracking.ColorTracker(['red', 'green']);

  colors.on('track', function(event) {
    trackKeyboard(event);
    
    // only update camera coords once a second
    setTimeout( function() {
      trackCamera(event);
    }, 1000);
  });

  tracking.track('.OT_video-element', colors);
};


function trackKeyboard(event) {
    // if there is a square detected
    if (event.data.length > 0){ 
      // loop through all squares
      event.data.forEach(function(rect) {
        // if there's a red square
        if(rect.color === 'red') {
          // if we didn't have red in previous frame
          if (!red){ // if we didn't have red in previous frame
            console.log('show keyboard');
            red = true;
            Meteor.call('showKeyboard', session, (err, res) => {
                if (err) {
                    // This should actually never hit.
                } else {
                }
            }); 
          } 
        }
      })
    }

    // if no square found in the frame
    else {
      if (red){
        console.log('hideKeyboard');
        red = false; 
        Meteor.call('hideKeyboard', session, (err, res) => {
            if (err) {
                // This should actually never hit.
            } else {
            }
        });
      }
    }
  };

function trackCamera(event) {
  if (event.data.length > 0) {
      event.data.forEach(function(rect) {
        if(rect.color === 'green') {
          green = true;
          console.log('show camera');
          console.log(rect.x, rect.y);
          Meteor.call('showCamera', session, rect.x.toString(), rect.y.toString(), rect.height.toString(), rect.width.toString(), (err, res) => { 
            if (err) {
                alert(err);
                // This should actually never hit.
            } else {
            }
          });
        }
        
        // if we had green last time and now do not
        else {
          if(green) {
            Meteor.call('hideCamera', session, (err, res) => { 
            if (err) {
                alert(err);
                // This should actually never hit.
            } else {
            }
          });
          }
        } 
      })
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
    if (r < 50 && g > 115 && b < 120) {
      return true;
    }
    return false;
  });
}