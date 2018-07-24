app.controller('mapController', function($scope, $element, NgMap) {

	$scope.showNavigation(false);
	$scope.showMarkers = true;

	var available = false,
		mapLoaded = false,
		gpsLatitude,
		gpsLongitude,
		myLocation,
		nearLocations = [],
		counter = 0,
		service;

	var thisPlace;

	/* 
	process the results from details request 
	*/
	function detailCallback(detailPlace, status) {
		console.log("detail information with opening hours");
		console.log(detailPlace);

		var d = new Date();
		var today = d.getDay();

		if (today === 0) { //on sundays the index is 0. If you subtract one, the value in the array is undefined. 
			today = 7;
		}

		if (typeof detailPlace.opening_hours === "undefined") {
			thisPlace.opening_hours = "there are no opening hours";
		} else {
			thisPlace.opening_hours = detailPlace.opening_hours.weekday_text[today - 1]; //indices of days are different to the indices of google maps  --> -1
		}
		thisPlace.formatted_address = detailPlace.formatted_address;
		//loading animation disappears
		thisPlace.loading = false;
		console.log("tab closed");
		$scope.$apply();
	}

	/*
	open details for location 
	*/
	$scope.toggleItem = function(place) {

		for (var i = 0; i < $scope.allPlaces.length; i++) {
			if (i !== $scope.allPlaces.indexOf(place)) {
				$scope.allPlaces[i].toggle = false; //all tabs are closed
			}
		}
		//click on location
		if (!place.toggle) { // invisible to visible
			var request = {
				placeId: place.place_id,
				fields: ['opening_hours', 'id', 'formatted_address'] //requested fields (https://developers.google.com/maps/documentation/javascript/places)
			};
			thisPlace = place;
			//loading animation
			place.loading = true;
			console.log("tab opened");
			service.getDetails(request, detailCallback);
			console.log("details requested");
		}
		place.toggle = !place.toggle;
	};

	//find current position
	if (navigator && navigator.geolocation) {
		var watchId = navigator.geolocation.watchPosition(function(position) {
			console.log(position);
			available = true;
			gpsLatitude = position.coords.latitude;
			gpsLongitude = position.coords.longitude;

			// if (position.coords.accuracy <= 100) {
			// 	navigator.geolocation.clearWatch(watchId); //stop watcher
			// }

			//GPS for Autocomplete search
			$scope.bounds = {
				center: {
					lat: gpsLatitude,
					lng: gpsLongitude
				},
				radius: 5000
			};
		}, function(error) {
			console.error('Error: ' + error);
		}, {
			enableHighAccuracy: true, //GPS sensor on mobile phones  
			maximumAge: 30000,
			timeout: 27000
		});
	}
	//burger menu
	// angular
	// 	.module('customSidenavDemo', ['ngMaterial'])
	// 	.controller('AppCtrl', function($scope, $mdSidenav) {
	// 		$scope.toggleRight = buildToggler('right');

	// 		function buildToggler(componentId) {
	// 			return function() {
	// 				$mdSidenav(componentId).toggle();
	// 			};
	// 		}
	// 	});

	// create an empty variable for the categories which will be selected
	var selectedCategories = [];

	$scope.swipedUp = false;

	//trigger swipe up
	/*	$scope.onSwipeUp = function() {
			$scope.swipedUp = true;
			console.log('Swipe Up');
		};
		
		//trigger swipe down
		$scope.onSwipeDown = function() {
			$scope.swipedUp = false;
			console.log('Swipe Down');
		};*/

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
		mapLoaded = true;

		//process the results of nearby search
		var processResults = function(result, status, pagination) {
			//one array for all categories
			nearLocations = nearLocations.concat(result);
			counter++;
			console.log('NearbySearch');
			console.log(result);

			//received results of all requests 
			if (counter == 3) {
				console.log("all requests are concatenated in one array");
				var idLocations = [],
					distinctNearLocations = [];
				var theLocation;
				for (var i = 0; i < nearLocations.length; i++) {
					// delete duplicates
					if (idLocations.indexOf(nearLocations[i].id) === -1) {
						theLocation = nearLocations[i];
						idLocations[i] = theLocation.id;
						//getting the distance 
						theLocation.dLocation = Math.abs((gpsLatitude - theLocation.geometry.location.lat())) + Math.abs((gpsLongitude -
							theLocation.geometry.location.lng()));

						for (var j = 0; j < $scope.allLocations.length; j++) {
							//check if location is in the database
							if ($scope.allLocations[j].PLACE_ID === theLocation.place_id) {
								theLocation.water = true;

								//check which bundle type is available 
								if ($scope.allLocations[j].GLAS_330 == "X") {
									theLocation.GLAS330 = "Glas 330ml";
								}
								if ($scope.allLocations[j].PET_500 == "X") {
									theLocation.PET500 = "PET 500ml";
								}
								if ($scope.allLocations[j].GLAS_750 == "X") {
									theLocation.GLAS750 = "Glas 750ml";
								}
								if ($scope.allLocations[j].PET_1000 == "X") {
									theLocation.PET1000 = "PET 1000ml";
								}
								if ($scope.allLocations[j].TRIO_750 == "X") {
									theLocation.TRIO750 = "Trio 750ml";
								}
								if ($scope.allLocations[j].PET_750 == "X") {
									theLocation.PET750 = "PET 750ml";
								}
								// TODO: add other attributes from database
								break;
							}
						}
						distinctNearLocations.push(theLocation);
					}
				}
				nearLocations = distinctNearLocations;
				// order by distance
				nearLocations.sort(function(a, b) {
					return a.dLocation - b.dLocation;
				});
				console.log("nearby locations ordered by distance");
				$scope.allPlaces = nearLocations;
				console.log(nearLocations);
			}
		};

		//nearby search for categories: bar, cafe, restaurant
		//https://developers.google.com/maps/documentation/javascript/places
		var triggerNearbySearch = function() {
			if (mapLoaded && gpsLatitude && gpsLongitude) {
				service = new google.maps.places.PlacesService(map);
				myLocation = {
					lat: gpsLatitude,
					lng: gpsLongitude
				};
				service.nearbySearch({
					location: myLocation,
					rankBy: google.maps.places.RankBy.DISTANCE,
					types: ['bar']
				}, processResults);
				service.nearbySearch({
					location: myLocation,
					rankBy: google.maps.places.RankBy.DISTANCE,
					types: ['cafe']
				}, processResults);
				service.nearbySearch({
					location: myLocation,
					rankBy: google.maps.places.RankBy.DISTANCE,
					types: ['restaurant']
				}, processResults);
			}
			console.log("nearby locations requested");
		};

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
						triggerNearbySearch();
					});
				}
			});
		}

		//function for the button to show own position on the map 
		$scope.position2 = function() {
			console.log("show own position");
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
			//		$scope.latlng = [loc.lat(), loc.lng()];
			//		$scope.center = [loc.lat(), loc.lng()];
			//different zoom levels for different type
			//zoom level defined by Google
			if (this.getPlace().types.indexOf("establishment") > -1) {
				map.setZoom(17);
			} else if (this.getPlace().types.indexOf("route") > -1) {
				map.setZoom(15);
			} else if (this.getPlace().types.indexOf("sublocality") > -1) {
				map.setZoom(15);
			} else {
				map.setZoom(10);
			}
			$scope.longitude = loc.lng();
			$scope.latitude = loc.lat();
			console.log("position of the location from the search box");
		};

		function errorHandler() {
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

		//detects another location on the map
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