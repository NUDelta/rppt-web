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

  if ((codes['photo'][0] in codeDict &&
      codes['photo'][1] in codeDict &&
      codes['photo'][2] in codeDict &&
      codes['photo'][3] in codeDict) {

    // TODO: add in algorithm to include bottom right code & make shape more stable
    // publisher is mirrored
    var x = codeDict[codes['photo'][0]].x + codeDict[codes['photo'][0]].radius;
    var y = codeDict[codes['photo'][0]].y - codeDict[codes['photo'][0]].radius;
    var width = x - (codeDict[codes['photo'][1]].x - codeDict[codes['photo'][1]].radius);
    var height = (codeDict[codes['photo'][2]].y + codeDict[codes['photo'][2]].radius) - y;

    var iOSCoordinates = transformCoordinates([x, y, width, height]);

    if (iOSCoordinates) {
      states['photo'] = true;
      // TODO: fix order in server call
      Meteor.call('photo', session, iOSCoordinates[0], iOSCoordinates[1], iOSCoordinates[3], iOSCoordinates[2]);
    }

  } else if (!(codes['photo'][0] in codeDict ||
      codes['photo'][1] in codeDict ||
      codes['photo'][2] in codeDict ||
      codes['photo'][3] in codeDict) &&
      states['photo']) {
    Meteor.call('photo', session, -999, -999, -999, -999);
    states['photo'] = false;
  }

  if ((codes['map'][0] in codeDict &&
      codes['map'][1] in codeDict &&
      codes['map'][2] in codeDict &&
      codes['map'][3] in codeDict)) {

    // TODO: add in algorithm to include bottom right code & make shape more stable
    // publisher is mirrored
    var x = codeDict[codes['map'][0]].x + codeDict[codes['map'][0]].radius;
    var y = codeDict[codes['map'][0]].y - codeDict[codes['map'][0]].radius;
    var width = x - (codeDict[codes['map'][1]].x - codeDict[codes['map'][1]].radius);
    var height = (codeDict[codes['map'][2]].y + codeDict[codes['map'][2]].radius) - y;

    var iOSCoordinates = transformCoordinates([x, y, width, height]);  

    if (iOSCoordinates) {
      states['map'] = true;
      // TODO: fix order in server call
      Meteor.call('map', session, iOSCoordinates[0], iOSCoordinates[1], iOSCoordinates[3], iOSCoordinates[2]);
    }

  } else if (!(codes['map'][0] in codeDict ||
      codes['map'][1] in codeDict ||
      codes['map'][2] in codeDict ||
      codes['map'][3] in codeDict) &&
      states['map']) {
    Meteor.call('map', session, -999, -999, -999, -999);
    states['map'] = false;
  }

}

function transformCoordinates(coordinates) {
  // publisher stream dimensions: [0, 0, 1280, 720]
  // iOS subscriber stream dimensions: [0, 64, 375, 603]

  // the stream size adjusts to the height of the iOS client
  var scale = 603 / 720

  // coordinates from video-canvas
  var scaledX = coordinates[0] * scale;
  var scaledY = coordinates[1] * scale;
  var scaledWidth = coordinates[2] * scale;
  var scaledHeight = coordinates[3] * scale;

  // first, scale web stream, reflection line, and x = 0 for iOS
  var webStreamWidth = 1280 * scale
  var reflectionAxis = webStreamWidth / 2
  var webXForiOS0 = (webStreamWidth - 375) / 2

  // second, reflect for iOS transform
  var reflectedX = reflectionAxis - (scaledX - reflectionAxis)

  // finally, translate x and y
  var iOSX = reflectedX - webXForiOS0;
  // UIStatusBar + UINavigationBar = 64
  var iOSY = scaledY + 64;

  // only return coords if element is in bounds
  if (iOSX > 0 && (iOSX + scaledWidth) < 375 && iOSY > 64 && (iOSY + scaledHeight) < 667) {
    return [iOSX, iOSY, scaledWidth, scaledHeight];
  }

}

