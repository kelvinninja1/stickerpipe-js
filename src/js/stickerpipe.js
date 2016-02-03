
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

		stickersModel: {},
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
				Plugin.Service.Storage.setUsedStickers([]);
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

		render: function(onload, elId) {
			Plugin.Configs.elId = elId || Plugin.Configs.elId;

			this.view = new Plugin.View.Popover();

			this.delegateEvents();

			// todo
			//// ***** START *******************************************************************************************

			var callback = onload || null;

			this.fetchPacks((function() {
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

				// todo: data-sticker-string --> data-sp-pack & data-sp-sticker
				// todo: add Plugin.Service.Sticker.generateStickerCode(packName, stickerName)

				var stickerAttrs = el.getAttribute('data-sticker-string').split('_');

				Plugin.Service.Statistic.useSticker(stickerAttrs[0], stickerAttrs[1]);
				Plugin.Service.Storage.addUsedSticker(stickerAttrs[0] + '_' + stickerAttrs[1]);

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

			this.view.handleClickOnEmoji(function(el) {
				Plugin.Service.Statistic.useEmoji(
					Plugin.Service.Emoji.parseEmojiFromHtml(el.innerHTML)
				);
			});
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
			return Plugin.Service.Sticker.parse(text);
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

		openStore: function(packName) {
			Plugin.Module.Store.open(packName);
		},

		closeStore: function() {
			Plugin.Module.Store.close();
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
			Plugin.Module.Store.setOnPurchaseCallback(callback);
		}
	});

})(window, window.StickersModule);
