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

    $(document).ready(function () {
        Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
        getLocation();

	     startPlayer($('#stream').val());

        $('#start').click(function () {
	         startPlayer($('#stream').val());         
        });
        $('#stop').click(function () {
            jwplayer('player').stop();            
        });
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

    function getLocation() {
        var lat = "??";
        var lon = "??";
        var locationObject = Parse.Object.extend("location");
        var locationQuery = new Parse.Query(locationObject);

        locationQuery.find( {
            success: function(results) {
                if (results.length == 0) {
                    // make new objects
                }
                else {
                    lat = results[0].get("lat");
                    lon = results[0].get("lon");
                }
                if (lat != "??") {
                    $("#location").append("Lat: " + lat);
                    $("#location").append("\nLon: " + lon);
                }
            }
        })

    }

}(jQuery));
