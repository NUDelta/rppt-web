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

// BEST PRACTICES THO
var red = false;
var green = false;
var blue = false;

function trackElements() {
  
  defineColors();
  var colors = new tracking.ColorTracker(['red', 'green', 'blue']);
  
  var frame_index = 0

  colors.on('track', function(frame) {
    frame_index = frame_index + 1;
    if (!(frame_index % 30)) {
      console.log(frame_index)
      trackCamera(frame);
      overlayPhoto(frame);
      trackKeyboard(frame);
    }
  });

  tracking.track('.OT_video-element', colors);
};


function trackKeyboard(event) {
    // if there is a square detected
    if (event.data.length > 0){ 
      // loop through all squares
      event.data.forEach(function(rect) {
        if(rect.color === 'red') {
            console.log('show keyboard', rect.x, rect.y);
            red = true;
            Meteor.call('keyboard', session, rect.x.toString(), rect.y.toString(), rect.height.toString(), rect.width.toString(), (err, res) => {
                if (err) {
                    // This should actually never hit.
                } else {
                }
            }); 
        }
      })
    }

    // if no square found in the frame
    else {
      if (red){
        console.log('hide keyboard');
        red = false; 
        Meteor.call('keyboard', session, null, null, null, null, (err, res) => {
            if (err) {
                // This should actually never hit.
            } else {
            }
        });
      }
    }
  };

function overlayPhoto(event) {
  if (event.data.length > 0) {
      event.data.forEach(function(rect) {
      if(rect.color === 'blue') {
          console.log('overlay photo');
          console.log(rect.x, rect.y);
          blue = true;
          Meteor.call('photo', session, rect.x.toString(), rect.y.toString(), rect.height.toString(), rect.width.toString(), (err, res) => { 
            if (err) {
                alert(err);
                // This should actually never hit.
            } else {
            }
          });
        }
        
        // if we had blue last time and now do not
      else {
        if(blue) {
          blue = false;
          console.log('hide photo')
          Meteor.call('photo', session, null, null, null, null, (err, res) => { 
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

function trackCamera(event) {
  if (event.data.length > 0) {
    event.data.forEach(function(rect) {
      if(rect.color === 'green') {
        if(!green) {
          green = true;
          console.log('show camera');
          Meteor.call('showCamera', session, (err, res) => { 
            if (err) {
                alert(err);
                // This should actually never hit.
            } else {
            }
          });
          return;
        }
      }

      else {
        if(green) {
          green = false;
          Meteor.call('hideCamera', session, (err, res) => {
          if (err) {
              alert(err);
              // This should actually never hit.
          } else {
          }
          });
          return;
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

  tracking.ColorTracker.registerColor('blue', function(r, g, b) {
    if (r < 170 && g > 230 && b > 230) {
      return true;
    }
    return false;
  });
}
