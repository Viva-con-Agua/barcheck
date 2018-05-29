app.controller('LocationSearchCtrl', ['$scope', '$state', 'locationService', 'designService', 'historyService', function($scope, $state,
	locationService, designService, historyService) {

	$scope.rememberName = function() {
		// (obsolete) save entered name for search on next screen
		locationService.setSearchName($scope.searchName);
	};

	// navBack logic
	$scope.goBack = function() {
		historyService.setNavigatedBack(1);
		$state.go(historyService.getPreviousState());
	};

	// dynamic source for correct icon in each state
	$scope.getIcon = function() {
		return designService.iconContinue();
	};

}]);

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

app.controller('ManualAdressCtrl', ['$scope', '$state', '$mdDialog', 'locationService', 'historyService', function($scope, $state,
	$mdDialog, locationService, historyService) {
	$scope.locationName = locationService.getLocationName();

	$scope.address = locationService.oLocation.address || {}; // default '{}' if locationService.oLocation.address is undefined 

	// get address from google
	$scope.address = function() {
		var place = this.getPlace(); //get selected place 
		console.log(this.getPlace());
		var loc = this.getPlace().geometry.location;
		$scope.latlng = [loc.lat(), loc.lng()];
		$scope.center = [loc.lat(), loc.lng()];

		$scope.longitude = loc.lng();
		$scope.latitude = loc.lat();

		locationService.setGeoPosition($scope.latitude, $scope.longitude);

		var street = "",
			number = "";
		$.each(this.getPlace().address_components, function(key, value) {
			if (value.types.indexOf('route') != -1) {
				console.log(value);
				street = value.long_name;
			}
			if (value.types.indexOf('street_number') != -1) {
				console.log(value);
				number = value.long_name;
			}
			if (value.types.indexOf('postal_code') != -1) {
				console.log(value);
				$scope.postcodeModel = parseInt(value.long_name, 10);
			}
			if (value.types.indexOf('locality') != -1) {
				console.log(value);
				$scope.cityModel = value.long_name;
			}
		});
		$scope.streetModel = street + " " + number;
	};

	$scope.showConfirm = function(event) {
		locationService.setAddress($scope.address); // next command uses it so assign it here!
		console.log($scope.streetModel)
		locationService.setAddress({
			street: $scope.streetModel,
			additionalAddress: $scope.additionaladdressModel,
			postcode: $scope.postcodeModel,
			city: $scope.cityModel

		});
		locationService.setLocationName($scope.locationName); // save location name

		var confirm = $mdDialog.confirm()
			.title('Is this the right location?')
			.textContent(locationService.addressToString())
			.ariaLabel('Save')
			.targetEvent(event)
			.ok('Yes')
			.cancel('Change');

		$mdDialog.show(confirm).then(function() {
			$state.go('locations-create-category');
		});
	};

	$scope.goBack = function() {
		locationService.resetSelectedLocation();
		historyService.setNavigatedBack(1);
		$state.go(historyService.getPreviousState());
	};
}]);

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

app.controller('CategorySelectionCtrl', ['$scope', '$state', 'locationService', 'designService', 'historyService', function($scope, $state,
	locationService,
	designService, historyService) {

	$scope.tileClicked = function(index) { // index contains index of selected tile
		locationService.oLocation.categoryIndex = index; // assign index to categoryIndex in locationService
		$state.go('locations-water-decision');
	};

	$scope.goBack = function() {
		historyService.setNavigatedBack(1);
		$state.go(historyService.getPreviousState());
	};

	$scope.tiles = designService.getTiles(); // get all tile sources
}]);

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

app.controller('WaterDecisionCtrl', ['$scope', '$state', 'locationService', 'designService', 'historyService', function($scope, $state,
	locationService, designService, historyService) {

	$scope.goBack = function() {
		historyService.setNavigatedBack(1);
		$state.go(historyService.getPreviousState());
	};

	$scope.saveDecision = function(selectedValue) {
		var decision = locationService.oLocation.decision || {}; // see above

		// fill the decision in the locationservice according to selected selectedValue
		switch (selectedValue) {
			case "seeYes":
				decision.already = 'X';
				decision.imagine = '';
				break;
			case "seeNo":
				decision.already = '';
				break;
			case "imagineYes":
				decision.imagine = 'X';
				break;
			case "imagineNo":
				decision.imagine = '';
				break;
			default:
		}

		locationService.setDecision(decision);
	};

	// Switch Yes/No
	$scope.data = false;

	$scope.continueTo = function() {
		if ($scope.data) {
			$state.go('locations-water-selection');
			$scope.saveDecision("seeYes");
		} else {
			$state.go('locations-no-water');
			$scope.saveDecision("seeNo");
		}
	};

	$scope.continueTo2 = function() {
		if ($scope.data) {
			$state.go('locations-water-decision-interest');
			$scope.saveDecision("imagineYes");
		} else {
			$state.go('locations-water-decision-no-interest');
			$scope.saveDecision("imagineNo");
		}
	};

	$scope.selected = []; // empty array as placeholder for selected reasons

	// fetch reasons for interest or no interest according to current states name
	if ($state.current.name === "locations-water-decision-interest") {
		$scope.reasons = locationService.getInterestReasons();
	} else if ($state.current.name === "locations-water-decision-no-interest") {
		$scope.reasons = locationService.getNoInterestReasons();
	}

	// add or remove selected reason
	$scope.toggle = function(reason, list) {

		// list contains reference to selected

		var idx = list.indexOf(reason);
		if (idx > -1) {
			list.splice(idx, 1);
		} else {
			list.push(reason);
		}
		list.sort(compare);
	};

	// sort function
	var compare = function(a, b) {
		if (a.id < b.id) {
			return -1;
		}
		if (a.id > b.id) {
			return 1;
		}
		return 0;
	};

	$scope.makeComment = function() {
		locationService.setBottletypes($scope.B_330GLAS, $scope.B_500PET, $scope.B_750GLAS, $scope.B_1000PET, $scope.B_750TRIO, $scope.B_750PET);
		$state.go('locations-comment');
	};

	$scope.sendSupporter = function() {
		//locationService.setBottletypes($scope.B_330GLAS, $scope.B_500PET, $scope.B_750GLAS, $scope.B_1000PET, $scope.B_750TRIO, $scope.B_750PET);
		$state.go('locations-create-summary');
	};

	$scope.saveSelection = function(event) {
		if (event.target.name === "glas") {
			// Save glas
		} else {
			// save plastik
		}
	};

	// put the bottle images for selection
	//$scope.selected_images = {};

	$scope.property = designService.getImages();
	$scope.B_330GLAS = false;
	$scope.B_500PET = false;
	$scope.B_750GLAS = false;
	$scope.B_1000PET = false;
	$scope.B_750TRIO = false;
	$scope.B_750PET = false;
	$scope.selected_images = function(image) {
		// locationService.oLocation.bottleIndex = index;
		// designService.ds.getBottlesForIndex = index;
		// var selected_images = {};
		var idx = designService.getImages().imageURLs.indexOf(image);

		switch (idx) {
			case 0:
				if ($scope.B_330GLAS) {
					$scope.B_330GLAS = false;
				} else {
					$scope.B_330GLAS = true;
				}
				break;
			case 1:
				if ($scope.B_500PET) {
					$scope.B_500PET = false;
				} else {
					$scope.B_500PET = true;
				}
				break;
			case 2:
				if ($scope.B_750GLAS) {
					$scope.B_750GLAS = false;
				} else {
					$scope.B_750GLAS = true;
				}
				break;
			case 3:
				if ($scope.B_1000PET) {
					$scope.B_1000PET = false;
				} else {
					$scope.B_1000PET = true;
				}
				break;
			case 4:
				if ($scope.B_750TRIO) {
					$scope.B_750TRIO = false;
				} else {
					$scope.B_750TRIO = true;
				}
				break;
			case 5:
				if ($scope.B_750PET) {
					$scope.B_750PET = false;
				} else {
					$scope.B_750PET = true;
				}
				break;
			default:
		}
	};

	$scope.tileClicked = function(index) { // index contains index of selected tile
		locationService.oLocation.categoryIndex = index; // assign index to categoryIndex in locationService
		$state.go('locations-water-decision');
	};

	// Save the reason - Why Not
	$scope.sendSupporter1 = function(index) { // index contains index of selected tile
		locationService.oLocation.reasonNoIndex = index;
		$state.go('locations-create-summary');
	};

	// Save the reason - Why Not Before
	$scope.sendSupporter2 = function(index) { // index contains index of selected tile
		locationService.oLocation.reasonYesIndex = index;
		$state.go('locations-create-summary');
	};

	// Continue button by reasons
	/*$scope.sendSupporter = function() {
		$state.go('locations-create-summary');
	};*/

}]);

app.controller('CommentCtrl', ['$scope', '$state', 'locationService', 'designService', 'historyService', function($scope, $state,
	locationService, designService, historyService) {
	$scope.sendSupporter = function(event) {
		locationService.setComment($scope.commentModel);
		$state.go('locations-create-summary');
	};

	// navBack logic
	$scope.goBack = function() {
		historyService.setNavigatedBack(1);
		$state.go(historyService.getPreviousState());
	};
}]);

app.controller('SummaryController', ['$scope', '$state', 'locationService', 'historyService', function($scope, $state, locationService,
	historyService) {
	$scope.waterDecision = locationService.getWaterDecision();
	$scope.location = locationService.oLocation;

	$scope.getDecisionText = function(decisionCode) {
		return locationService.getTextForInterestDecisionCode(decisionCode);
	};

	$scope.goBack = function() {
		historyService.setNavigatedBack(1);
		$state.go(historyService.getPreviousState());
	};

	$scope.saveLocationInfo = function() {
		// this function fetches all information from locationService and puts them together to push to DB

		var user = "";
		if (firebase.auth().currentUser) {
			// in case login form is active assign Firebase userId to user field in DB
			user = firebase.auth().currentUser.uid;
		}

		// get latitude and longitude from locationService

		var latitude = locationService.getGeoPosition().latitude;
		var longitude = locationService.getGeoPosition().longitude;

		// Data for Post
		var data = JSON.stringify({
			ID: "1000",
			CAPS_NAME: locationService.getLocation().name.toUpperCase(),
			NAME: locationService.getLocation().name.replace(/'/g, '´'),
			STREET: locationService.getLocation().address.street,
			AADDRESS: "",
			POSTCODE: locationService.getLocation().address.postcode,
			CITY: locationService.getLocation().address.city,
			CATEGORYID: locationService.getLocation().categoryIndex,
			WATER: locationService.getLocation().decision.already,
			IMAGINE: locationService.getLocation().decision.imagine,
			USER: user,
			LATITUDE: latitude.toString(),
			LONGITUDE: longitude.toString(),
			// BOTTLE_TYPE: locationService.getLocation().bottleIndex,
			GLAS_330: locationService.getLocation().GLAS_330,
			PET_500: locationService.getLocation().PET_500,
			GLAS_750: locationService.getLocation().GLAS_750,
			PET_1000: locationService.getLocation().PET_1000,
			TRIO_750: locationService.getLocation().TRIO_750,
			PET_750: locationService.getLocation().PET_750,
			WHY_NOT: locationService.getLocation().reasonNoIndex,
			WHY_NOT_BEFORE: locationService.getLocation().reasonYesIndex,
			COMMENT: locationService.getLocation().comment
		});

		// POST
		$.ajax({
			type: "POST",
			url: "/destinations/vca/VivaConAgua/location.xsodata/Location",
			dataType: "json",
			data: data,
			cache: false,
			contentType: "application/json;charset=unicode",
			error: function(msg, textStatus) {
				// TODO: Error handling
			},
			success: function(data) {
				console.log(data)
					// TODO: Success handling
			}
		});
		// jump to final state
		$state.go('thankyou');
	};
}]);

app.controller('locationSearchController', ['$scope', 'locationService', '$state', 'designService', 'historyService', '$geolocation',
	function($scope, locationService, $state, designService, historyService, $geolocation) {

		// show the "no results"-Infofield when true
		$scope.showNoResults = false;

		// empty placeholder for search results
		$scope.locations = [];
		// initial placehold while locating the user (will be replaced by city)
		$scope.cityName = "...";
		var searchName = locationService.getSearchName().replace(/'/g, '´');
		console.log(searchName)
		$.ajax({

			type: "GET",
			url: "/destinations/vca/VivaConAgua/location.xsodata/Location/?$filter=NAME eq '" + locationService.getSearchName().replace(/'/g,
				'´') + "' and STREET eq '" + locationService.getStreet() + "'",
			cache: false,
			contentType: "application/xml;charset=utf-8",
			error: function(msg, textStatus) {
				console.log(textStatus);
			},
			success: function(data) {
				var data = data;
				if (data.documentElement.getElementsByTagName('d:NAME')[0] === undefined || data.documentElement.getElementsByTagName('d:STREET')[
						0] === undefined) {
					$scope.$apply(function() {
						$scope.showNoResults = true;
					});

				} else {

					$scope.$apply(function() {
						data = {
							NAME: data.documentElement.getElementsByTagName('d:NAME')[0].innerHTML,
							ID: data.documentElement.getElementsByTagName('d:ID')[0].innerHTML,
							STREET: data.documentElement.getElementsByTagName('d:STREET')[0].innerHTML,
							AADDRESS: data.documentElement.getElementsByTagName('d:AADDRESS')[0].innerHTML,
							POSTCODE: data.documentElement.getElementsByTagName('d:POSTCODE')[0].innerHTML,
							CITY: data.documentElement.getElementsByTagName('d:CITY')[0].innerHTML,
							CATEGORYID: data.documentElement.getElementsByTagName('d:CATEGORYID')[0].innerHTML,
							CAPS_NAME: data.documentElement.getElementsByTagName('d:CAPS_NAME')[0].innerHTML,
							IMAGINE: data.documentElement.getElementsByTagName('d:IMAGINE')[0].innerHTML
						};

						$scope.locations.push(data);

					});
				}
			}
		});

		/*	$.ajax({
				type: "GET",
				url: "/destinations/vca/VivaConAgua/location.xsodata/Location/?$filter=substringof('" + locationService.getSearchName()
					.toUpperCase() +
					"', CAPS_NAME) and STREET eq '" + locationService.getStreet() + "'",
				cache: false,
				contentType: "application/json;charset=utf-8",
				error: function(msg, textStatus) {
					console.log("Search failed in locationSearchController with error code: " + textStatus);
					$scope.showNoResults = true;
				},
				success: function(data) {
					console.log(data)
					// console.log($("object").contents().find('entry'))
					$scope.loading = false;
					$scope.$apply(function() {
						$scope.locations = data.d.results;
						if ($scope.locations.length === 0) {
							$scope.showNoResults = true;
						}
					});
				}
			});*/

		$scope.itemPressed = function(id) {
			locationService.setSelectedLocation(id);
		};

		$scope.goBack = function() {
			locationService.resetSelectedLocation();
			historyService.setNavigatedBack(1);
			$state.go(historyService.getPreviousState());
		};

		$scope.getIcon = function() {
			return designService.iconContinue();
		};

		/*	function _getData(sUrl) {
				// function for GET Request
				
				$.ajax({
					type: "GET",
					url: sUrl,
					cache: false,
					contentType: "application/xml;charset=utf-8",
					error: function(msg, textStatus) {
						console.log("Search failed in locationSearchController with error code: " + textStatus);
						$scope.showNoResults = true;
					},
					success: function(data) {

						console.log(data.getProperty('#document/entry'))
						$scope.loading = false;
						$scope.$apply(function() {
							$scope.locations = data.d.results;
							if ($scope.locations.length === 0) {
								$scope.showNoResults = true;
							}
						});
					}
				});
			}

			function _loadLocations(withLocation) {
				
				// withLocation = false -> load all locations without city filter
				// withLocation = false -> load all locations with city filter
				
				if (!locationService.getSearchName()) {
					// empty search string
					
					$scope.filteredWithCity = false;
					$scope.loading = false;
					$scope.showNoResults = true;

				} else {
					var sUrl = "";

					if (withLocation) {

						$scope.loading = true;

						// get gelocation
						$geolocation.getCurrentPosition({
							timeout: 60000,
							maximumAge: 250,
							enableHighAccuracy: true
						}).then(function(position) {
							// position contains current position of the user
							
							// get google-Geocoder
							var geocoder = new google.maps.Geocoder;
							
							// create object with latitude and longitude
							var geoObject = {
								lat: position.coords.latitude,
								lng: position.coords.longitude
							};
							
							geocoder.geocode({
								'location': geoObject
							}, function(results, status) {
								
								// results contains all results for the geodata
								
								if (status === 'OK') {
									// set location into the info control
									$scope.$apply(function() {
										
										var result = results[0];
										var addressComponents = result.address_components;
										var city = locationService.convertGoogleAddressToObjectAddress(addressComponents).city;
										
										$scope.cityName = city;
									});
									
									// build URL with search string and city name
							
									sUrl = "/destinations/vca/VivaConAgua/location.xsodata/Location/?$format=xml&$filter=substringof('" + locationService.getSearchName()
										.toUpperCase() +
										"', CAPS_NAME) and STREET eq '" + locationService.getStreet() + "'";
										
									// fetch data with URL	
									_getData(sUrl);
								} else {
									_loadLocations(false);
								}
								
							}); // end of geocode promise

						});

					} else {
						$scope.filteredWithCity = false;

						sUrl=  "/destinations/vca/VivaConAgua/location.xsodata/Location/?$format=xml&$filter=CAPS_NAME eq '" + locationService.getSearchName().toUpperCase() + "' and STREET eq '" + locationService.getStreet() + "'";
						_getData(sUrl);
					}

				}

			}*/

		/*	$scope.loadAllPressed = function() {
				_loadLocations(false);
			};*/

		// _loadLocations(true);
		/*
				$scope.getCategoryName = function(index) {
					return designService.getNameForCategoryIndex(index);
				};*/
	}
]);

app.controller('locationsDetailCtrl', ['$rootScope', '$scope', '$state', '$mdDialog', 'locationService', 'designService',
	'contactService', 'historyService', '$stateParams',
	function($rootScope, $scope, $state, $mdDialog, locationService, designService, contactService, historyService, $stateParams) {

		// (obsolete) get correct tab from state parameter
		$scope.tabIndex = $stateParams.tab;

		$scope.selectedLocation = locationService.getSelectedLocation();

		$scope.waterDecision = $scope.selectedLocation.waterDecision;
		var decision = locationService.getSelectedLocation().decision;
		$scope.updateAlready = function() {

			console.log("worked");
			if ($scope.selectedLocation.decision.already) { // check if undefined
				console.log("worked2");
				decision.already = '';
				console.log($scope.selectedLocation.decision.already);

			} else {
				console.log("false");
				decision.already = 'X';
				decision.imagine = '';
				console.log($scope.selectedLocation.decision.imagine);
			}
			locationService.setDecision(decision);
		};

		$scope.updateImagine = function() {
			console.log("workedI");
			if ($scope.selectedLocation.decision.imagine) { // check if undefined
				console.log("workedi2");
				decision.imagine = '';
				console.log($scope.selectedLocation.decision.imagine);

			} else {
				console.log("falseI");
				decision.imagine = 'X';
				console.log($scope.selectedLocation.decision.imagine);
			}
			locationService.setDecision(decision);
		};

		$scope.getCategoryName = function(index) {
			return designService.getNameForCategoryIndex(index);
		};

		if ($scope.selectedLocation.decision.already) { // check if undefined
			$scope.already = (($scope.selectedLocation.decision.already === 'X') ? true : false);
		} else {
			$scope.already = false; // default
		}

		if ($scope.selectedLocation.decision.imagine) { // check if undefined
			$scope.imagine = (($scope.selectedLocation.decision.imagine === 'X') ? true : false);
		} else {
			$scope.imagine = false; // default
		}

		$scope.backClicked = function() {
			locationService.resetSelectedLocation();
			historyService.setNavigatedBack(1);
			$state.go(historyService.getPreviousState());
		};

		$scope.goBack = function() {
			historyService.setNavigatedBack(1);
			$state.go(historyService.getPreviousState());
		};

		$scope.saveChanges = function() {
			var data = JSON.stringify({
				ID: locationService.getSelectedLocation().id,
				CAPS_NAME: locationService.getSelectedLocation().name.toUpperCase(),
				NAME: locationService.getSelectedLocation().name,
				STREET: locationService.getSelectedLocation().address.street,
				AADDRESS: "",
				POSTCODE: locationService.getSelectedLocation().address.postcode,
				CITY: locationService.getSelectedLocation().address.city,
				CATEGORYID: locationService.getSelectedLocation().categoryIndex,
				WATER: locationService.getSelectedLocation().decision.already,
				IMAGINE: locationService.getSelectedLocation().decision.imagine,
				USER: locationService.getSelectedLocation().user,
				LATITUDE: locationService.getSelectedLocation().latitude,
				LONGITUDE: locationService.getSelectedLocation().longitude,
				WHY_NOT: locationService.getLocation().reasonNoIndex,
				WHY_NOT_BEFORE: locationService.getLocation().reasonYesIndex,
				COMMENT: locationService.getLocation().comment
			});

			// PUT
			$.ajax({
				type: "PUT",
				// url: "/destinations/vca/VivaConAgua/location.xsodata/Location?$ID('" + locationService.getSelectedLocation().id + "')",
				url: "/destinations/vca/VivaConAgua/location.xsodata/Location(" + locationService.getSelectedLocation().id + ")",
				dataType: "json",
				data: data,
				cache: false,
				contentType: "application/json;charset=unicode",
				error: function(msg, textStatus) {
					// TODO: Error handling
				},
				success: function(data) {
					console.log("worked");
					// TODO: Success handling
				}
			});
		};

		$scope.interestReasons = locationService.getInterestReasons();

		$scope.noInterestReasons = locationService.getNoInterestReasons();

		$scope.getSourceForIndex = function(index) {
			var x = designService.getCategoryIconSourceForIndex(index);
			return x;
		};
	}
]);