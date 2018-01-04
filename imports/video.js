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

  if (codes['camera'] in codeDict) {

    console.log("in camera")

    if (!states['camera']) {
      Meteor.call('showCamera', session);
      states['camera'] = true;
    }

    if (codes['cameraOverlay'] in codeDict) {
      console.log("overlay")
      var screenshotWidth = (720 / 667) * 375;
      var screenshotX = (1280 - screenshotWidth) / 2;

      // Camera always takes up the whole screen on iOS, so send everything in the interface region
      // Picker doesn't include UINavBar or UIStatusBar
      screenshot(screenshotX, 0, screenshotWidth, 720, 0, 0, 375, 667, "cameraOverlay", "true");
    }

  } else if (!(codes['camera'] in codeDict) && 
      states['camera']) {

    Meteor.call('hideCamera', session);
    states['camera'] = false;

  }

  if ((codes['photo'][0] in codeDict &&
      codes['photo'][1] in codeDict &&
      codes['photo'][2] in codeDict &&
      codes['photo'][3] in codeDict)) {

    // TODO: add in algorithm to include bottom right code & make shape more stable
    // publisher is mirrored
    var x = codeDict[codes['photo'][0]].x + codeDict[codes['photo'][0]].radius;
    var y = codeDict[codes['photo'][0]].y - codeDict[codes['photo'][0]].radius;
    var width = x - (codeDict[codes['photo'][1]].x - codeDict[codes['photo'][1]].radius);
    var height = (codeDict[codes['photo'][2]].y + codeDict[codes['photo'][2]].radius) - y;

    var iOSCoordinates = transformCoordinates([x, y, width, height]);

    if (iOSCoordinates) {
      // TODO: fix order in server call
      Meteor.call('photo', session, iOSCoordinates[0], iOSCoordinates[1], iOSCoordinates[3], iOSCoordinates[2]);
      states['photo'] = true;
    }

    if (codes['photoOverlay'] in codeDict) {
      // Topcodes are detected in the mirrored publisher stream
      var screenshotX = codeDict[codes['photo'][0]].x - codeDict[codes['photo'][0]].radius;
      var screenshotY = codeDict[codes['photo'][0]].y + codeDict[codes['photo'][0]].radius;
      var screenshotWidth =  screenshotX - (codeDict[codes['photo'][1]].x + codeDict[codes['photo'][1]].radius);
      var screenshotHeight = (codeDict[codes['photo'][2]].y - codeDict[codes['photo'][2]].radius) - screenshotY;

      var screenshotIOSCoordinates = transformCoordinates([screenshotX, screenshotY, screenshotWidth, screenshotHeight]);

      // Reflect x since the image data is not mirrored (& publisher stream is)
      var reflectionAxis = 1280 / 2;
      screenshotX = reflectionAxis - (screenshotX - reflectionAxis)

      if (screenshotIOSCoordinates) {
        screenshot(screenshotX, screenshotY, screenshotWidth, screenshotHeight, screenshotIOSCoordinates[0], screenshotIOSCoordinates[1], screenshotIOSCoordinates[2], screenshotIOSCoordinates[3], "photoOverlay", "false");
      }

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
      // TODO: fix order in server call
      Meteor.call('map', session, iOSCoordinates[0], iOSCoordinates[1], iOSCoordinates[3], iOSCoordinates[2]);
      states['map'] = true;
    }

    if (codes['mapOverlay'] in codeDict) {
      // Topcodes are detected in the mirrored publisher stream
      var screenshotX = codeDict[codes['map'][0]].x - codeDict[codes['map'][0]].radius;
      var screenshotY = codeDict[codes['map'][0]].y + codeDict[codes['map'][0]].radius;
      var screenshotWidth =  screenshotX - (codeDict[codes['map'][1]].x + codeDict[codes['map'][1]].radius);
      var screenshotHeight = (codeDict[codes['map'][2]].y - codeDict[codes['map'][2]].radius) - screenshotY;

      var screenshotIOSCoordinates = transformCoordinates([screenshotX, screenshotY, screenshotWidth, screenshotHeight]);

      // Reflect x since the image data is not mirrored (& publisher stream is)
      var reflectionAxis = 1280 / 2;
      screenshotX = reflectionAxis - (screenshotX - reflectionAxis)

      if (screenshotIOSCoordinates) {
        screenshot(screenshotX, screenshotY, screenshotWidth, screenshotHeight, screenshotIOSCoordinates[0], screenshotIOSCoordinates[1], screenshotIOSCoordinates[2], screenshotIOSCoordinates[3], "mapOverlay", "false");
      }

    }

  } else if (!(codes['map'][0] in codeDict ||
      codes['map'][1] in codeDict ||
      codes['map'][2] in codeDict ||
      codes['map'][3] in codeDict) &&
      states['map']) {
    Meteor.call('map', session, -999, -999, -999, -999);
    states['map'] = false;
  }

  // remove overlays w/o appr code regardless if native elements are on screen
  if (!(codes['mapOverlay'] in codeDict) && 
      states['mapOverlay']) {
    Meteor.call('sendOverlay', session, -999, -999, -999, -999, "", "false");
    states['mapOverlay'] = false;
  }

  if (!(codes['photoOverlay'] in codeDict) && 
      states['photoOverlay']) {
    Meteor.call('sendOverlay', session, -999, -999, -999, -999, "", "false");
    states['photoOverlay'] = false;
  }

  if (!(codes['cameraOverlay'] in codeDict) && 
      states['cameraOverlay']) {
    console.log("hiding overlay")
    Meteor.call('sendOverlay', session, -999, -999, -999, -999, "", "true");
    states['cameraOverlay'] = false;
  }

}

// send top left x and y in web stream, height, and width
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

// change to arrays
function screenshot(x, y, width, height, x_ios, y_ios, width_ios, height_ios, overlayType, isCameraOverlay) {
  const data = publisher.getImgData();
  const canvas = document.createElement('canvas');
  // canvas.style.background = 'orange';
  const img = document.createElement("img");
  img.src = 'data:image/png;base64,' + data;
  const paper = document.getElementById('paper');
  paper.appendChild(img);
  img.onload = function() {
    whiteToTransparent(canvas, img, x, y, width, height, function(canvas) {
      sendToiPhone(canvas, x_ios, y_ios, width_ios, height_ios, overlayType, isCameraOverlay)
    });
  };
};

function whiteToTransparent(canvas, img, x, y, width, height, callback) {
  canvas.width = img.offsetWidth;
  canvas.height = img.offsetHeight;

  const ctx = canvas.getContext('2d');
  // TODO: change to an image bitmap
  ctx.drawImage(img, 0, 0);

  var imageData = ctx.getImageData(x, y, width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    //if it's white, turn it transparent
    const threshold = 100;
    // what are these things
    if (imageData.data[i] > threshold && imageData.data[i+1] > threshold && imageData.data[i+2] > threshold) {
        imageData.data[i+3] = 0;
      }
  }

  // clear canvas for redrawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.height = height;
  canvas.width = width;

  //ctx should automatically update since its passed by referenced
  ctx.putImageData(imageData, 0, 0);
  callback(canvas);
}

function sendToiPhone(canvas, x_ios, y_ios, width_ios, height_ios, overlayType, isCameraOverlay) {
  const encodedImage = canvas.toDataURL().replace('data:image/png;base64,', '');
  const img = document.createElement('img');
  img.src = `data:image/png;base64,${ encodedImage}`;
  const paper = document.getElementById('paper');
  paper.appendChild(img);
  Meteor.call('sendOverlay', session, x_ios, y_ios, width_ios, height_ios, encodedImage, isCameraOverlay);
  states[overlayType] = true;
}