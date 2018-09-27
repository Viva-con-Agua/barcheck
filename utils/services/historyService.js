app.service('historyService', function($state) {
	var hs = this;
	hs.history = [];
	hs.index = -1;
	hs.navigatedBack = 0;

	hs.getNavigatedBack = function() {
		return hs.navigatedBack;
	};

	hs.setNavigatedBack = function(value) {
		hs.navigatedBack = value;
	};

	hs.addStateToHistory = function() {
		if (hs.getNavigatedBack() === 1) {
			hs.index = hs.index - 1;
		} else {
			hs.index = hs.index + 1;
			hs.history.push($state.current.name);
		}
	};

	hs.getHistory = function() {
		return hs.history;
	};

	hs.getIndex = function() {
		return hs.index;
	};

	hs.getPreviousState = function() {
		hs.history.pop();
		var state = hs.history[hs.history.length - 1];
		return state;
	};

});