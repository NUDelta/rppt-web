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

screenshot = function() {
  var data = publisher.getImgData();
  var img = document.createElement("img");
  img.src = "data:image/png;base64," + data;
  //document.getElementById('paper').appendChild(img);
  var canvas = document.createElement("canvas");
  img.onload = function() {
    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0);

    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
      //if it's white, turn it transparent
      if (data[i] > 200 && data[i+1] > 200 && data[i+2] > 200) {
          data[i+3] = 0; 
          console.log("changed to white");
        }
    }

    ctx.putImageData(imageData,0,0);
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
    window.location.href=image; // it will save locally
  }
};

