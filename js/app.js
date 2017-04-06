// an array of default locations
var defaultLocations = [
  {
    name: "Bellingham Farmers Market",
    address: "1100 Railroad Ave, Bellingham, WA 98225, USA"},
  {
    name: "Whatcom Falls Park",
    address: "1401 Electric Ave, Bellingham, WA 98229, USA"
  }
];

// not sure yet if these are needed.

var map;
var service;
var geocode;
// var markers = [];
var nightModeStyle = [];

// Initializes google map on page
function initMap() {
  var mapOptions = {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 13,
    // style: nightModeStyle
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  service = new google.maps.places.PlacesService(map);
  geocode = new google.maps.Geocoder();
};

var googleError = function() {
  console.log("no map");
  window.alert("Maps cannot load. Please check yo' situation!;")
};

// Function to make the items in the location array observable to be used in viewmodel.
var ViewLocations = function(data) {
  var self = this;
  this.name = data.name;
  this.address = data.address;
  this.makeMarker = ko.computed(function() {
    console.log('computed is recognized');
  }, this);

};


// MV for interacting with html.
function ViewModel() {
  var self = this;
  this.locationList = ko.observableArray([]);
  defaultLocations.forEach(function(i) {
    self.locationList.push( new ViewLocations(i) );
  });


};

$(document).ready(function() {
  var vm = new ViewModel();
  ko.applyBindings(vm);
});
