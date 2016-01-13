
(function(Module) {

	var StickerHelper = Module.StickerHelper;

	Module.BaseService = {

		markNewPacks: function(newPacks) {
			var globalNew = false,
				oldPacks = Module.Storage.getPacks();

			if (oldPacks.length != 0){

				StickerHelper.forEach(newPacks, function(newPack, key) {
					var isNewPack = true;

					StickerHelper.forEach(oldPacks, function(oldPack) {


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

				if (globalNew == false && Module.Storage.getUsedStickers().length == 0) {
					globalNew = true;
				}
				Module.DOMEventService.changeContentHighlight(globalNew);
				//}


				// *****************************************************************************************************
				// todo: do in other function
				// update used stickers

				var used = Module.Storage.getUsedStickers();

				for (var i = 0; i < used.length; i++) {
					var sticker = this.parseStickerFromText('[[' + used[i].code + ']]');

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

				Module.Storage.setUsedStickers(used);

				// *****************************************************************************************************
			} else {
				Module.DOMEventService.changeContentHighlight(true);
			}

			return newPacks;
		},

		parseStickerFromText: function(text) {
			var outData = {
					isSticker: false,
					url: ''
				},
				matchData = text.match(/\[\[(\S+)_(\S+)\]\]/);

			if (matchData) {
				outData.isSticker = true;
				outData.url = Module.Url.getStickerUrl(matchData[1], matchData[2]);


				outData.pack = matchData[1];
				outData.name = matchData[2];
			}

			return outData;
		},

		onUserMessageSent: function(isSticker) {
			var nowDate = new Date().getTime() / 1000 | 0,
				action = 'send',
				category = 'message',
				label = (isSticker) ? 'sticker' : 'text';


			Module.Api.sendStatistic([{
				action: action,
				category: category,
				label: label,
				time: nowDate
			}]);

			ga('stickerTracker.send', 'event', category, action, label);
		},

		updatePacks: function(successCallback) {

			Module.Api.getPacks(
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

					Module.Storage.setPacks(packs);

					successCallback && successCallback(packs);
				}).bind(this)
			);
		},

		trackUserData: function() {
			if (!Module.Configs.userId || !Module.Configs.userData) {
				return;
			}

			var storedUserData = Module.Storage.getUserData() || {};

			if (!Module.StickerHelper.deepCompare(Module.Configs.userData, storedUserData)) {
				Module.Api.updateUserData(Module.Configs.userData);
				Module.Storage.setUserData(Module.Configs.userData);
			}
		}
	};

})(window.StickersModule);