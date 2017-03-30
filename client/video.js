/*
 * Tangible Spark
 */

// ideally these would be auto-detected, but for now we'll hardcode
const VIDEO_WIDTH = 1280; //1920;
const VIDEO_HEIGHT = 720; //1080;

var video;
var stream;
var deviceId;


// constraints object used by getUserMedia
var videoConstraints = {
  audio: false,
  video: {
    deviceId: undefined,
    width: {exact: VIDEO_WIDTH},
    height: {exact: VIDEO_HEIGHT}
  }
};

setTimeout(function() {
    console.log('timeout done');
    video = document.querySelector("#video-stream");
    video.onpause = stopVideo;  // allows dart to stop the video
    document.querySelector("#camera-button").onclick = startStopVideo;
  }, 2000);


navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
  .catch(console.log("error enumerating devices."));


function startStopVideo() {
  stream ? stopVideo() : startVideo();
}


function stopVideo() {
  if (stream) {
    stream.getTracks().forEach(function (track) { track.stop(); })
    video.className = "stopped";  // use this class name to communicate with dart
    $('#camera-button').css('color', 'white');
    stream = null;
  }   
}


function startVideo() {
  if (!stream) {
    navigator.mediaDevices.getUserMedia(videoConstraints)
      .then(function(mediaStream) {
        video.width = VIDEO_WIDTH;
        video.height = VIDEO_HEIGHT;
        video.srcObject = mediaStream;
        video.className = "started";  // use this class name to communicate with dart
        stream = mediaStream;
        $('#camera-button').css('background-color', 'red');
      })

      .catch(function (error) {
        console.log('getUserMedia error!', error);
      });
  }
}


function gotDevices(deviceInfos) {
  var camcount = 0;   //used for labeling if the device label is not enumerated
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'videoinput') {
      console.log(deviceInfo.deviceId);
      deviceId = deviceInfo.deviceId;
      videoConstraints.video.deviceId = deviceId;
      camcount++;
    }
  }
  console.log("Found " + camcount + " cameras.");
}


