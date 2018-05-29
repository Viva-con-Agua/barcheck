app.service('locationService', function($state) {
	var ls = this; // ls => locationService

	ls.setDecision = function(decision) {
		ls.oLocation.decision = decision;
	};

	ls.setGeoPosition = function(lat, lng) {
		ls.oLocation.geoLocation = {
			latitude: lat,
			longitude: lng
		};
	};

	ls.setComment = function(comment) {
		ls.oLocation.comment = comment;
	};

	ls.getAddressAsString = function() {
		return ls.oLocation.address.street + ", " + ls.oLocation.address.city + ", Deutschland";
	};

	ls.getGeoPosition = function() {
		return ls.oLocation.geoLocation;
	};

	ls.oLocation = {}; // variable for persistence

	ls.getTextForInterestDecisionCode = function(dc) {
		var textForCode = ["Bereits Supporter", "Interesse", "Kein Intresse"];
		return textForCode[dc];
	};

	ls.getLocation = function() {
		return ls.oLocation;
	};

	ls.getStreet = function() {
		return ls.oLocation.address.street;
	};

	ls.setLocationName = function(newValue) {
		ls.oLocation.name = newValue;
	};
	ls.getLocationName = function() {
		return ls.oLocation.name;
	};

	ls.getCategoryIndex = function() {
		return ls.oLocation.categoryIndex;
	};

	ls.getBootleIndex = function() {
		return ls.oLocation.bottleIndex;
	};

	ls.getReasonNotIndex = function() {
		return ls.olocation.reasonNoIndex;
	};

	ls.getReasonYesIndex = function() {
		return ls.olocation.reasonYesIndex;
	};

	ls.setSearchName = function(newValue) {
		ls.searchName = newValue;
	};

	ls.getSearchName = function() {
		return ls.searchName;
	};

	ls.setPaperDecision = function(dc, reasons) {
		ls.oLocation.paperDecision = {
			decisionCode: dc,
			reasons: reasons
		};
	};

	ls.getInterestReasons = function() {
		return [{
			id: 0,
			text: "too expensive"
		}, {
			id: 1,
			text: "other supplier"
		}, {
			id: 2,
			text: "never heard before"
		}, {
			id: 3,
			text: "other"
		}];
	};

	ls.getNoInterestReasons = function() {
		return [{
			id: 0,
			text: "too expensive"
		}, {
			id: 1,
			text: "I don't like it"
		}, {
			id: 3,
			text: "other"
		}];
	};

	ls.addContactToSelectedLocation = function(contactId) {
		if (ls.selectedLocation.partners) {
			ls.selectedLocation.partners.push(contactId);
		} else {
			ls.selectedLocation.partners = [contactId];
		}

		function sortNumber(a, b) {
			return a - b;
		}
		// sorting increases the performance when searching for possiblePartners
		ls.selectedLocation.partners.sort(sortNumber);
	};

	ls.saveLocation = function() {

		// mockup until xsodata is implemented
		var highestLocation = ls.locations[ls.locations.length - 1];
		ls.oLocation.id = highestLocation.id + 1;
		ls.locations.push(ls.oLocation);
		// mockup until xsodata is implemented
		ls.oLocation = {};
		return highestLocation.id + 1;
	};

	ls.locations = [{
		name: "Die Schenke",
		id: 0,
		address: {
			street: "Rathausplatz",
			additionalAddress: "2. Etage",
			postcode: "45219",
			city: "Essen"
		},
		partners: [0],
		categoryIndex: 0,
		// adapt to right format!!
		waterDecision: {
			decisionCode: 1
		},
		paperDecision: {
			decisionCode: 0
		}
	}, {
		name: "Henriks",
		id: 1,
		address: {
			street: "Tesdorpfstraße 6",
			additionalAddress: "",
			postcode: "23441",
			city: "Hamburg"
		},
		partners: [1],
		categoryIndex: 3,
		// s.o.
		waterDecision: {
			decisionCode: 1
		},
		paperDecision: {
			decisionCode: 2
		}
	}, {
		name: "Edeka",
		id: 2,
		address: {
			street: "Kaiserstraße 15",
			additionalAddress: "",
			postcode: "76133",
			city: "Karlsruhe"
		},
		partners: [2],
		categoryIndex: 4,
		// s.o.
		waterDecision: {
			decisionCode: 1
		},
		paperDecision: {
			decisionCode: 1
		}
	}];

	ls.getAllLocations = function() {
		for (var i = 0; i < ls.locations.length; i++) {
			parseInt(ls.locations[i].address.postcode);
		}
		return ls.locations;
	};

	ls.setSelectedLocation = function(id) {
		// GET
		$.ajax({
			type: "GET",
			url: "/destinations/vca/VivaConAgua/location.xsodata/Location(" + id + ")",
			cache: false,

			contentType: "application/json;charset=utf-8",
			error: function(msg, textStatus) {
				console.log(textStatus);
			},
			success: function(data) {
				console.log(data)
				var data = data;
				console.log(data)
				ls.selectedLocation = {
					name: data.documentElement.getElementsByTagName('d:NAME')[0].innerHTML,
					id: data.documentElement.getElementsByTagName('d:ID')[0].innerHTML,
					address: {
						street: data.documentElement.getElementsByTagName('d:STREET')[0].innerHTML,
						additionalAddress: data.documentElement.getElementsByTagName('d:AADDRESS')[0].innerHTML,
						postcode: data.documentElement.getElementsByTagName('d:POSTCODE')[0].innerHTML,
						city: data.documentElement.getElementsByTagName('d:CITY')[0].innerHTML
					},
					latitude: data.documentElement.getElementsByTagName('d:LATITUDE')[0].innerHTML,
					longitude: data.documentElement.getElementsByTagName('d:LONGITUDE')[0].innerHTML,
					partners: null,
					categoryIndex: data.documentElement.getElementsByTagName('d:CATEGORYID')[0].innerHTML,
					decision: {
						already: data.documentElement.getElementsByTagName('d:WATER')[0].innerHTML,
						imagine: data.documentElement.getElementsByTagName('d:IMAGINE')[0].innerHTML
					},
					paperDecision: {
						decisionCode: null
					}
				};
				console.log("Selected Location: ");
				console.log(ls.getSelectedLocation());
				$state.go('locations-detail', {
					tab: null
				});
			}
		});
	};

	ls.getSelectedLocation = function() {
		ls.selectedLocation.address.postcode =
			parseInt(ls.selectedLocation.address.postcode); // temporary work around!
		// we will face this problem later depending on how the backend field looks like
		return ls.selectedLocation;
	};

	ls.setAddress = function(address) {
		ls.oLocation.address = address;
		parseInt(ls.oLocation.address.postcode);
	};

	ls.convertGoogleAddressToObjectAddress = function(address_components) {

		var address = {};

		var sStreetNumber;
		var types = [];

		for (var i = 0; i < address_components.length; i++) {
			types = address_components[i].types;
			if ($.inArray('locality', types) === 0) { // found
				address.city = address_components[i].long_name;
				if (address_components.length - 1 !== i) {
					continue;
				}
			}

			if ($.inArray('street_number', types) === 0) { // found
				sStreetNumber = address_components[i].long_name;
				if (address_components.length - 1 !== i) {
					continue;
				}
			}

			if ($.inArray('route', types) === 0) { // found
				address.street = address_components[i].long_name;
				if (address_components.length - 1 !== i) {
					continue;
				}
			}

			if ($.inArray('postal_code', types) === 0) { // found
				address.postcode = address_components[i].long_name;
				if (address_components.length - 1 !== i) {
					continue;
				}

			}

			if (address.street && address.city && address.postcode && sStreetNumber) {
				address.street = address.street + " " + sStreetNumber;
				return address;
			}
		}
	};

	ls.setBottletypes = function(B_330GLAS, B_500PET, B_750GLAS, B_1000PET, B_750TRIO, B_750PET) {

		if (B_330GLAS) {
			ls.oLocation.GLAS_330 = "X";
		}
		if (B_500PET) {
			ls.oLocation.PET_500 = "X";
		}
		if (B_750GLAS) {
			ls.oLocation.GLAS_750 = "X";
		}
		if (B_1000PET) {
			ls.oLocation.PET_1000 = "X";
		}
		if (B_750TRIO) {
			ls.oLocation.TRIO_750 = "X";
		}
		if (B_750PET) {
			ls.oLocation.PET_750 = "X";
		}
	};

	ls.getPaperDecision = function() {
		return ls.oLocation.paperDecision;
	};

	ls.setWaterDecision = function(dc, reasons) {
		ls.oLocation.waterDecision = {
			decisionCode: dc,
			reasons: reasons
		};
	};

	ls.getWaterDecision = function() {
		return ls.oLocation.waterDecision;
	};

	ls.addressToString = function() {
		if (ls.oLocation.address.additionalAddress) {
			return ls.oLocation.address.street + ' ' +
				ls.oLocation.address.additionalAddress + ' ' +
				ls.oLocation.address.postcode + ' ' +
				ls.oLocation.address.city;
		} else {
			return ls.oLocation.address.street + ' ' +
				ls.oLocation.address.postcode + ' ' +
				ls.oLocation.address.city;
		}
	};

	ls.resetSelectedLocation = function() {
		ls.selectedLocation = {};
		ls.oLocation = {};
	};

});