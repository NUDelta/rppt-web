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
                  width: 320,
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
  })
};

screenshot = function(x, y, width, height, x_ios, y_ios, width_ios, height_ios) {

  var data = publisher.getImgData();
  var img = document.createElement("img");

  img.src = "data:image/png;base64," + data;

  var canvas = document.createElement("canvas");
  var paper = document.getElementById('paper')

  paper.appendChild(img)

  img.onload = function() {
    whiteToTransparent(canvas, img, x, y, width, height, x_ios, y_ios, width_ios, height_ios, function(canvas) {
      sendToiPhone(canvas, x_ios, y_ios, width_ios, height_ios)
    });
  };
};

function whiteToTransparent(canvas, img, x, y, width, height, x_ios, y_ios, width_ios, height_ios, callback) {

  canvas.width = img.offsetWidth
  canvas.height = img.offsetHeight

  var ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);

  var imageData = ctx.getImageData(x, y, width, height);

  for (var i = 0; i < imageData.data.length; i += 4) {
    //if it's white, turn it transparent
    if (imageData.data[i] > 200 && imageData.data[i+1] > 200 && imageData.data[i+2] > 200) {
        imageData.data[i+3] = 0; 
        console.log("changed to white");
      }
  }

  //clear canvas for redrawing
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  canvas.height = height
  canvas.width = width

  //ctx should automatically update since its passed by referenced
  ctx.putImageData(imageData, 0, 0);

  callback(canvas);
};

function sendToiPhone(canvas, x_ios, y_ios, width_ios, height_ios) {

  var encodedImage = canvas.toDataURL();

  //remove "data:image/png;base64," and just send data
  encodedImage = encodedImage.replace("data:image/png;base64,", "");

  Meteor.call('sendOverlay', session, x_ios, y_ios, width_ios, height_ios, encodedImage);
};

testFunction = function(){
  console.log('work plz');
}