/*
Neighborhood Map project FEND
*/

// Initialize Google Map
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 12
  });
}
