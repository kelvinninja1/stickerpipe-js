
(function(Plugin) {

	var stickerpipe;

	function filterActivePacks(packs) {
		for (var i = 0; i < packs.length; i++) {
			if (packs[i].user_status != 'active') {
				packs.splice(i, 1);
			}
		}

		return packs;
	}

	function filterRecentStickers() {

		var packs = Plugin.Service.Storage.getPacks(),
			recentStickersIds = Plugin.Service.Storage.getRecentStickers();

		for (var i = 0; i < recentStickersIds.length; i++) {

			Plugin.Service.Sticker.getById(recentStickersIds[i], function(sticker) {

				// check existing sticker pack
				var pack = null;

				for (var j = 0; j < packs.length; j++) {
					if (packs[j].pack_name == sticker.pack) {
						pack = packs[j];
						break;
					}
				}

				if (pack == null) {
					recentStickersIds.splice(i, 1);
					Plugin.Service.Storage.setRecentStickers(recentStickersIds);
					return;
				}

				// check existing sticker in pack
				var exist = false;
				for (var j = 0; j < pack.stickers.length; j++) {
					if (pack.stickers[j] == sticker.content_id) {
						exist = true;
						break;
					}
				}

				if (!exist) {
					recentStickersIds.splice(i, 1);
					Plugin.Service.Storage.setRecentStickers(recentStickersIds);
					return;
				}
			});

		}
	}

	Plugin.Service.Pack = {

		init: function(_stickerpipe) {
			stickerpipe = _stickerpipe;
		},

		purchase: function(packName, pricePoint, doneCallback, isUnwatched) {
			isUnwatched = (typeof isUnwatched == 'undefined') ? true : isUnwatched;

			Plugin.Service.Api.purchasePack(packName, pricePoint, function(pack) {
				pack.isUnwatched = isUnwatched;

				var packContentIds = [];
				for (var i = 0; i < pack.stickers.length; i++) {
					var sticker = pack.stickers[i];
					sticker.pack = packName;

					Plugin.Service.Storage.setContentById(sticker.content_id, sticker);

					packContentIds.push(sticker.content_id);
				}

				pack.stickers = packContentIds;

				Plugin.Service.Storage.setPack(pack.pack_name, pack);

				if (stickerpipe && stickerpipe.view.isRendered) {
					stickerpipe.view.tabsView.renderPacks();
				}

				doneCallback && doneCallback(pack);
			});
		},

		fetchPacks: function(callback) {

			var self = this;

			Plugin.Service.Api.getPacks(function(packs) {

				packs = filterActivePacks(packs);

				var packsInStorage = Plugin.Service.Storage.getPacks(),
					undefinedPacksInStorage = [];

				if (!packsInStorage.length) {
					undefinedPacksInStorage = packs;
				} else {
					for (var i = 0; i < packs.length; i++) {
						var packInStorage = null;

						for (var j = 0; j < packsInStorage.length; j++) {
							if (packs[i].pack_name == packsInStorage[j].pack_name) {
								packInStorage = packsInStorage[j];
								break;
							}
						}

						if (packInStorage && packs[i].updated_at == packInStorage.updated_at) {
							packs[i] = packInStorage;
						} else {
							undefinedPacksInStorage.push(packs[i]);
						}
					}
				}

				Plugin.Service.Storage.setPacks(packs);

				for (var i = 0; i < undefinedPacksInStorage.length; i++) {
					Plugin.Service.Pack.purchase(
						undefinedPacksInStorage[i].pack_name,
						undefinedPacksInStorage[i].pricepoint,
						null,
						(packsInStorage.length) ? true : false
					);
				}

				filterRecentStickers();

				self.checkHighlight();

				callback && callback();
			});
		},

		isExistUnwatchedPacks: function() {
			var packs = Plugin.Service.Storage.getPacks();

			for(var i = 0; i < packs.length; i++) {
				if (!!packs[i].isUnwatched) {
					return true;
				}
			}

			return false;
		},

		checkHighlight: function() {
			var showContentHighlight = this.isExistUnwatchedPacks();
			if (!showContentHighlight && Plugin.Service.Storage.getRecentStickers().length == 0) {
				showContentHighlight = true;
			}
			Plugin.Service.Event.changeContentHighlight(showContentHighlight);
		}
	};

})(window.StickersModule);