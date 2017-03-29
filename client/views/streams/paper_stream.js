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

screenshot = function (x, y, width, height, x_ios, y_ios, width_ios, height_ios) {
  // Clean up stale artifacts
  var className = 'slim';
  // var stale = document.querySelectorAll(`.${className}`);
  // for (var j = 0; j < stale.length; j++) {
  //   var node = stale[j];
  //   node.parentNode.removeChild(node);
  // }

  console.time('create image')
  var paper = document.getElementById('paper');
  var img = document.createElement('img');
  console.timeEnd('create image')
  img.className = className;
  console.time('img src')
  img.src = 'data:image/png;base64,' + publisher.getImgData();
  console.timeEnd('img src')
  console.time('appendChild')
  paper.appendChild(img);
  console.timeEnd('appendChild')

  console.time('create canvas');
  var canvas = document.createElement('canvas');
  canvas.className = className;
  canvas.width = img.width;
  canvas.height = img.height;
  console.timeEnd('create canvas')

  console.time('get context');
  var ctx = canvas.getContext('2d');
  console.timeEnd('get context');
  console.time('draw image')
  ctx.drawImage(img, 0, 0);
  console.timeEnd('draw image')
  console.time('get imag data')
  var imageData = ctx.getImageData(0, 0, width, height);
  console.timeEnd('get imag data')

  var data = imageData.data;
  var threshold = 200;
  console.time('transp')
  for (var i = 0; i < data.length; i += 4) {
    const isWhite = data[i] > threshold
                 && data[i + 1] > threshold
                 && data[i + 2] > threshold;
    if (isWhite) {
      data[i + 3] = 0;
    }
  }
  console.timeEnd('transp')
  canvas.height = height;
  canvas.width = width;
  console.time('put image')
  ctx.putImageData(imageData, 0, 0);
  console.timeEnd('put image')
  console.time('todataurl')

  var encoded = canvas.toDataURL();
  console.timeEnd('todataurl')
  var index = 'data:image/png;base64,'.length;
  var newImageData = encoded.substring(index);
  Meteor.call('sendOverlay', session, x_ios, y_ios, width_ios, height_ios, newImageData);
  paper.appendChild(canvas);
}

// screenshot = function(x, y, width, height, x_ios, y_ios, width_ios, height_ios) {

//   var data = publisher.getimgdata();
//   var img = document.createelement("img");

//   img.src = "data:image/png;base64," + data;

//   var canvas = document.createelement("canvas");
//   var paper = document.getelementbyid('paper')

//   paper.appendchild(img)

//   img.onload = function() {
//     whitetotransparent(canvas, img, x, y, width, height, x_ios, y_ios, width_ios, height_ios, function(canvas) {
//       sendtoiphone(canvas, x_ios, y_ios, width_ios, height_ios)
//     });
//   };
// };

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
