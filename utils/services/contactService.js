app.service('contactService', function() {
	var cs = this;

	cs.contacts = [{
		id: 0,
		vorname: "Hans",
		name: "Peter",
		job: "Bauer",
		source: "sources/mock/ansprechpartnerBilder/bauer.jpg",
		address: {
			street: "Landstraße 1",
			postCode: "55112",
			city: "Frankfurt"
		},
		email: "hans.peter@bauernhof.de",
		telefon: "016376338911"
	}, {
		id: 1,
		vorname: "Guido",
		name: "Hip",
		job: "Barkeeper",
		source: "sources/mock/ansprechpartnerBilder/hipster.jpg",
		address: {
			street: "Schloßstraße 763",
			postCode: "11123",
			city: "Berlin"
		},
		email: "gh@gmx.de",
		telefon: "015156123901"
	}, {
		id: 2,
		vorname: "Hubert",
		name: "Schmitz",
		job: "Filialleiter EDEKA",
		source: "sources/mock/ansprechpartnerBilder/filialleiter.jpg",
		address: {
			street: "Kaiserstraße 6",
			postCode: "76133",
			city: "Karlsruhe"
		},
		email: "hubert.schmitz@edeka.de",
		telefon: "017233351321"
	}];

	cs.addNewContact = function(contact) {
		cs.contacts.push(contact);
	};

	cs.getAllContacts = function() {
		return cs.contacts;
	};

	cs.clearSelectedContact = function() {
		cs.selectedContact = {};
	};

	cs.getAllPossibleContactsForSelectedLocation = function(location) {
		var possiblePartners = [];
		for (var i = 0; i < cs.contacts.length; i++) {
			contactId = cs.contacts[i].id;
			// jQuery.inArray returns index of value in array
			// Returns -1 if array does not contain value.
			if ($.inArray(contactId, location.partners) === -1) {
				possiblePartners.push(cs.contacts[i]);
			}
		}
		return possiblePartners;
	};

	cs.setSelectedContact = function(id) {
		cs.selectedContact = cs.contacts[id];
	};
	// brauchen wir das?
	cs.selectedContact;

	cs.getSelectedContact = function() {
		return cs.selectedContact;
	};
});

app.service('progressService', function($state) {
	var ps = this;
	ps.getCurrentState = function() {
		return $state.current.name;
	};
	// brauchen wir das?
	ps.getProgressAtState = function(state) {};

});