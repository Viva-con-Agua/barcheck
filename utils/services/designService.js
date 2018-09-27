app.service('designService', function($state) {
	var ds = this;

	ds.iconContinue = function() {
		switch ($state.current.name) {
			case "locations":
				return "sources/img/icons/search.svg";
			case "locations-create-category":
				return "sources/img/icons/save.svg";
			case "locations-create-information":
				return "sources/img/icons/save.svg";
			case "locations-search-result":
				return "sources/img/icons/edit.svg";
			case "locations-water-decision":
				return "sources/img/icons/continue.svg";
			case "locations-water-selection":
				return "sources/img/icons/continue.svg";
			case "locations-no-water":
				return "sources/img/icons/continue.svg";
			case "locations-water-decision-interest":
				return "sources/img/icons/continue.svg";
			case "locations-water-decision-no-interest":
				return "sources/img/icons/continue.svg";
			default:
				return "";
		}
	};

	ds.continueFunction = function() {
		switch ($state.current.name) {
			case "locations":
				console.log("location");
				break;
			default:
				console.log("default");
		}
	};

	ds.tiles = [{
		src: "sources/img/categories_btn/Beer_btn.svg",
		name: "bar"
	}, {
		src: "sources/img/categories_btn/Disco_btn.svg",
		name: "club"
	}, {
		src: "sources/img/categories_btn/Cafe_btn.svg",
		name: "café"
	}, {
		src: "sources/img/categories_btn/Restaurant_btn.svg",
		name: "restaurant"
	}, {
		src: "sources/img/categories_btn/Shopping_btn.svg",
		name: "shop"
	}, {
		src: "sources/img/categories_btn/Question_btn.svg",
		name: "other"
	}];

	
	ds.getNameForCategoryIndex = function(index) {
		return ds.tiles[index].name;
	};

	ds.getTiles = function() {
		return ds.tiles;
	};
	
	ds.getCategoryIconSourceForIndex = function(index) {
		return ds.tiles[index].src;
	};
	
	ds.getImages = function() {
		return ds.images;
	};
	
	ds.images = 
	{
		imageURLs: ['sources/img/water/330GLAS.png',
			'sources/img/water/500PET.png',
			'sources/img/water/750GLAS.png',
			'sources/img/water/1000PET.png',
			'sources/img/water/750TRIO.png',
			'sources/img/water/750PET.png'
		]
	};
	
	ds.getBottlesForIndex = function(index) {
		return ds.bottles[index].imageURLs;
	};

});