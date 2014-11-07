Template.map.rendered = function () {
    setInterval(function() { getLocation(); }, 5000); // figure out a better way? (SOCKETS)
};

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
                if (map == null) {
                    initMap(loc);
                }
                map.setCenter(loc);
                // console.log(lat);
                // console.log(lon);
            }
        }
    })
}

function initMap(loc) {
    var mapOptions = {
        zoom: 18,
        center: loc
      }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}