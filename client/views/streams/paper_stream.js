Template.paperStream.rendered = function () {
  Meteor.call('webCreateStream', session, 'publisher', function(err, cred) {
    if (err) {
      alert(err);
    } else {
      let stream = OT.initSession(cred.key, cred.stream);
      stream.connect(cred.token, function(err) {
        let properties = {
              height: 550,
              width: 309,
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
        $('#subscriber').css('outline', 'none');
      });
      Meteor.call('mobileCreateStream', session, 'publisher', function(err, cred) {
        if (err) {
            alert(err);
        } else {
            let stream = OT.initSession(cred.key, cred.stream);
            stream.on("streamCreated", function(event) {
            let properties = {
                  height: 550,
                  width: 309,
                  name: 'Paper Stream x2',
                  mirror: false,
                  style: {
                    audioLevelDisplayMode: 'on',
                    buttonDisplayMode: 'on'
                  }
                };
                stream.subscribe(event.stream, "subscriber", properties);
                $('#publisher').css('outline', 'none');
              });
            stream.connect(cred.token);
        }
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
  let leftRightOffset = ($('.paper-col .content').width() - 320) / 2;

    // if there is a square detected
    if (event.data.length > 0){ 
      // loop through all squares
      event.data.forEach(function(rect) {
        if(rect.color === 'red') {
            red = true;
            console.log('webcam vals', rect.x, rect.y);
            var x = rect.x - leftRightOffset;
            var y = rect.y + 40; // status bar offset
            console.log('sent vals', x, rect.y);
            Meteor.call('keyboard', session, x.toString(), y.toString(), rect.height.toString(), rect.width.toString(), (err, res) => {
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
        red = false;
        console.log('hide keyboard');
        Meteor.call('keyboard', session, -999, -999, -999, -999, (err, res) => {
            if (err) {
                // This should actually never hit.
            } else {
            }
        });
      }
    }
  };

function overlayPhoto(event) {
  let leftRightOffset = ($('.paper-col .content').width() - 320) / 2;
  
  if (event.data.length > 0) {
      event.data.forEach(function(rect) {
      if(rect.color === 'blue') {
          console.log('overlay photo');
          console.log(rect.x, rect.y);
          var x = rect.x - leftRightOffset;
          var y = rect.y + 40; // status bar offset
          console.log('adjusted coordinates');
          console.log(x, y);
          blue = true;
          Meteor.call('photo', session, x.toString(), y.toString(), rect.height.toString(), rect.width.toString(), (err, res) => { 
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
          Meteor.call('photo', session, -999, -999, -999, -999, (err, res) => { 
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
  var green_detected = false;
  if (event.data.length > 0) {
    event.data.forEach(function(rect) {
      if(rect.color === 'green') {
        green_detected = true;
        }
      });

  if (green_detected) {
    if(!green) {
      green = true;
      console.log('show camera');
      Meteor.call('showCamera', session, (err, res) => { 
        if (err) {
            alert(err);
            // This should actually never hit.
          }
        });
      }
    }
  }

  else {
    if(green) {
      green = false;
      console.log('hide camera')
      Meteor.call('hideCamera', session, (err, res) => {
      if (err) {
        alert(err);
        // This should actually never hit.
        } 
      });
    }
  }
};

  

function defineColors() {
  tracking.ColorTracker.registerColor('red', function(r, g, b) {
    if (r > 130 && g < 55 && b < 75) {
      return true;
    }
    return false;
  });

  tracking.ColorTracker.registerColor('green', function(r, g, b) {
    if (r < 150 && g > 150 && b < 175) {
      return true;
    }
    return false;
  });

  tracking.ColorTracker.registerColor('blue', function(r, g, b) {
    if (r < 160 && g > 155 && b > 195) {
      return true;
    }
    return false;
  });
}
