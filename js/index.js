(function ($) {
    "use strict";

    var data = [];

    var messageHistory = [];
    var map = 1234;

    for(var i=0; i<10; i++) {
        messageHistory.push("");
    }

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
        setInterval(function() {getLocation();}, 5000);
        initMessage();

        startPlayer($('#stream').val());

        $('#start').click(function () {
             startPlayer($('#stream').val());         
        });
        $('#stop').click(function () {
            jwplayer('player').stop();            
        });
        $('#submit').click(function() {
            changeMessage($('#message').val());
        })
        $('#message').keypress(function (e) {
            if (e.which == 13) {
                changeMessage($('#message').val());
            }
        })
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

    function initMessage() {
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
                message.set("msg", "Connected.");
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

    function changeMessage(word) {
        messageHistory.shift();
        var word;
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
                messageHistory.push("<strong> You said: </strong> " +word);
                updateMessageHistory();
            },
            error: function(error) {
                console.log("found nothing");
            }
        });
    }

    function updateMessageHistory() {
        $('#history').empty();
        for(var i=0; i<10; i++) {
            $('#history').append(messageHistory[i] + " <br/>")
        }
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
                    var loc = new google.maps.LatLng(lat, lon);
                    if (map == 1234) {
                        initMap(loc);
                    }
                    map.setCenter(loc);
                    console.log(lat);
                    console.log(lon);
                }
            }
        })
    }

    function initMap(loc) {
        var mapOptions = {
            zoom: 18,
            center: loc
          }

        map = new google.maps.Map(document.getElementById('location'), mapOptions);
    }


}(jQuery));


    // function initLocation() {
    //     var locationObject = Parse.Object.extend("location");
    //     var location = new locationObject;

    //     location.set("lat", 40);
    //     location.set("long", 50);

    //     location.save();
    // }
