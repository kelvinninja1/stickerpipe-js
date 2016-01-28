
// todo: move StickersModule --> Stickers
window.StickersModule = {};


window.StickersModule.Libs = {};
//=include libs/**/*.js

window.StickersModule.Service = {};
//=include services/**/*.js

window.StickersModule.Module = {};
//=include modules/**/*.js

window.StickersModule.Configs = {};
//=include configs/**/*.js

window.StickersModule.View = {};
//=include views/**/*.js

(function(Plugin, Module) {

	// todo: rename Stickers --> StickerPipe
	Plugin.Stickers = Module.Libs.Class({

		emojiService: null,
		stickersModel: {},
		view: null,
		storeView: null,

		_constructor: function(config) {

			Module.Service.Helper.setConfig(config);

			// ***** Init Storage ******
			Module.Service.Storage.setPrefix(Module.Configs.storagePrefix);

			// ***** Init Emoji tab *****
			var mobileOS = Module.Service.Helper.getMobileOS();
			if (mobileOS == 'ios' || mobileOS == 'android') {
				config.enableEmojiTab = false;
			}

			// ***** Check ApiKey *****
			if (!Module.Configs.apiKey) {
				throw new Error('Empty apiKey');
			}


			// ***** Init UserId *****
			var savedUserId = Module.Service.Storage.getUserId();

			if (Module.Configs.userId) {
				Module.Configs.userId = Module.Service.Helper.md5(Module.Configs.userId + Module.Configs.apiKey);
				Module.Service.Storage.setUserId(Module.Configs.userId);
			}

			if (Module.Configs.userId != savedUserId) {
				Module.Service.Storage.setUsedStickers([]);
			}

			// ***** Init services ******
			Module.Service.Store.init(this);
			Module.Service.Pack.init(this);

			this.emojiService = new Module.Service.Emoji(Module.Libs.Twemoji);

			Module.Service.PendingRequest.run();
		},

		////////////////////
		//   Functions
		////////////////////

		render: function(onload, elId) {
			Module.Configs.elId = elId || Module.Configs.elId;

			this.view = new Module.View.Popover(this.emojiService);
			this.storeView = new Module.View.Store();

			this.delegateEvents();

			// todo
			//// ***** START *******************************************************************************************

			var callback = onload || null;

			this.fetchPacks((function() {
				// todo: move to initialize (with API v2)
				Module.Service.Base.trackUserData();

				this.view.render(this.stickersModel);

				callback && callback();
			}).bind(this));

			setInterval((function() {
				this.fetchPacks();
			}).bind(this), 1000 * 60 * 60); // hour
		},

		delegateEvents: function() {

			this.view.tabsView.handleClickOnEmojiTab((function() {
				this.view.renderEmojiBlock();
			}).bind(this));

			this.view.tabsView.handleClickOnLastUsedPacksTab((function() {
				this.view.renderUsedStickers();
			}).bind(this));

			this.view.tabsView.handleClickOnStoreTab((function() {
				this.openStore();
			}).bind(this));

			this.view.tabsView.handleClickOnPackTab((function(el) {
				var pack = null,
					packName = el.getAttribute('data-pack-name');

				// todo rename
				var changed = false,
					hasNewContent = false;

				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].pack_name == packName) {

						// set newPack - false
						changed = true;
						this.stickersModel[i].newPack = false;
						Module.Service.Storage.setPacks(this.stickersModel);

						pack = this.stickersModel[i];
					}

					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
					}
				}

				if (changed == true && Module.Service.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Module.Service.Event.changeContentHighlight(false);
				}

				pack && this.view.renderPack(pack);
			}).bind(this));

			this.view.handleClickOnSticker((function(el) {

				var stickerAttribute = el.getAttribute('data-sticker-string'),
					nowDate = new Date().getTime() / 1000|0;

				Module.Service.Api.sendStatistic([{
					action: 'use',
					category: 'sticker',
					label: '[[' + stickerAttribute + ']]',
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split('_')[0], stickerAttribute.split('_')[1], 1);

				Module.Service.Storage.addUsedSticker(stickerAttribute);

				// todo: rewrite
				// new content mark

				var hasNewContent = false;
				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
						break;
					}
				}

				if (Module.Service.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Module.Service.Event.changeContentHighlight(false);
				}
			}).bind(this));

			this.view.handleClickOnEmoji((function(el) {
				var nowDate = new Date().getTime() / 1000| 0,
					emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				Module.Service.Api.sendStatistic([{
					action: 'use',
					category: 'emoji',
					label: emoji,
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'emoji', 'use', emoji);
			}).bind(this));
		},

		fetchPacks: function(callback) {
			Module.Service.Base.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

				if (this.view.isRendered) {
					this.view.tabsView.renderPacks(this.stickersModel);
				}

				callback && callback.apply();
			}).bind(this));
		},

		parseStickerFromText: function(text) {
			return Module.Service.Base.parseStickerFromText(text);
		},

		parseEmojiFromText: function(text) {
			return this.emojiService.parseEmojiFromText(text);
		},

		parseEmojiFromHtml: function(html) {
			return this.emojiService.parseEmojiFromHtml(html);
		},

		onUserMessageSent: function(isSticker) {
			return Module.Service.Base.onUserMessageSent(isSticker);
		},

		purchaseSuccess: function(packName, pricePoint) {
			Module.Service.Store.purchaseSuccess(packName, pricePoint);
		},

		purchaseFail: function() {
			Module.Service.Store.purchaseFail();
		},

		open: function(tabName) {
			this.view.open(tabName);
		},

		close: function() {
			this.view.close();
		},

		openStore: function() {
			this.storeView.renderStore();
		},

		closeStore: function() {
			this.storeView.close();
		},

		////////////////////
		//  Callbacks
		////////////////////

		onClickSticker: function(callback, context) {
			this.view.handleClickOnSticker(function(el) {
				callback.call(context, '[[' + el.getAttribute('data-sticker-string') + ']]');
			});
		},

		onClickEmoji: function(callback, context) {
			this.view.handleClickOnEmoji((function(el) {
				var emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				callback.call(context, emoji);
			}).bind(this));
		},

		onPurchase: function(callback) {
			Module.Service.Store.onPurchaseCallback = callback;
		}
	});

})(window, window.StickersModule);
