
// todo: move StickersModule --> Stickers
window.StickersModule = {};

//=include utils/**/*.js
//=include services/**/*.js
//=include configs/**/*.js
//=include views/**/*.js

(function(Plugin, Module) {

	var helper = Module.StickerHelper;

	// todo: rename Stickers --> StickerPipe
	Plugin.Stickers = Module.Class({

		emojiService: null,
		stickersModel: {},
		view: null,
		storeView: null,

		_constructor: function(config) {

			Module.StickerHelper.setConfig(config);
			Module.Storage.setPrefix(Module.Configs.storagePrefix);

			// todo: remove
			//Plugin.JsApiInterface && Plugin.JsApiInterface._setConfigs(Module.Configs);

			this.emojiService = new Module.EmojiService(Module.Twemoji);
		},

		render: function(onload, elId) {
			Module.Configs.elId = elId || Module.Configs.elId;

			this.view = new Module.PopoverView(this.emojiService);
			this.storeView = new Module.StoreView();

			this.delegateEvents();

			// todo
			//// ***** START *******************************************************************************************

			var callback = onload || null;

			var onPacksLoadCallback = (function() {
				callback && callback();

				this.view.render(this.stickersModel);

				// todo --> active 'used' tab
				this.view.renderUsedStickers(Module.BaseService.getLatestUse());
			}).bind(this);

			var storageStickerData = Module.BaseService.getPacksFromStorage();

			if (storageStickerData.actual) {

				this.stickersModel = storageStickerData.packs;

				onPacksLoadCallback.apply();
			} else {
				this.fetchPacks({
					callback: onPacksLoadCallback
				});
			}
		},

		delegateEvents: function() {

			this.view.tabsView.handleClickOnEmojiTab((function() {
				this.view.renderEmojiBlock();
			}).bind(this));

			this.view.tabsView.handleClickOnLastUsedPacksTab((function() {
				this.view.renderUsedStickers(Module.BaseService.getLatestUse());
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
						Module.BaseService.setPacksToStorage(this.stickersModel);

						pack = this.stickersModel[i];
					}

					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
					}
				}

				if (changed == true && Module.BaseService.getLatestUse().length != 0 && hasNewContent == false) {
					this.resetNewStickersFlag();
				}

				pack && this.view.renderPack(pack);
			}).bind(this));

			this.view.handleClickSticker((function(el) {

				var stickerAttribute = el.getAttribute('data-sticker-string'),
					nowDate = new Date().getTime() / 1000|0;

				Module.Http.post(Module.Configs.trackStatUrl, [{
					action: 'use',
					category: 'sticker',
					label: '[[' + stickerAttribute + ']]',
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split('_')[0], stickerAttribute.split('_')[1], 1);

				Module.BaseService.addToLatestUse(stickerAttribute);

				// todo: rewrite
				// new content mark

				var hasNewContent = false;
				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
						break;
					}
				}

				if (Module.BaseService.getLatestUse().length != 0 && hasNewContent == false) {
					this.resetNewStickersFlag();
				}
			}).bind(this));

			this.view.handleClickEmoji((function(el) {
				var nowDate = new Date().getTime() / 1000| 0,
					emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				Module.Http.post(Module.Configs.trackStatUrl, [{
					action: 'use',
					category: 'emoji',
					label: emoji,
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'emoji', 'use', emoji);
			}).bind(this));
		},

		fetchPacks: function(attrs) {
			Module.BaseService.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

				if(attrs.callback) {
					attrs.callback.apply();
				}
			}).bind(this));
		},

		// todo: rename
		onClickSticker: function(callback, context) {
			this.view.handleClickSticker(function(el) {
				callback.call(context, '[[' + el.getAttribute('data-sticker-string') + ']]');
			});
		},

		// todo: rename or remove
		onClickTab: function(callback, context) {

			this.view.tabsView.handleClickOnPackTab(function(el) {
				callback.call(context, el);
			});

		},

		onClickEmoji: function(callback, context) {
			this.view.handleClickEmoji((function(el) {
				var emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				callback.call(context, emoji);
			}).bind(this));
		},

		getNewStickersFlag: function() {
			return Module.BaseService.getNewStickersFlag(Module.BaseService.getPacksFromStorage().packs || []);
		},

		resetNewStickersFlag: function() {
			return Module.BaseService.resetNewStickersFlag();
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

		// todo rewrite
		renderCurrentTab: function(tabName) {
			var obj = Module.BaseService.getPacksFromStorage();

			//this.start(); // todo

			helper.forEach(obj.packs, (function(pack, key) {

				if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
					this.tabActive = +key;
				}

			}).bind(this));

			//this.stickersModel[this.tabActive].newPack = false;
			//Module.BaseService.setPacksToStorage(this.stickersModel);

			//this._renderAll();
		},

		isNewPack: function(packName) {
			return Module.BaseService.isNewPack(this.stickersModel, packName);
		},

		onUserMessageSent: function(isSticker) {
			return Module.BaseService.onUserMessageSent(isSticker);
		},

		renderPack: function(pack) {
			this.storeView.render(pack);
		},

		purchaseSuccess: function(packName) {
			Module.BaseService.purchaseSuccess(packName);
		}
	});

})(window, window.StickersModule);
