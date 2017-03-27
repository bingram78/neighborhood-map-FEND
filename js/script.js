/*
Neighborhood Map project FEND
*/



/* MODELS */
// an array of default locations
var defaultLocations = [];

// an array of user input locations TODO: include user input later.
var userLocations = [];




// Initialize Google Map
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 13
  });
}
