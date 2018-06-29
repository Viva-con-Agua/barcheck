app.controller('mapController', function($scope, $element, NgMap) {

	$scope.showNavigation(false);
	$scope.showMarkers = true;

	var available = false,
		gpsLatitude,
		gpsLongitude;

		if(navigator && navigator.geolocation) {
		navigator.geolocation.watchPosition(function(position) {
		console.log(position);
		available = true;
		gpsLatitude = position.coords.latitude;
		gpsLongitude = position.coords.longitude;
	}, function(error) {
		console.error('Error: ' + error);
	}, {
		enableHighAccuracy: true,
		maximumAge: 30000,
		timeout: 27000
	});
	}

	//burger menu
	angular
		.module('customSidenavDemo', ['ngMaterial'])
		.controller('AppCtrl', function($scope, $mdSidenav) {
			$scope.toggleRight = buildToggler('right');

			function buildToggler(componentId) {
				return function() {
					$mdSidenav(componentId).toggle();
				};
			}
		});

	// create an empty variable for the categories which will be selected
	var selectedCategories = [];

	$scope.initMarkerClusterer = function() {
		$scope.zoomLevel = 14;
		/*var markers = $scope.locatons.map(function (location) {
		    return $scope.createMarker(location);
		});*/
		var mcOptions = {
			imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'
		};
		$scope.markerCluster = new MarkerClusterer($scope.map, $scope.markers, mcOptions);
		$scope.initAllLocations();
	};

	// Default map with all locations
	$scope.initAllLocations = function() {
		var location = {};
		for (var i = 0; i < $scope.allLocations.length; i++) {
			location = $scope.allLocations[i];
			//only locations with water are shown
			if (location.WATER === 'X') {
				$scope.createMarker(location);
			}
		}

		if ($scope.markers.length !== 0) {
			$scope.markerCluster.addMarkers($scope.markers);
		}
	};

	// define the array of categories
	//	$scope.categories = [0, 1, 2, 3, 4, 5];
	$scope.categories = ['bar', 'club', 'café', 'restaurant', 'shop', 'other'];
	$scope.selected = ['bar'];

	$scope.searchTerm;
	$scope.clearSearchTerm = function() {
		$scope.searchTerm = '';
	};
	// The md-select directive eats keydown events for some quick select
	// logic. Since we have a search input here, we don't need that logic.
	$element.find('input').on('keydown', function(ev) {
		ev.stopPropagation();
	});

	$scope.showMarkers = true;

	$scope.filterChanged = function(category) {
		var idx = selectedCategories.indexOf(category);
		console.log(idx);
		if (idx > -1) {
			selectedCategories.splice(idx, 1);
		} else {
			selectedCategories.push(category);
		}

		$scope.markerCluster.clearMarkers();

		$scope.markers = [];

		var location = {};
		for (var i = 0; i < selectedCategories.length; i++) {
			// selectedCategory = selectedCategories[i];
			var selectedCategory = $scope.categories.indexOf(selectedCategories[i]);
			console.log(selectedCategory);
			for (var j = 0; j < $scope.allLocations.length; j++) {
				location = $scope.allLocations[j];
				//only locations with water are shown
				if (location.CATEGORYID === selectedCategory &&
					location.WATER === 'X') {
					$scope.createMarker(location);
				}
			}
		}
		if ($scope.markers.length !== 0) {
			$scope.markerCluster.addMarkers($scope.markers);
		}
	};

	$scope.createMarker = function(location, filter) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(location.LATITUDE, location.LONGITUDE),
			title: location.NAME,
			icon: {
				url: '/sources/img/icons/dropgmarkerblue.png',
				scaledSize: new google.maps.Size(42, 68)
			}
		});

		google.maps.event.addListener(marker, 'click', function() {
			$scope.selectedLocation = location;
			$scope.map.showInfoWindow('myInfoWindow', this);
		});
		$scope.markers.push(marker);
	};

	NgMap.getMap().then(function(map) {

		/* NOTE: This fix determines the position (or sets default) first and then assigns
				 map to $scope.map
				
				 The position is handed over to the ngMap 'center' property through
				 $scope.latitude and $scope.longitude
		*/

		function getMarkers() {
			$.ajax({
				type: "GET",
				url: "/destinations/vca/VivaConAgua/location.xsodata/Location",
				cache: false,
				dataType: "json",
				error: function(msg, textStatus) {
					console.log(textStatus);
				},
				success: function(data) {
					$scope.$apply(function() {
						$scope.allLocations = data.d.results;
						$scope.markers = [];
						$scope.initMarkerClusterer();
					});
				}
			});
		}
		$scope.position2 = function() {
			if (navigator && navigator.geolocation && available === true) {
				map.setZoom(14);
				$scope.latitude = gpsLatitude;
				$scope.longitude = gpsLongitude;

			}
		};

		function showPosition(position) {
			// standard geolocation successHandler
			$scope.longitude = position.coords.longitude;
			$scope.latitude = position.coords.latitude;
			// assign the map after determining the position
			$scope.map = map;
			// at the end load markers
			getMarkers();
		}

		//function for search box 
		$scope.placeMarker = function() {
			var place = this.getPlace(); //get selected place 
			console.log(this.getPlace());
			var loc = this.getPlace().geometry.location;
			$scope.latlng = [loc.lat(), loc.lng()];
			$scope.center = [loc.lat(), loc.lng()];
			if (this.getPlace().types.indexOf("establishment") > -1) {
				// establishment --> higher zoom
				map.setZoom(17);
			} else if (this.getPlace().types.indexOf("route") > -1) {
				// route --> higher zoom
				map.setZoom(15);
			} else if (this.getPlace().types.indexOf("sublocality") > -1) {
				// sublocality --> higher zoom
				map.setZoom(15);
			} else {
				// geocode --> less zoom
				map.setZoom(10);
			}
			$scope.longitude = loc.lng();
			$scope.latitude = loc.lat();
		};

		function errorHandler() {
			// set position to Hamburg
			// $scope.longitude = 9.993682;
			// $scope.latitude = 53.551085;

			// set position to Munich
			$scope.longitude = 11.581981;
			$scope.latitude = 48.135125;

			// then assign map
			$scope.map = map;
			// and get markers
			getMarkers();
			// following should be replaced with UI information
			console.log("Error");
		}

		$scope.dragEnd = function() {
			$scope.latitude = $scope.map.getCenter().lat();
			$scope.longitude = $scope.map.getCenter().lng();
		};

		$scope.centerChange = function() {
			$scope.latitude = $scope.map.getCenter().lat();
			$scope.longitude = $scope.map.getCenter().lng();
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, errorHandler);
			// function gets following parameters: getCurrentPosition(successHandler, errorHandler)
		} else {
			errorHandler(); // call the errorHandler too in case the browser doesn't support native GeoLocation
		}

	});

});