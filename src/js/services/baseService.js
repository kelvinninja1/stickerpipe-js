
// todo: rename file baseService --> BaseService

(function(Module) {

    var StickerHelper = Module.StickerHelper,
		JsApiInterface = Module.StoreApiInterface;

	Module.BaseService = Module.Class({

		config: null,
		storageService: null,

		parseCountStat: 0,
		parseCountWithStickerStat: 0,

		_constructor: function(config) {
			this.config = config;
			this.storageService = new Module.StorageService(this.config.storagePrefix);
		},

		parseStickerStatHandle: function(is_have) {
			var nowDate = new Date().getTime()/1000|0;

			this.parseCountStat++;

			if(is_have) {
				this.parseCountWithStickerStat++;
			}

			if(this.parseCountStat >= 50) {

				StickerHelper.ajaxPost(this.config.trackStatUrl, this.config.apikey, [
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
			this.storageService.addUsedSticker(code);
		},

		// todo: remove function
		getNewStickersFlag: function() {
			return this.storageService.hasNewStickers();
		},

		// todo: remove function
		resetNewStickersFlag: function() {
			Module.DOMEventService.changeNewContentFlag(false);
			return this.storageService.setHasNewStickers(false);
		},

		// todo: remove function
		getLatestUse: function() {
			return this.storageService.getUsedStickers();
		},

		getPacksFromStorage: function() {
			var expireDate = (+new Date()),
				packsObj = this.storageService.getPacks();

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
				this.storageService.setHasNewStickers(globalNew);
				Module.DOMEventService.changeNewContentFlag(globalNew);
				//}
			}

			return newPacks;
		},

		// todo: remove function
		setPacksToStorage: function(packs) {
			return this.storageService.setPacks(packs);
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

			StickerHelper.ajaxGet(options.url, this.config.apikey, callback, options.header);
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

			StickerHelper.ajaxPost(this.config.trackStatUrl, this.config.apikey, [
				{
					action: action,
					category: category,
					label: label,
					time: nowDate
				}
			]);


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

			StickerHelper.ajaxPost(options.url, this.config.apikey, {
				status: status
			}, callback, options.header);
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
				console.error(e.message);
				this.config.callbacks.onPackStoreFail(packName);
			}
		}
	});

})(window.StickersModule);