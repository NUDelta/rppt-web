Template.map.onCreated(function() {
    this.subscribe('locations', session);
});

Template.map.rendered = function () {
    let mapOptions = { zoom: 18 },
        map = new google.maps.Map(document.getElementById('map'), mapOptions),
        marker = new google.maps.Marker({ map: map });

    Locations.find().observeChanges({
        added: function(id, fields) {
            let position = new google.maps.LatLng(fields.lat, fields.lng);
            marker.setMap(null);
            marker = new google.maps.Marker({ map: map, position: position});
            map.setCenter(position);
        }
    });
};
