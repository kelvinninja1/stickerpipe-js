
(function(Plugin) {

	var stickerpipe;

	Plugin.Service.Pack = {

		init: function(_stickerpipe) {
			stickerpipe = _stickerpipe;
		},

		activateUserPack: function(packName, pricePoint, doneCallback) {
			Plugin.Service.Api.changeUserPackStatus(packName, true, pricePoint, function() {

				// todo: add event ~ "packs fetched" & remove "stickerpipe" variable
				stickerpipe.fetchPacks(function() {
					doneCallback && doneCallback();
				});

			});
		}
	};
})(window.StickersModule);