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
          Qinit();
        });
        $('#publisher').css('outline', 'none');
      });
    }
  });
};


function trackElements() {
  
  defineColors();
  var colors = new tracking.ColorTracker(['red', 'green', 'blue']);
  
  var frame_index = 0

  colors.on('track', function(frame) {
    frame_index = frame_index + 1;
    if (!(frame_index % 50)) {
      console.log(frame_index)
      overlayPhoto(frame);
      trackCamera(frame);
      trackKeyboard(frame);
    }
  });

  tracking.track('.OT_video-element', colors);
};

function Qinit() {
      var timeoutHandle;
      var kb = false;
   
      Quagga.init({
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: document.querySelector('#viewport'),
          constraints : {
            frequency: 2
          }
        },
        decoder : {
          readers : ["i2of5_reader"]
        }
      }, function(err) {
        if (err) {
          console.log('error handler start.');
          console.log(err);
          return
        }
      })
      
      console.log("Initialization finished. Ready to start");
      
      // setTimeout(function(){
      //   Quagga.start();
      // }, 2000);



      Quagga.onDetected(function(result) {
        console.log(result.codeResult.code); //, result.codeResult.start, result.codeResult.end);

        if (result.codeResult.code == 100040) {
          if (!kb) {
            console.log('showKeyboard');
            Meteor.call('showKeyboard', session, (err, res) => {
              if (err) {
                // this should never actually hit
              }
              else{
              }
            })

            kb = true;
          }

          if (timeoutHandle){
            clearTimeout(timeoutHandle);
            }

          timeoutHandle = setTimeout(function(){
              kb = false;
              console.log('hideKeyboard');
              Meteor.call('showKeyboard', session, (err, res) => {
                if (err) {
                  // this should never actually hit
                }
                else{
                }
              })
            }, 3000);
        }    
       // Quagga.offDetected();
       // Quagga.offProcessed();
       // Quagga.stop();
      });

      // Quagga.onProcessed(function(result) {
      //   var drawingCtx = Quagga.canvas.ctx.overlay,
      //       drawingCanvas = Quagga.canvas.dom.overlay;

      //   if (result) {
      //       if (result.boxes) {
      //           drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      //           result.boxes.filter(function (box) {
      //               return box !== result.box;
      //           }).forEach(function (box) {
      //               Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
      //           });
      //       }

      //       if (result.box) {
      //           Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
      //       }

      //       if (result.codeResult && result.codeResult.code) {
      //           Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
      //       }
      //     }
      // });
}

