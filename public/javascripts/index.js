var feedback = require('./feedback.js');
feedback[0].fn();

feedback[1].fn();

feedback[2].fn();

feedback[3].fn();

// cis map

var cloudmadeUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
    subDomains = ['otile1', 'otile2', 'otile3', 'otile4'],
    cloudmadeAttrib = '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, and <a href="http://www.openstreetmap.org/" target="_blank">OSM</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
//bounds = new L.LatLngBounds(new L.LatLng(11, 76), new L.LatLng(12, 77));
var cloudmade = new L.TileLayer(cloudmadeUrl, {
    maxZoom: 18,
    attribution: cloudmadeAttrib,
    subdomains: subDomains
});


var map = new L.Map('map', {
    //center: bounds.getCenter(),
    zoom: 15,
    layers: [cloudmade],
    //maxBounds: bounds
});

var venue = new L.LatLng(12.9647, 77.6375); // geographical point (longitude and latitude)
map.setView(venue, 15).addLayer(cloudmade);

var venue_marker = new L.Marker(venue);
map.addLayer(venue_marker);
venue_marker.bindPopup('The Center for Internet and Society').openPopup();

