
(function(Plugin) {

	Plugin.Service.Base = {

		markNewPacks: function(newPacks) {
			var globalNew = false,
				oldPacks = Plugin.Service.Storage.getPacks();

			if (oldPacks.length != 0){

				Plugin.Service.Helper.forEach(newPacks, function(newPack, key) {
					var isNewPack = true;

					Plugin.Service.Helper.forEach(oldPacks, function(oldPack) {


						if(newPack.pack_name == oldPack.pack_name) {
							isNewPack = oldPack.newPack;
						}

					});

					if(isNewPack)  globalNew = true;
					newPacks[key]['newPack'] = isNewPack;
				});


				// todo: to other function
				// todo: check & fix
				//if (globalNew) {

				if (globalNew == false && Plugin.Service.Storage.getUsedStickers().length == 0) {
					globalNew = true;
				}
				Plugin.Service.Event.changeContentHighlight(globalNew);
				//}


				// *****************************************************************************************************
				// todo: do in other function
				// update used stickers

				var used = Plugin.Service.Storage.getUsedStickers();

				for (var i = 0; i < used.length; i++) {
					var sticker = Plugin.Service.Sticker.parse('[[' + used[i].code + ']]');

					var pack = null;
					for (var j = 0; j < newPacks.length; j++) {
						if (newPacks[j].pack_name == sticker.pack) {
							pack = newPacks[j];
							break;
						}
					}

					if (pack == null) {
						used.splice(i, 1);
						continue;
					}

					var isset = false;
					for (var j = 0; j < pack.stickers.length; j++) {
						if (pack.stickers[j].name == sticker.name) {
							isset = true;
							break;
						}
					}

					if (!isset) {
						used.splice(i, 1);
						continue;
					}
				}

				Plugin.Service.Storage.setUsedStickers(used);

				// *****************************************************************************************************
			} else {
				Plugin.Service.Event.changeContentHighlight(true);
			}

			return newPacks;
		},

		updatePacks: function(successCallback) {

			Plugin.Service.Api.getPacks(
				(function(response) {
					if(response.status != 'success') {
						return;
					}

					var packs = response.data;

					// show only active packs
					for (var i = 0; i < packs.length; i++) {
						if (packs[i].user_status != 'active') {
							packs.splice(i, 1);
						}
					}

					packs = this.markNewPacks(packs);

					Plugin.Service.Storage.setPacks(packs);

					successCallback && successCallback(packs);
				}).bind(this)
			);
		}
	};

})(window.StickersModule);