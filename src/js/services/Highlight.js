
(function(Plugin) {

	Plugin.Service.Highlight = {

		check: function() {

			var showContentHighlight = Plugin.Service.Packs.isExistUnwatched();
			if (!showContentHighlight && Plugin.Service.Storage.getRecentStickers().length == 0) {
				showContentHighlight = true;
			}

			if (!showContentHighlight &&
				Plugin.Service.Metadata.getStoreLastModified() > Plugin.Service.Metadata.getStoreLastVisit()) {
				showContentHighlight = true;
			}
			Plugin.Service.Event.changeContentHighlight(showContentHighlight);
		}

	};
})(window.StickersModule);