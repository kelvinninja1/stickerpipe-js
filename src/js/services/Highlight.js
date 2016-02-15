
(function(Plugin) {

	Plugin.Service.Highlight = {

		check: function() {

			var showContentHighlight = Plugin.Service.Pack.isExistUnwatchedPacks();
			if (!showContentHighlight && Plugin.Service.Storage.getRecentStickers().length == 0) {
				showContentHighlight = true;
			}

			if (!showContentHighlight &&
				Plugin.Service.Storage.getStoreLastModified() > Plugin.Service.Storage.getStoreLastVisit()) {
				showContentHighlight = true;
			}
			Plugin.Service.Event.changeContentHighlight(showContentHighlight);
		}

	};
})(window.StickersModule);