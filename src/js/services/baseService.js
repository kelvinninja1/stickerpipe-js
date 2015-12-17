
// todo: rename file baseService --> BaseService

(function(Module) {

    var StickerHelper = Module.StickerHelper,
		JsApiInterface = Module.StoreApiInterface;

	Module.BaseService = {

		// todo: remove function
		addToLatestUse: function(code) {
			Module.Storage.addUsedSticker(code);
		},

		// todo: remove function
		getNewStickersFlag: function() {
			return Module.Storage.hasNewStickers();
		},

		// todo: remove function
		resetNewStickersFlag: function() {
			Module.DOMEventService.changeContentHighlight(false);
			return Module.Storage.setHasNewStickers(false);
		},

		// todo: remove function
		getLatestUse: function() {
			return Module.Storage.getUsedStickers();
		},

		getPacksFromStorage: function() {
			var expireDate = (+new Date()),
				packsObj = Module.Storage.getPacks();

			if(typeof packsObj === "undefined"
				|| packsObj.expireDate < expireDate
				|| Module.Configs.debug
			) {

				return {
					actual: false,
					packs: typeof packsObj == "object" && packsObj.packs ? packsObj.packs : []
				};
			} else {

				return {
					actual: true,
					packs: packsObj.packs
				};
			}
		},

		markNewPacks: function(oldPacks, newPacks) {
			var globalNew = false;

			if(oldPacks.length != 0){

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

				if (globalNew == false && this.getLatestUse().length == 0) {
					globalNew = true;
				}
				Module.Storage.setHasNewStickers(globalNew);
				Module.DOMEventService.changeContentHighlight(globalNew);
				//}


				// *****************************************************************************************************
				// todo: do in other function
				// update used stickers

				var used = this.getLatestUse();

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

		// todo: remove function
		setPacksToStorage: function(packs) {
			return Module.Storage.setPacks(packs);
		},

		getPacksFromServer: function(callback) {

			var options = {
				url: Module.Configs.clientPacksUrl,
				header: []
			};

			if (Module.Configs.userId !== null) {
				options.url = Module.Configs.userPacksUrl;
				options.header['UserId'] = StickerHelper.md5(Module.Configs.userId + Module.Configs.apikey);
			}

			Module.Http.get(options.url, {
				success: callback
			}, options.header);
		},

		parseStickerFromText: function(text) {
			var outData = {
					isSticker: false,
					url: ''
				},
				matchData = text.match(/\[\[(\S+)_(\S+)\]\]/);

			if (matchData) {
				outData.isSticker = true;
				outData.url = Module.Configs.domain +
					'/' +
					Module.Configs.baseFolder +
					'/' + matchData[1] +
					'/' + matchData[2] +
					'_' + Module.Configs.stickerResolutionType +
					'.png';


				outData.pack = matchData[1];
				outData.name = matchData[2];
			}

			return outData;
		},

		isNewPack: function(packs, packName)  {
			var isNew = false;

			StickerHelper.forEach(packs, function(pack) {

				if(pack.pack_name &&
					pack.pack_name.toLowerCase() == packName.toLowerCase()) {

					isNew = !!pack.newPack;
				}

			});

			return isNew;

		},

		onUserMessageSent: function(isSticker) {
			var nowDate = new Date().getTime() / 1000 | 0,
				action = 'send',
				category = 'message',
				label = (isSticker) ? 'sticker' : 'text';


			Module.Http.post(Module.Configs.trackStatUrl, [{
				action: action,
				category: category,
				label: label,
				time: nowDate
			}]);

			ga('stickerTracker.send', 'event', category, action, label);
		},

		isExistPackInStorage: function(packName) {
			var packs = this.getPacksFromStorage()['packs'];

			for (var i = 0; i < packs.length; i++) {
				if (packs[i].pack_name == packName) {
					return true;
				}
			}

			return false;
		},

		updatePacks: function(successCallback) {
			var storageStickerData;

			storageStickerData = this.getPacksFromStorage();

			this.getPacksFromServer(
				(function(response) {
					if(response.status != 'success') {
						return;
					}

					var stickerPacks = response.data;

					stickerPacks = this.markNewPacks(storageStickerData.packs, stickerPacks);
					this.setPacksToStorage(stickerPacks);

					successCallback && successCallback(stickerPacks);
				}).bind(this)
			);
		},

		changeUserPackStatus: function(packName, status, callback) {
			var options = {
				url: Module.Configs.userPackUrl + '/' + packName,
				header: {
					UserId: StickerHelper.md5(Module.Configs.userId + Module.Configs.apikey)
				}
			};

			// todo: rewrite callback
			Module.Http.post(options.url, {
				status: status
			}, {
				success: callback
			}, options.header);
		},

		purchaseSuccess: function(packName) {
			try {
				var handler = function() {
					if (!JsApiInterface) {
						throw new Error('JSApiInterface not found!');
					}

					JsApiInterface.downloadPack(packName, function() {
						Module.Configs.callbacks.onPackStoreSuccess(packName);
					});
				};

				if (Module.Configs.userId !== null) {
					this.changeUserPackStatus(packName, true, handler);
				} else {
					handler();
				}
			} catch(e) {
				console && console.error(e.message);
				Module.Configs.callbacks.onPackStoreFail(packName);
			}
		}
	};

})(window.StickersModule);