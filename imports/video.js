// ideally these would be auto-detected, but for now we'll hardcode
const VIDEO_WIDTH = 1280; //1920;
const VIDEO_HEIGHT = 720; //1080;

// topcodes corresponding to different elements
// arrays correspond to [top left, top right, bottom left, bottom right]
const codes = {
  keyboard : 31,
  camera : 361,
  photo : [93, 155, 203, 271],
  map : [157, 205, 279, 327],
  cameraOverlay : 331,
  photoOverlay : 421,
  mapOverlay : 331,
}

// msgs sent to iOS for elements that should be on-screen
var states = {
  keyboard : false,
  camera : false,
  photo : false,
  map : false, 
  keyboardOverlay : false,
  cameraOverlay : false,
  photoOverlay : false,
  mapOverlay: false, 
}

Template.cc.rendered = function videoSetup() {
  document.querySelector("#camera-button").onclick = function(){ TopCodes.startStopVideoScan('video-canvas'); };
  // TODO: change button color based on state
};

TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {

  // TODO: add in scanning to initial page load
  // TODO: fix for unsteady detection

  var json = JSON.parse(jsonString);
  var topcodes = json.topcodes;

  var ctx = document.querySelector("#video-canvas").getContext('2d');

  // all topcodes currently on screen and their properties
  var codeDict = {}

  // reshape topcode representation
  for (index in topcodes) {

    topcode = topcodes[index];

    // just get the center of the code for now
    codeDict[topcode.code] = {
      x : topcode.x,
      y : topcode.y, 
      radius : topcode.radius
    }
  }

  parseCodes(codeDict); 

});

function parseCodes(codeDict) {

  // TODO: 
  //  - add in screenshots
  //  - don't check every frame
  //  - add a listener for changes in topcodes rather than blocking main thread

  // find codes we care about
  if (codes['keyboard'] in codeDict && 
      !states['keyboard']) {
    Meteor.call('showKeyboard', session);
    states['keyboard'] = true;
  } else if (!(codes['keyboard'] in codeDict) && 
      states['keyboard']) {
    Meteor.call('hideKeyboard', session);
    states['keyboard'] = false;
  }

  if (codes['camera'] in codeDict && 
      !states['camera']) {
    Meteor.call('showCamera', session);
    states['camera'] = true;
  } else if (!(codes['camera'] in codeDict) && 
      states['camera']) {
    Meteor.call('hideCamera', session);
    states['camera'] = false;
  }

  // if ((codes['photo'][0] in codeDict ||
  //     codes['photo'][1] in codeDict || 
  //     codes['photo'][2] in codeDict || 
  //     codes['photo'][3] in codeDict) && 
  //     !states['photo']) {
  //   // TODO: call `photo` with correct coordinates
  //   // make sure the iOS side updates coordinates based on server call unless all read -999
  //   states['photo'] = true;
  //   // TODO: fix hide condition
  // } else if (states['photo']) {
  //   Meteor.call('photo', session, -999, -999, -999, -999);
  //   states['photo'] = false;
  // }

  // if ((codes['map'][0] in codeDict ||
  //     codes['map'][1] in codeDict ||
  //     codes['map'][2] in codeDict || 
  //     codes['map'][3] in codeDict) && 
  //     !states['map']) {
  //   // TODO: call `map` with correct coordinates
  //   // make sure the iOS side updates coordinates based on server call unless all read -999
  //   states['map'] = true;
  //   // TODO: fix hide condition
  // } else if (states['map']) {
  //   Meteor.call('map', session, -999, -999, -999, -999);
  //   states['map'] = false;
  // }
}

