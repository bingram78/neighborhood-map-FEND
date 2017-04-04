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
  var placeService = new google.maps.places.PlacesService(map);

  var bindInfoWindow = function(marker, address) {
    var infoWindow = new google.maps.InfoWindow( {
      content: address
    });
    marker.addListener('click', function() {
      infoWindow.open(marker.get('map'), marker);
    });
  };

  var createMarker = function(loc, pos) {
    var marker = new google.maps.Marker( {
      map: map,
      title: title,
      position: pos,
      animation: google.maps.Animation.Drop,
      content: address
    })
    bindInfoWindow(marker, address);
  };

  for (var i = 0; i < defaultLocations.length; i++) {
    var title = defaultLocations[i].name;
    var address = '<strong>' + defaultLocations[i].address + '</strong>';
    var places = defaultLocations[i].place;
    placeService.getDetails({
      placeId: places
    }, function(place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.log("this wrong");
        }
      else {
        var pos = place.geometry.location;
        createMarker(i, pos);
      }
    });
  }

};

var ViewLocations = function(data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.place = ko.observable(data.place);
};




function viewModel() {
  var self = this;
  // var name = ko.observable();
  // self.name = "blake"
  // self.view = function locationViewer(name) {
  //   console.log('hi');
  // };
  this.locationList = ko.observableArray([]);
  defaultLocations.forEach(function(i) {
    self.locationList.push( new ViewLocations(i) );
  });

};


ko.applyBindings(new viewModel());
