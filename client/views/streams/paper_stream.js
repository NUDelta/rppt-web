Template.paperStream.rendered = function () {

  Meteor.call('webCreateStream', session, 'publisher', function (err, cred) {
    if (err) {
      alert(err);
    } else {
      let stream = OT.initSession(cred.key, cred.stream);
      stream.connect(cred.token, function(err) {
        publisher = OT.initPublisher('publisher');
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
  });
};

screenshot = function(x, y, width, height, x_ios, y_ios, width_ios, height_ios) {
  const data = publisher.getImgData();
  const canvas = document.createElement('canvas');
  const img = document.createElement("img");
  img.src = 'data:image/png;base64,' + data;
  const paper = document.getElementById('paper');
  paper.appendChild(img);
  img.onload = function() {
    whiteToTransparent(canvas, img, x, y, width, height, function(canvas) {
      sendToiPhone(canvas, x_ios, y_ios, width_ios, height_ios)
    });
  };
};

function whiteToTransparent(canvas, img, x, y, width, height, callback) {
  console.log('whiteToTransparent');
  canvas.width = img.offsetWidth;
  canvas.height = img.offsetHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  var imageData = ctx.getImageData(x, y, width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    //if it's white, turn it transparent
    const threshold = 100;
    if (imageData.data[i] > threshold && imageData.data[i+1] > threshold && imageData.data[i+2] > threshold) {
        imageData.data[i+3] = 0;
      }
  }

  // clear canvas for redrawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.height = height;
  canvas.width = width;

  // //ctx should automatically update since its passed by referenced
  ctx.putImageData(imageData, 0, 0);
  callback(canvas);
}

function sendToiPhone(canvas, x_ios, y_ios, width_ios, height_ios) {
  const encodedImage = canvas.toDataURL().replace('data:image/png;base64,', '');
  const img = document.createElement('img');
  img.src = `data:image/png;base64,${ encodedImage}`;
  const paper = document.getElementById('paper');
  paper.appendChild(img);
  Meteor.call('sendOverlay', session, x_ios, y_ios, width_ios, height_ios, encodedImage);
}


// for AR
cameraPickerScreenshot = function() {
  const data = publisher.getImgData();
  const canvas = document.createElement('canvas');
  const img = document.createElement("img");
  img.src = 'data:image/png;base64,' + data;
  const paper = document.getElementById('paper');
  paper.appendChild(img);
  img.onload = function() {
    console.log('whiteToTransparent');
    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    var heightOffset = (canvas.height - 550) / 2
    var widthOffset = (canvas.width - 320) / 2

    var imageData = ctx.getImageData(widthOffset, heightOffset, 320, 550);

    for (let i = 0; i < imageData.data.length; i += 4) {
      //if it's white, turn it transparent
      const threshold = 100;
      if (imageData.data[i] > threshold && imageData.data[i+1] > threshold && imageData.data[i+2] > threshold) {
          imageData.data[i+3] = 0;
        }
    }

    // //ctx should automatically update since its passed by referenced
    ctx.putImageData(imageData, 0, 0);

    const encodedImage = canvas.toDataURL().replace('data:image/png;base64,', '');
    Meteor.call('sendFullOverlay', session, encodedImage);
  }
}

