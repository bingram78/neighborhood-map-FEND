/* ---------------------------------------------
  Neighborhood Map Project - UDACITY FEND
    Bellingham, WA Sites
  by: Blake Ingram
---------------------------------------------*/

// Array of initial default locations
var defaultLocations = [
  {
    name: "Bellingham Farmers Market",
    address: "1100 Railroad Ave, Bellingham, WA 98225, USA"
  },
  {
    name: "Whatcom Falls Park",
    address: "1401 Electric Ave, Bellingham, WA 98229, USA"
  },
  {
    name: "SPARK Museum of Electrical Invention",
    address: "1312 Bay St, Bellingham, WA 98225, USA"
  },
  {
    name: "Sehome Hill Arboretum",
    address: "600 25th Street, Bellingham, WA 98225"
  },
  {
    name: "Mount Baker Theatre",
    address: "104 N Commercial St, Bellingham, WA 98225"
  },
  {
    name: "Boundary Bay Brewery & Bistro",
    address: "1107 Railroad Ave, Bellingham, WA 98225"
  },
  {
    name: "San Juan Cruises",
    address: "355 Harris Ave #104, Bellingham, WA 98225"
  },
  {
    name: "Zuanich Point Park",
    address: "2600 N Harbor Loop Dr, Bellingham, WA 98225"
  }
];

// Set global variables.
var map;
var geocode;
var infoWindow;
var marker;

// Map night mode stylings.
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
function googleError() {
  window.alert("Maps cannot load. Please check yo' situation!");
}

/* --------------------------------
Initialize map and apply KO bindings from ViewModel.
Called by maps api callback.
--------------------------------*/
function initMap() {
  var mapOptions = {
    center: {lat: 48.749738, lng: -122.471724},
    zoom: 12,
    styles: nightModeStyle
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow();

  var vm = new ViewModel();
  ko.applyBindings(vm);
  }

/* -----------------------------------
The function below builds each location in the viewModel, geocodes it on
the map, sets its location marker, and populates the infoWindow with
images from Flickr api request.
----------------------------------- */
var ViewLocations = function(loc) {
  var self = this;
  self.name = loc.name;
  self.address = loc.address;
  var infoWindowContent;

  // Creates markers for each location binds infowindow information with each.
  geocoder.geocode({'address':this.address}, function(results, status) {
    if (status === 'OK') {
      self.geolocation = results[0].geometry.location;
      self.markerOptions = {
        map: map,
        position: self.geolocation,
        animation: google.maps.Animation.DROP
      };
      // Create marker.
      self.marker = new google.maps.Marker(self.markerOptions);

      /* -----------------------------------
      Flickr API ajax request. Poplulates infoWindow when request is done
      or when it fails. Infowindow has event listeners added here.
      ----------------------------------- */
      var flickrPhotos = function(place) {
        var flickrRest = "https://api.flickr.com/services/rest/?";
        var flickrMethod = "method=flickr.photos.search&";
        var flickrApiKey = "api_key=f21a10d1ea16e861d19731ef5b7c6681&";
        var flickrText = "text=";
        var flickrSearch = place;
        var flickrSearchParams = "&per_page=5&format=json&nojsoncallback=1";
        var flickrFullUrl = flickrRest+flickrMethod+flickrApiKey+flickrText+flickrSearch+flickrSearchParams;
        flickrAjaxRequest = $.ajax({
          url: flickrFullUrl,
          type: 'get',
          dataType: 'json',
        });
        flickrAjaxRequest.done(function (data) {
          if (data.photos) {
            // Successful flickr request and infoWindow created.
            var flickrImageID = data.photos.photo[1].id;
            var flickrServerID = data.photos.photo[1].server;
            var flickrFarmID = data.photos.photo[1].farm;
            var flickrSecret = data.photos.photo[1].secret;
            var flickrResults = "https://farm" + flickrFarmID + ".staticflickr.com/"+
                								flickrServerID + "/" + flickrImageID + "_" + flickrSecret + "_m.jpg";
            var fullImageTag = "<img src='" + flickrResults + "' alt='image from flickr'>";
            self.infoWindowContent = '<strong>' + self.name + '</strong><br>' +
              												self.address + '<br>' + fullImageTag +'<br>Image obtained from Flickr API';
            self.marker.addListener('click', function() {
              infoWindow.setContent(self.infoWindowContent);
              infoWindow.open(map, this);
              self.marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function() {self.marker.setAnimation(null); }, 2100);
            });
          } else if (data.stat == 'fail') {
            // Flickr request send back failed status and infoWindow created.
            var flickrFail = "<br><br><p>Sorry, this Flickr image will not load.</p>";
            self.infoWindowContent = '<strong>' + self.name + '</strong><br>' +
              												self.address + '<br>' + flickrFail;
            self.marker.addListener('click', function() {
              infoWindow.setContent(self.infoWindowContent);
              infoWindow.open(map, this);
              self.marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function() {self.marker.setAnimation(null); }, 2100);
            });
          }
        }).fail(function () {
          // Flickr request fails completely and no infoWindows created.
          window.alert("Sorry but Flickr requests have failed. Try again later.");
        });
      };
      flickrPhotos(self.name);
    }
    else {
      // Error handling for geocoding failed response.
      window.alert('Geocode was not successful because:' + status);
    }
  });

  // Function for applying click binding in the list view.
  self.listClickWindow = function() {
    infoWindow.setContent(self.infoWindowContent);
    infoWindow.open(map, self.marker);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {self.marker.setAnimation(null); }, 2100);
  };
};

/* -----------------------------------
Function that creates the view model for the app. Location array is bound to
knockoutJS observable. Filter search function allows locations to be shown
or hidden based on search input. List and map markers update accordingly.
----------------------------------- */
function ViewModel() {
  var self = this;
  // Creates observables and arrays.
  self.locationList = ko.observableArray([]);
  defaultLocations.forEach(function(i) {
    var locations = new ViewLocations(i);
    self.locationList.push(locations);
  });

  // Thanks to Sarah and Karol for the help with this search function.
  // Creates the search function to return matching list items and markers.
  self.search = ko.observable("");
  self.searchResults = ko.computed(function() {
    var s = self.search().toLowerCase();
    if (s) {
      return ko.utils.arrayFilter(self.locationList(), function(place) {
        var match = place.name.toLowerCase().indexOf(s) >= 0;
        place.marker.setVisible(match);
        return match;
        });
    }
    else {
      self.locationList().forEach(function(location) {
        if (location.marker) {
          location.marker.setVisible(true);
        }
      });
      return self.locationList();
    }
  });
}
