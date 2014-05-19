var data = [];

// Outputs some logs about jwplayer
function print(t,obj) {
    for (var a in obj) {
        if (typeof obj[a] === "object") print(t+'.'+a,obj[a]);
        else data[t+'.'+a] = obj[a];
    }
}

$(document).ready(function () {

    var streamAddress = $('#stream').val();
    // var streamAddress = "rtmp://glass.ci.northwestern.edu/live/test.sdp";

    // Player Logic
     startPlayer(streamAddress);

    $('#start').click(function () {
         startPlayer(streamAddress);         
    });
    $('#stop').click(function () {
        jwplayer('player').stop();            
    });


    // // Microphone
    // navigator.getUserMedia({audio:true}, function(stream) {
    //   console.log("Got it.");
    // }, function(e) {
    //         alert('Error getting audio');
    //         console.log(e);
    //     });

    // Parse Logic
    Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
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

function changeMessage() {
    var word = $("#message").val();
    var messageObject = Parse.Object.extend("message");
    var messageQuery = new Parse.Query(messageObject);

    messageQuery.find({
        success: function(results) {
            console.log("found something");
            if (results.length == 0) {
                var message = new messageObject();
                console.log("making new object");
            }
            else {
                var message = results[0]
                console.log("overwritting time");
            }
            console.log(word)
            message.set("msg", word);
            message.save(null, {
                success: function(results) {
                    console.log("nice job!");
                },
                error: function(results) {
                    console.log("sad face");
                }
            })
        },
        error: function(error) {
            console.log("found nothing");
        }
    });
}