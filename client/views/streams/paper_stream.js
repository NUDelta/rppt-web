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
                  width: 309,
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

screenshot = function(x, y, height, width) {

  var data = publisher.getImgData();
  var img = document.createElement("img");

  img.src = "data:image/png;base64," + data;
  document.getElementById('paper').appendChild(img);

  var canvas = document.createElement("canvas");

  console.log("This should happen first.")

  img.onload = function() {
    whiteToTransparent(canvas, img, x, y, height, width, function(canvas) {
      sendToiPhone(canvas, x, y, height, width)
    });
  };
};

function whiteToTransparent(canvas, img, x, y, height, width, callback) {
  console.log("This should happen second.")

  console.log(x)

  // canvas.width = img.offsetWidth;
  // canvas.height = img.offsetHeight;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  console.log("Before encoding")
  console.log(canvas.toDataURL())

  var imageData = ctx.getImageData(x, y, width, height);
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    //if it's white, turn it transparent
    if (data[i] > 200 && data[i+1] > 200 && data[i+2] > 200) {
        data[i+3] = 0; 
        console.log("changed to white");
      }
  }

  ctx.putImageData(imageData, x, y);

  console.log("This should happen two and a halfith");

  callback(canvas);
};

function sendToiPhone(canvas, x, y, height, width) {
  console.log("This should happen third.")

  var encodedImage = canvas.toDataURL();
  //remove "data:image/png;base64," and just send data
  encodedImage = encodedImage.replace("data:image/png;base64,", "");
  console.log("encodedImage")
  console.log(encodedImage); 
  Meteor.call('sendOverlay', session, x, y, height, width, encodedImage);
}

