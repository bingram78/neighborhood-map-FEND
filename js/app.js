

// Array of default locations
var defaultLocations = [
  {
    name: "Bellingham Farmers Market",
    address: "1100 Railroad Ave, Bellingham, WA 98225, USA"},
  {
    name: "Whatcom Falls Park",
    address: "1401 Electric Ave, Bellingham, WA 98229, USA"
  },
  {
    name: "SPARK Museum of Electrical Invention",
    address: "1312 Bay St, Bellingham, WA 98225, USA"
  }
];

// Set global variables.
var map;
var geocode;
var infoWindow;
var marker;
var markers = [];

var service;

var nightModeStyle = [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ];

function initMap() {
  var mapOptions = {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 13,
    styles: nightModeStyle
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  geocoder = new google.maps.Geocoder();


// This makes each default location. TODO: infoWindow.
  var ViewLocations = function(loc) {
    var that = this;
    this.name = loc.name;
    this.address = loc.address;

    // Setup infoWindow information and bind it below with marker as generated.
    infoWindow = new google.maps.InfoWindow();
    var infoWindowContent = '<strong>' + that.name + '</strong><br>' + this.address;
    var bindInfoWindow = function(marker, map, infoWindow, html) {
      marker.addListener('click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      })
    }

    // Creates markers for each location binds infowindow information with each one
    // TODO: create error for infowindow, setTimeouts and Animations.
    this.marker = geocoder.geocode({'address':this.address}, function(results, status) {
      if (status === 'OK') {
        var geolocation = results[0].geometry.location
        var markerOptions = {
          map: map,
          position: geolocation,
          animation: google.maps.Animation.DROP
        }
        marker = new google.maps.Marker(markerOptions);
        markers.push(marker);
        bindInfoWindow(marker, map, infoWindow, infoWindowContent);
      }
      else {
        alert('Geocode was not successful because:' + status);
      }
    });

  };
// TODO: figure out the list click bindings for the html and connect markers to it.
  function ViewModel() {
    var self = this;
    // Creates observables and arrays.
    this.locationList = ko.observableArray([]);
    defaultLocations.forEach(function(i) {
      var locations = new ViewLocations(i);
      self.locationList.push(locations);
      });

  };

  // Displays error alert box that Maps could not load.
  // Called from google api script loading in HTML file.
  var googleError = function() {
    window.alert("Maps cannot load. Please check yo' situation!");
  };


  var vm = new ViewModel();
  ko.applyBindings(vm);

};


// MV for interacting with html.
