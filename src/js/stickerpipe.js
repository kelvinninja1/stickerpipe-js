
// todo: move StickersModule --> Stickers
window.StickersModule = {};


window.StickersModule.Libs = {};
//=include libs/**/*.js

window.StickersModule.Service = {};
//=include services/**/*.js

window.StickersModule.Configs = {};
//=include configs/**/*.js

/////////////////////////////////////////////////////////////
// Load modules
/////////////////////////////////////////////////////////////
window.StickersModule.Module = {};

//=include modules/store/Store.js
//=include modules/store/src/**/*.js

//=include modules/modal/Modal.js

/////////////////////////////////////////////////////////////

window.StickersModule.View = {};
//=include views/**/*.js

(function(window, Plugin) {

	// todo: rename Stickers --> StickerPipe
	window.Stickers = Plugin.Libs.Class({

		view: null,

		_constructor: function(config) {

			Plugin.Service.Helper.setConfig(config);

			// ***** Init Storage ******
			Plugin.Service.Storage.setPrefix(Plugin.Configs.storagePrefix);

			// ***** Init Emoji tab *****
			var mobileOS = Plugin.Service.Helper.getMobileOS();
			if (mobileOS == 'ios' || mobileOS == 'android') {
				config.enableEmojiTab = false;
			}

			// ***** Check required params *****
			if (!Plugin.Configs.apiKey || !Plugin.Configs.userId) {
				throw new Error('Empty one of required data [apiKey, userId]');
			}

			// ***** Init UserId *****
			Plugin.Configs.userId = Plugin.Service.Helper.md5(Plugin.Configs.userId + Plugin.Configs.apiKey);

			if (Plugin.Configs.userId != Plugin.Service.Storage.getUserId()) {
				Plugin.Service.Storage.setRecentStickers([]);
			}

			Plugin.Service.Storage.setUserId(Plugin.Configs.userId);

			// ***** Init store *****
			Plugin.Module.Store.init(this);

			// ***** Init services ******
			Plugin.Service.User.init();
			Plugin.Service.Pack.init(this);
			Plugin.Service.Emoji.init(Plugin.Libs.Twemoji);
			Plugin.Service.PendingRequest.init();
		},

		////////////////////
		//   Functions
		////////////////////

		render: function(callback) {
			var self = this;

			this.view = new Plugin.View.Popover();

			this.delegateEvents();

			// todo
			Plugin.Service.Pack.fetchPacks(function() {
				self.view.render();

				callback && callback();
			});

			setInterval(function() {
				Plugin.Service.Pack.fetchPacks();
			}, 1000 * 60 * 60);
		},

		delegateEvents: function() {
			var self = this;

			this.view.tabsView.handleClickOnEmojiTab(function() {
				self.view.renderEmojiBlock();
			});

			this.view.tabsView.handleClickOnRecentTab(function() {
				self.view.renderRecentStickers();
			});

			this.view.tabsView.handleClickOnStoreTab(function() {
				Plugin.Module.Store.open();
			});

			this.view.tabsView.handleClickOnPackTab(function(el) {
				var packName = el.getAttribute('data-pack-name'),
					pack = Plugin.Service.Storage.getPack(packName);

				if (pack) {
					pack.isUnwatched = false;
					Plugin.Service.Storage.setPack(packName, pack);
					self.view.renderPack(pack);
				}

				Plugin.Service.Pack.checkHighlight();
			});

			this.view.handleClickOnSticker(function(el) {

				var stickerId = el.getAttribute('data-sticker-id');

				Plugin.Service.Statistic.useSticker(stickerId);
				Plugin.Service.Storage.addRecentSticker(stickerId);

				Plugin.Service.Pack.checkHighlight();
			});

			this.view.handleClickOnEmoji(function(el) {
				var emoji = Plugin.Service.Emoji.parseEmojiFromHtml(el.innerHTML);
				Plugin.Service.Statistic.useEmoji(emoji);
			});
		},

		fetchPacks: function(callback) {
			Plugin.Service.Pack.fetchPacks(callback);
		},

		parseStickerFromText: function(text, callback) {
			return Plugin.Service.Sticker.parse(text, callback);
		},

		parseEmojiFromText: function(text) {
			return Plugin.Service.Emoji.parseEmojiFromText(text);
		},

		parseEmojiFromHtml: function(html) {
			return Plugin.Service.Emoji.parseEmojiFromHtml(html);
		},

		onUserMessageSent: function(isSticker) {
			Plugin.Service.Statistic.messageSend(isSticker);
		},

		purchaseSuccess: function(packName, pricePoint) {
			Plugin.Module.Store.purchaseSuccess(packName, pricePoint);
		},

		purchaseFail: function() {
			Plugin.Module.Store.purchaseFail();
		},

		open: function(tabName) {
			this.view.open(tabName);
		},

		close: function() {
			this.view.close();
		},

		openStore: function(contentId) {
			Plugin.Module.Store.open(contentId);
		},

		closeStore: function() {
			Plugin.Module.Store.close();
		},

		md5: function(string) {
			return Plugin.Service.Helper.md5(string);
		},

		////////////////////
		//  Callbacks
		////////////////////

		onClickSticker: function(callback, context) {
			this.view.handleClickOnSticker(function(el) {
				callback.call(context, '[[' + el.getAttribute('data-sticker-id') + ']]');
			});
		},

		onClickEmoji: function(callback, context) {
			this.view.handleClickOnEmoji((function(el) {
				var emoji = this.parseEmojiFromHtml(el.innerHTML);

				callback.call(context, emoji);
			}).bind(this));
		},

		onPurchase: function(callback) {
			Plugin.Module.Store.setOnPurchaseCallback(callback);
		}
	});

})(window, window.StickersModule);
