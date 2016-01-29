
// todo: move StickersModule --> Stickers
window.StickersModule = {};


window.StickersModule.Libs = {};
//=include libs/**/*.js

window.StickersModule.Service = {};
//=include services/**/*.js

window.StickersModule.Module = {
	Store: function() {
		var module = window.StickersModule.Module.Store.__Module__;
		module.init && module.init.apply(module, arguments);
		return module;
	},
	Modal: {}
};
//=include modules/**/*.js

window.StickersModule.Configs = {};
//=include configs/**/*.js

window.StickersModule.View = {};
//=include views/**/*.js

(function(window, Plugin) {

	// todo: rename Stickers --> StickerPipe
	window.Stickers = Plugin.Libs.Class({

		stickersModel: {},
		view: null,
		store: null,

		_constructor: function(config) {

			Plugin.Service.Helper.setConfig(config);

			// ***** Init Storage ******
			Plugin.Service.Storage.setPrefix(Plugin.Configs.storagePrefix);

			// ***** Init Emoji tab *****
			var mobileOS = Plugin.Service.Helper.getMobileOS();
			if (mobileOS == 'ios' || mobileOS == 'android') {
				config.enableEmojiTab = false;
			}

			// ***** Check ApiKey *****
			if (!Plugin.Configs.apiKey) {
				throw new Error('Empty apiKey');
			}

			// ***** Init UserId *****
			var savedUserId = Plugin.Service.Storage.getUserId();

			if (Plugin.Configs.userId) {
				Plugin.Configs.userId = Plugin.Service.Helper.md5(Plugin.Configs.userId + Plugin.Configs.apiKey);
				Plugin.Service.Storage.setUserId(Plugin.Configs.userId);
			}

			if (Plugin.Configs.userId != savedUserId) {
				Plugin.Service.Storage.setUsedStickers([]);
			}

			// ***** Init store *****
			this.store = new Plugin.Module.Store(this);

			// ***** Init services ******
			Plugin.Service.Pack.init(this);
			Plugin.Service.Emoji.init(Plugin.Libs.Twemoji);
			Plugin.Service.PendingRequest.init();
		},

		////////////////////
		//   Functions
		////////////////////

		render: function(onload, elId) {
			Plugin.Configs.elId = elId || Plugin.Configs.elId;

			this.view = new Plugin.View.Popover();

			this.delegateEvents();

			// todo
			//// ***** START *******************************************************************************************

			var callback = onload || null;

			this.fetchPacks((function() {
				// todo: move to initialize (with API v2)
				Plugin.Service.Base.trackUserData();

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
						Plugin.Service.Storage.setPacks(this.stickersModel);

						pack = this.stickersModel[i];
					}

					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
					}
				}

				if (changed == true && Plugin.Service.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Plugin.Service.Event.changeContentHighlight(false);
				}

				pack && this.view.renderPack(pack);
			}).bind(this));

			this.view.handleClickOnSticker((function(el) {

				var stickerAttribute = el.getAttribute('data-sticker-string'),
					nowDate = new Date().getTime() / 1000|0;

				Plugin.Service.Api.sendStatistic([{
					action: 'use',
					category: 'sticker',
					label: '[[' + stickerAttribute + ']]',
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split('_')[0], stickerAttribute.split('_')[1], 1);

				Plugin.Service.Storage.addUsedSticker(stickerAttribute);

				// todo: rewrite
				// new content mark

				var hasNewContent = false;
				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
						break;
					}
				}

				if (Plugin.Service.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Plugin.Service.Event.changeContentHighlight(false);
				}
			}).bind(this));

			this.view.handleClickOnEmoji((function(el) {
				var nowDate = new Date().getTime() / 1000| 0,
					emoji = this.parseEmojiFromHtml(el.innerHTML);

				Plugin.Service.Api.sendStatistic([{
					action: 'use',
					category: 'emoji',
					label: emoji,
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'emoji', 'use', emoji);
			}).bind(this));
		},

		fetchPacks: function(callback) {
			Plugin.Service.Base.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

				if (this.view.isRendered) {
					this.view.tabsView.renderPacks(this.stickersModel);
				}

				callback && callback.apply();
			}).bind(this));
		},

		parseStickerFromText: function(text) {
			return Plugin.Service.Base.parseStickerFromText(text);
		},

		parseEmojiFromText: function(text) {
			return Plugin.Service.Emoji.parseEmojiFromText(text);
		},

		parseEmojiFromHtml: function(html) {
			return Plugin.Service.Emoji.parseEmojiFromHtml(html);
		},

		onUserMessageSent: function(isSticker) {
			return Plugin.Service.Base.onUserMessageSent(isSticker);
		},

		purchaseSuccess: function(packName, pricePoint) {
			this.store.purchaseSuccess(packName, pricePoint);
		},

		purchaseFail: function() {
			this.store.purchaseFail();
		},

		open: function(tabName) {
			this.view.open(tabName);
		},

		close: function() {
			this.view.close();
		},

		openStore: function(packName) {
			this.store.open(packName);
		},

		closeStore: function() {
			this.store.close();
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
				var emoji = this.parseEmojiFromHtml(el.innerHTML);

				callback.call(context, emoji);
			}).bind(this));
		},

		onPurchase: function(callback) {
			this.store.setOnPurchaseCallback(callback);
		}
	});

})(window, window.StickersModule);
