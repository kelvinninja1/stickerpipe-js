
(function(Module) {

	var stickerpipe;

	Module.Service.Pack = {

		init: function(_stickerpipe) {
			stickerpipe = _stickerpipe;
		},

		activateUserPack: function(packName, pricePoint, doneCallback) {
			Module.Api.changeUserPackStatus(packName, true, pricePoint, function() {

				// todo: add event ~ "packs fetched" & remove "stickerpipe" variable
				stickerpipe.fetchPacks(function() {
					doneCallback && doneCallback();
				});

			});
		}
	};
})(window.StickersModule);