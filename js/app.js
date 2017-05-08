
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

// Initialize map and apply KO bindings from ViewModel. Called by maps api callback.
function initMap() {
  var mapOptions = {
    center: {lat: 48.7435276, lng: -122.4856877},
    zoom: 13,
    styles: nightModeStyle
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow();

  var vm = new ViewModel();
  ko.applyBindings(vm);
  };


// This makes each default location.
var ViewLocations = function(loc) {
  var self = this;
  this.name = loc.name;
  this.address = loc.address;
  var infoWindowContent;
  // Creates markers for each location binds infowindow information with each one
  // TODO: create error for infowindow, setTimeouts and Animations.
  geocoder.geocode({'address':this.address}, function(results, status) {
    if (status === 'OK') {
      self.geolocation = results[0].geometry.location
      //TODO: create the address from the geocoded results. Will require refactoring.
      // console.log(results[0].formatted_address);
      self.markerOptions = {
        map: map,
        position: self.geolocation,
        animation: google.maps.Animation.DROP
      }
      self.marker = new google.maps.Marker(self.markerOptions);
      self.isVisible = ko.observable(false);
      self.isVisible.subscribe(function(visible) {
        if (visible) {
          self.marker.setMap(map);
        } else {
          self.marker.setMap(null);
        }
      });
      self.isVisible(true);

      // Setup infoWindow information and bind it below with marker as generated.
      // Ajax request for the Flickr results of location.

      var flickrPhotos = function(place) {
        var flickrRest = "https://api.flickr.com/services/rest/?";
        var flickrMethod = "method=flickr.photos.search&";
        var flickrApiKey = "api_key=f21a10d1ea16e861d19731ef5b7c6681&";
        var flickrText = "text=";
        var flickrSearch = place;
        var flickrSearchParams = "&per_page=5&format=json&nojsoncallback=1"
        var flickrFullUrl = flickrRest+flickrMethod+flickrApiKey+flickrText+flickrSearch+flickrSearchParams;
        // console.log(flickrFullUrl);
        flickrAjaxRequest = $.ajax({
          url: flickrFullUrl,
          type: 'get',
          dataType: 'json',
        });
        flickrAjaxRequest.done(function (data) {
          var flickrImageID = data.photos.photo[2].id;
          var flickrServerID = data.photos.photo[2].server;
          var flickrFarmID = data.photos.photo[2].farm;
          var flickrSecret = data.photos.photo[2].secret;
          var flickrResults = "https://farm" + flickrFarmID + ".staticflickr.com/"
                                + flickrServerID + "/" + flickrImageID + "_" + flickrSecret + "_m.jpg";
          var fullImageTag = "<img src='" + flickrResults + "' alt='image from flickr'>";
          // console.log(fullImageTag);

          self.infoWindowContent = '<strong>' + self.name + '</strong><br>'
                                  + self.address + '<br>' + fullImageTag;
          self.marker.addListener('click', function() {
            infoWindow.setContent(self.infoWindowContent);
            infoWindow.open(map, this);
          });
          self.location = marker;

          markers.push(self.marker);
        }).fail(function (data) {
          window.alert("flickr has failed");
        });
      };
      flickrPhotos(self.name);
    }
    else {
      alert('Geocode was not successful because:' + status);
    }
  });

  // function for applying click binding in the list view.
  this.listClickWindow = function() {
    infoWindow.setContent(self.infoWindowContent);
    infoWindow.open(map, self.marker);
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

  //TODO: search list and show results.
  this.search = ko.observable("");
  this.searchResults = ko.computed(function() {
    var s = self.search().toLowerCase();
    if (s){
      return ko.utils.arrayFilter(self.locationList(), function(i) {
        var match = i.name.toLowerCase().indexOf(s) >= 0;
        i.isVisible(match);
        return match;
        })
    } else {
      return self.locationList()
    }

  });



};
