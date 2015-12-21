
// todo: move StickersModule --> Stickers
window.StickersModule = {};


window.StickersModule.Utils = {};
//=include utils/**/*.js

window.StickersModule.Service = {};
//=include services/**/*.js

window.StickersModule.Configs = {};
//=include configs/**/*.js

window.StickersModule.View = {};
//=include views/**/*.js

(function(Plugin, Module) {

	// todo: rename Stickers --> StickerPipe
	Plugin.Stickers = Module.Class({

		emojiService: null,
		stickersModel: {},
		view: null,
		storeView: null,

		_constructor: function(config) {

			Module.StickerHelper.setConfig(config);
			Module.Storage.setPrefix(Module.Configs.storagePrefix);

			Module.BaseService.trackUserData();

			Module.Service.Store.init(this);

			this.emojiService = new Module.EmojiService(Module.Twemoji);
		},

		////////////////////
		//   Functions
		////////////////////

		render: function(onload, elId) {
			Module.Configs.elId = elId || Module.Configs.elId;

			this.view = new Module.PopoverView(this.emojiService);
			this.storeView = new Module.StoreView();

			this.delegateEvents();

			// todo
			//// ***** START *******************************************************************************************

			var callback = onload || null;

			var onPacksLoadCallback = (function() {
				this.view.render(this.stickersModel);

				// todo --> active 'used' tab
				this.view.renderUsedStickers();

				callback && callback();
			}).bind(this);

			var storageStickerData = Module.BaseService.getPacksFromStorage();

			if (storageStickerData.actual) {

				this.stickersModel = storageStickerData.packs;

				onPacksLoadCallback.apply();
			} else {
				this.fetchPacks(onPacksLoadCallback);
			}
		},

		delegateEvents: function() {

			this.view.tabsView.handleClickOnEmojiTab((function() {
				this.view.renderEmojiBlock();
			}).bind(this));

			this.view.tabsView.handleClickOnLastUsedPacksTab((function() {
				this.view.renderUsedStickers();
			}).bind(this));

			this.view.tabsView.handleClickOnStoreTab((function() {
				this.storeView.renderStore();
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
						Module.Storage.setPacks(this.stickersModel);

						pack = this.stickersModel[i];
					}

					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
					}
				}

				if (changed == true && Module.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Module.DOMEventService.changeContentHighlight(false);
				}

				pack && this.view.renderPack(pack);
			}).bind(this));

			this.view.handleClickOnSticker((function(el) {

				var stickerAttribute = el.getAttribute('data-sticker-string'),
					nowDate = new Date().getTime() / 1000|0;

				Module.Api.sendStatistic([{
					action: 'use',
					category: 'sticker',
					label: '[[' + stickerAttribute + ']]',
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split('_')[0], stickerAttribute.split('_')[1], 1);

				Module.Storage.addUsedSticker(stickerAttribute);

				// todo: rewrite
				// new content mark

				var hasNewContent = false;
				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
						break;
					}
				}

				if (Module.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Module.DOMEventService.changeContentHighlight(false);
				}
			}).bind(this));

			this.view.handleClickOnEmoji((function(el) {
				var nowDate = new Date().getTime() / 1000| 0,
					emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				Module.Api.sendStatistic([{
					action: 'use',
					category: 'emoji',
					label: emoji,
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'emoji', 'use', emoji);
			}).bind(this));
		},

		fetchPacks: function(callback) {
			Module.BaseService.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

				if (this.view.isRendered) {
					this.view.tabsView.renderPacks(this.stickersModel);
				}

				callback && callback.apply();
			}).bind(this));
		},

		parseStickerFromText: function(text) {
			return Module.BaseService.parseStickerFromText(text);
		},

		parseEmojiFromText: function(text) {
			return this.emojiService.parseEmojiFromText(text);
		},

		parseEmojiFromHtml: function(html) {
			return this.emojiService.parseEmojiFromHtml(html);
		},

		onUserMessageSent: function(isSticker) {
			return Module.BaseService.onUserMessageSent(isSticker);
		},

		purchaseSuccess: function(packName) {
			Module.Service.Store.purchaseSuccess(packName);
		},

		open: function(tabName) {
			this.view.open();

			tabName = tabName || null;
			if (tabName) {
				this.view.tabsView.activeTab(tabName);
			}
		},

		close: function() {
			this.view.close();
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
			Module.Service.Store.setOnPurchaseCallback(callback);
		}
	});

})(window, window.StickersModule);
