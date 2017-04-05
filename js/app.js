// an array of default locations
var defaultLocations = [
  {
    name: "Bellingham Farmers Market",
    place: "ChIJj2gjZrmjhVQRoKgWwFF5mb8",
    address: "1100 Railroad Ave, Bellingham, WA 98225, USA"},
  {
    name: "Whatcom Falls Park",
    place: "ChIJoTD3_AikhVQRaAMWHYS7fMY",
    address: "1401 Electric Ave, Bellingham, WA 98229, USA"
  }
];

// not sure yet if these two are needed.

var map;
// var markers = [];
var nightModeStyle = [];

// Initializes google map on page
function initMap() {
  var mapOptions = {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 13,
    // style: nightModeStyle
  };
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var placeServices = new google.maps.places.PlacesService(map);
};


// Function to make the items in the location array observable to be used in viewmodel.
var ViewLocations = function(data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.place = ko.observable(data.place);
};


// MV for interacting with html.
function ViewModel() {
  var self = this;
  this.locationList = ko.observableArray([]);
  defaultLocations.forEach(function(i) {
    self.locationList.push( new ViewLocations(i) );
  });


};

var vm = new ViewModel();
ko.applyBindings(vm);
