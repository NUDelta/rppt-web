(function ($) {
    "use strict";

    var data = [];

    // Outputs some logs about jwplayer
    function print(t,obj) {
        for (var a in obj) {
            if (typeof obj[a] === "object") print(t+'.'+a,obj[a]);
            else data[t+'.'+a] = obj[a];
        }
    }

    function hasGetUserMedia() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    $(document).ready(function () {

        // Player Logic
	     startPlayer($('#stream').val());

        $('#start').click(function () {
	         startPlayer($('#stream').val());         
        });
        $('#stop').click(function () {
            jwplayer('player').stop();            
        });


        // Microphone
        if (hasGetUserMedia()) {
            $('#status').append("YES").show();
        }
        else {
            // do error stuff
            $('#status').append("Microphone not supported.").show();
        }

        navigator.getUserMedia = ( navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia);
        navigator.getUserMedia (

           // constraints
           {
              video: true,
              audio: true
           },

           // successCallback
           function(localMediaStream) {
              var video = document.querySelector('video');
              video.src = window.URL.createObjectURL(localMediaStream);
              video.onloadedmetadata = function(e) {
                 // Do something with the video here.
              };
           },

           // errorCallback
           function(err) {
            console.log("The following error occured: " + err);
           }

        );
    });



    // Starts the flash player
    function startPlayer(stream) {

        jwplayer('player').setup({
            height: 480,
            width: 640,
   	      sources: [{
                file: stream
            }],
            rtmp: {
                bufferlength: 3
            }
        });

	     jwplayer("player").onMeta( function(event){
            var info = "";
            for (var key in data) {
                info += key + " = " + data[key] + "<BR>";
            }
            document.getElementById("status").innerHTML = info;

            print("event",event);

        });

        jwplayer('player').play();

    }

}(jQuery));
