
// Array of default locations
var defaultLocations = [
  {
    name: "Bellingham Farmers Market",
    address: "1100 Railroad Ave, Bellingham, WA 98225, USA",
    image: ""
  },
  {
    name: "Whatcom Falls Park",
    address: "1401 Electric Ave, Bellingham, WA 98229, USA",
    image: ""

  },
  {
    name: "SPARK Museum of Electrical Invention",
    address: "1312 Bay St, Bellingham, WA 98225, USA",
    image: ""

  }
];

// Set global variables.
var map;
var geocode;
var infoWindow;
var marker;
var markers = [];

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

// Displays error alert box that Maps could not load.
// Called from google api script loading in HTML file.
var googleError = function() {
  window.alert("Maps cannot load. Please check yo' situation!");
};

// Ajax request for the Flickr results of location.

var flickrPhotos = function(place) {
  var flickrBaseUrl = "https://api.flickr.com/services/rest/?";
  var flickrMethod = "method=flickr.photos.search&";
  var flickrApiKey = "api_key=f21a10d1ea16e861d19731ef5b7c6681&";
  var flickrText = "text=";
  var flickrSearch = place;
  var flickrSearchParams = "&per_page=5&format=json&nojsoncallback=1"
  var flickrFullUrl = flickrBaseUrl+flickrMethod+flickrApiKey+flickrText+flickrSearch+flickrSearchParams;
  var flickrAjaxRequest = $.ajax({
    url: flickrFullUrl,
    type: 'get',
    dataType: 'json',
  });
  flickrAjaxRequest.done(function (data) {
    var flickrImageID = data.photos.photo[0].id;
    var flickrServerID = data.photos.photo[0].server;
    var flickrFarmID = data.photos.photo[0].farm;
    var flickrSecret = data.photos.photo[0].secret;
    var flickrResults = "https://farm" + flickrFarmID + ".staticflickr.com/"
                          + flickrServerID + "/" + flickrImageID + "_" + flickrSecret + "_m.jpg";
    var fullImageTag = "<img src='" + flickrResults + "' alt='image from flickr'>";
    console.log(fullImageTag);
    return fullImageTag;
  }).fail(function (data) {
    window.alert("flickr has failed");
  });
};

function initMap() {
  var mapOptions = {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 13,
    styles: nightModeStyle
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  geocoder = new google.maps.Geocoder();

  var vm = new ViewModel();
  ko.applyBindings(vm);
  };


// This makes each default location. TODO: infoWindow.
var ViewLocations = function(loc) {
  var that = this;
  this.name = loc.name;
  this.address = loc.address;

  // Setup infoWindow information and bind it below with marker as generated.
  // TODO: Call the FlickrPhotos function to retrieve image tag to apply to infoWindow.
  this.image = flickrPhotos(loc.name);
  // Need to get data from image request into infoWindowContent below.
  var infoWindowContent = '<strong>' + that.name + '</strong><br>'
                          + that.address + '<br>';
  infoWindow = new google.maps.InfoWindow();

  // Creates markers for each location binds infowindow information with each one
  // TODO: create error for infowindow, setTimeouts and Animations.
  geocoder.geocode({'address':this.address}, function(results, status) {
    if (status === 'OK') {
      var geolocation = results[0].geometry.location
      //TODO: create the address from the geocoded results. Will require refactoring.
      // console.log(results[0].formatted_address);
      var markerOptions = {
        map: map,
        position: geolocation,
        animation: google.maps.Animation.DROP
      }
      marker = new google.maps.Marker(markerOptions);
      markers.push(marker);
      marker.addListener('click', function() {
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, this);
      })
      that.location = marker;
    }
    else {
      alert('Geocode was not successful because:' + status);
    }
  });
  // function for applying click binding in the list view.
  this.showMarker = function() {
    infoWindow.setContent(infoWindowContent);
    infoWindow.open(map, that.location);
  };
};

function ViewModel() {
  var self = this;
  // Creates observables and arrays.
  this.locationList = ko.observableArray([]);
  defaultLocations.forEach(function(i) {
    var locations = new ViewLocations(i);
    self.locationList.push(locations);
  });
};
