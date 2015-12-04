
// todo: rename file baseService --> BaseService

(function(Module) {

    var StickerHelper = Module.StickerHelper,
		JsApiInterface = Module.StoreApiInterface;

	Module.BaseService = Module.Class({

		config: null,

		parseCountStat: 0,
		parseCountWithStickerStat: 0,

		_constructor: function(config) {
			this.config = config;
		},

		parseStickerStatHandle: function(is_have) {
			var nowDate = new Date().getTime()/1000|0;

			this.parseCountStat++;

			if(is_have) {
				this.parseCountWithStickerStat++;
			}

			if(this.parseCountStat >= 50) {

				Module.Http.post(this.config.trackStatUrl, [
					{
						action: 'check',
						category: 'message',
						label: 'Events count',
						time: nowDate,
						value: this.parseCountStat

					},
					{
						action: 'check',
						category: 'message',
						label: 'Stickers count',
						time: nowDate,
						value: this.parseCountWithStickerStat
					}

				]);

				ga('stickerTracker.send', 'event', 'message', 'check', 'Events count', this.parseCountStat);
				ga('stickerTracker.send', 'event', 'message', 'check', 'Stickers count', this.parseCountWithStickerStat);

				this.parseCountWithStickerStat = 0;
				this.parseCountStat = 0;

			}

			},

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
				|| this.config.debug
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
				url: this.config.clientPacksUrl,
				header: []
			};

			if (this.config.userId !== null) {
				options.url = this.config.userPacksUrl;
				options.header['UserId'] = StickerHelper.md5(this.config.userId + this.config.apikey);
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

			this.parseStickerStatHandle(!!matchData);

			if (matchData) {
				outData.isSticker = true;
				outData.url = this.config.domain +
					'/' +
					this.config.baseFolder +
					'/' + matchData[1] +
					'/' + matchData[2] +
					'_' + this.config.stickerResolutionType +
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


			Module.Http.post(this.config.trackStatUrl, [{
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
				url: this.config.userPackUrl + '/' + packName,
				header: {
					UserId: StickerHelper.md5(this.config.userId + this.config.apikey)
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
			var self = this;

			try {
				var handler = function() {
					if (!JsApiInterface) {
						throw new Error('JSApiInterface not found!');
					}

					JsApiInterface.downloadPack(packName, function() {
						self.config.callbacks.onPackStoreSuccess(packName);
					});
				};

				if (this.config.userId !== null) {
					this.changeUserPackStatus(packName, true, handler);
				} else {
					handler();
				}
			} catch(e) {
				// todo: check console
				console.error(e.message);
				this.config.callbacks.onPackStoreFail(packName);
			}
		}
	});

})(window.StickersModule);