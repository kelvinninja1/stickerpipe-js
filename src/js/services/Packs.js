
(function(Plugin) {

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

	Plugin.Service.Packs = {

		fetch: function(callback) {

			Plugin.Service.Api.getPacks(function(packs) {

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
					if (Plugin.Service.Pack.isHidden(undefinedPacksInStorage[i])) {
						continue;
					}

					Plugin.Service.Pack.purchase(
						undefinedPacksInStorage[i].pack_name,
						undefinedPacksInStorage[i].pricepoint,
						(packsInStorage.length) ? true : false
					);
				}

				filterRecentStickers();

				Plugin.Service.Highlight.check();

				callback && callback();
			});
		},

		isExistUnwatched: function() {
			var packs = Plugin.Service.Storage.getPacks();

			for(var i = 0; i < packs.length; i++) {
				if (!!packs[i].isUnwatched) {
					return true;
				}
			}

			return false;
		}
	};

})(window.StickersModule);