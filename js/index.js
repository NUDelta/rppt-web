(function ($) {
    "use strict";

    var data = [];
    var prev_lat=0;
    var prev_lon=0;

    // Outputs some logs about jwplayer
    function print(t,obj) {
        for (var a in obj) {
            if (typeof obj[a] === "object") print(t+'.'+a,obj[a]);
            else data[t+'.'+a] = obj[a];
        }
    }

    $(document).ready(function () {
        Parse.initialize("3dgBmw9ZzGVprNrdoNuQZ4TgmWzjkc8rc5HT3quP", "zFyHtXjR0PTbeqCNgSVMJgiMndBWVEi4Qu8F1I1y");
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
                    renderMap(lat, lon);
                    console.log(lat);
                    console.log(lon);
                }
            }
        })

    }

    function renderMap(lat, lon) {

        var dist = measure(lat, lon, prev_lat, prev_lon);

        if (dist > 25) {
            var loc = new google.maps.LatLng(lat, lon);
            var mapOptions = {
                zoom: 18,
                center: loc
              }

            var map = new google.maps.Map(document.getElementById('location'), mapOptions);
            prev_lat = lat;
            prev_lon = lon;

        }
        else {
            console.log("no update made.");
        }

    }

    function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000; // meters
    }


}(jQuery));


    // function initLocation() {
    //     var locationObject = Parse.Object.extend("location");
    //     var location = new locationObject;

    //     location.set("lat", 40);
    //     location.set("long", 50);

    //     location.save();
    // }
