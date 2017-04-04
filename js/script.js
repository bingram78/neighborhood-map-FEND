/*
INACTIVE AT THE MOMENT
*/



/* MODELS */
// an array of default locations
var defaultLocations = [
  {
    "name": "Bellingham Farmers Market",
    "place": "ChIJj2gjZrmjhVQRoKgWwFF5mb8",
    "address": "1100 Railroad Ave, Bellingham, WA 98225, USA"},
  {
    "name": "Whatcom Falls Park",
    "place": "ChIJoTD3_AikhVQRaAMWHYS7fMY",
    "address": "1401 Electric Ave, Bellingham, WA 98229, USA"
  }
];

// an array of user input locations TODO: include user input later.
var userLocations = [];


// Initialize Google Map
var map;
var markers = [];
var nightModeMapStyle = [
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

var mapNightMode = null;

function initMap() {
  var mapOptions = {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 13,
    styles: mapNightMode
  };

  var bounds = new google.maps.LatLngBounds();
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var service = new google.maps.places.PlacesService(map);

  var infoWindow = new google.maps.InfoWindow();
  function bindInfoWindow(marker, map, infoWindow, html) {
    marker.addListener('click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, this);
    });
  };

  for (var i = 0; i < defaultLocations.length; i++) {
    var title = defaultLocations[i].name;
    var address = '<strong>' + defaultLocations[i].address + '</strong>';
    var places = defaultLocations[i].place;
    console.log(address);
// NOT WORKING! FIX THIS!
    service.getDetails({
      placeId: places
    }, function(place, status) {
        console.log(address);
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.log("this be crazy");
          }
          else {
            var marker = new google.maps.Marker( {
              map: map,
              title: title,
              position: place.geometry.location,
              animation: google.maps.Animation.DROP,
              content: address
            });
            bindInfoWindow(marker, map, infoWindow, address);
          }
      });
    };



  var viewModel = function() {
    var self = this;


  };

var vm = new viewModel();
  // Apply bindings for KO viewModel. Query the document?
  // $(document).ready(function() {
ko.applyBindings(vm);
  // });

}
