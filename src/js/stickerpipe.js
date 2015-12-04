
// todo: move StickersModule --> Stickers
window.StickersModule = {};

//=include utils/**/*.js
//=include configs/**/*.js
//=include services/**/*.js
//=include views/**/*.js

(function(Plugin, Module) {

	var helper = Module.StickerHelper;

	// todo: rename Stickers --> StickerPipe
	Plugin.Stickers = Module.Class({

		config: null,
		baseService: null,
		emojiService: null,
		stickersModel: {},
		view: null,
		storeView: null,

		_constructor: function(config) {

			Module.Configs.add(config);

			this.config = Module.Configs.getAll();

			// todo: move to Configs class
			this.configResolution();

			// todo: rename
			this.baseService = new Module.BaseService(this.config);
			this.emojiService = new Module.EmojiService(Module.Twemoji);

			this.view = new Module.PopoverView(this.config, this.baseService, this.emojiService);
			this.storeView = new Module.StoreView(this.config);

			// todo: remove
			Plugin.JsApiInterface && Plugin.JsApiInterface._setConfigs(this.config);

			this.delegateEvents();


			// todo
			//// ***** START *******************************************************************************************

			var callback = this.config.onload || null;

			var onPacksLoadCallback = (function() {
				callback && callback();

				this.view.render(this.stickersModel);

				// todo --> active 'used' tab
				this.view.renderUsedStickers(this.baseService.getLatestUse());
			}).bind(this);

			var storageStickerData = this.baseService.getPacksFromStorage();

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
				this.view.renderUsedStickers(this.baseService.getLatestUse());
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
						this.baseService.setPacksToStorage(this.stickersModel);

						pack = this.stickersModel[i];
					}

					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
					}
				}

				if (changed == true && this.baseService.getLatestUse().length != 0 && hasNewContent == false) {
					this.resetNewStickersFlag();
				}

				pack && this.view.renderPack(pack);
			}).bind(this));

			this.view.handleClickSticker((function(el) {

				var stickerAttribute = el.getAttribute('data-sticker-string'),
					nowDate = new Date().getTime() / 1000|0;

				Module.Http.post(this.config.trackStatUrl, [{
					action: 'use',
					category: 'sticker',
					label: '[[' + stickerAttribute + ']]',
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split('_')[0], stickerAttribute.split('_')[1], 1);

				this.baseService.addToLatestUse(stickerAttribute);

				// todo: rewrite
				// new content mark

				var hasNewContent = false;
				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
						break;
					}
				}

				if (this.baseService.getLatestUse().length != 0 && hasNewContent == false) {
					this.resetNewStickersFlag();
				}
			}).bind(this));

			this.view.handleClickEmoji((function(el) {
				var nowDate = new Date().getTime() / 1000| 0,
					emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				Module.Http.post(this.config.trackStatUrl, [{
					action: 'use',
					category: 'emoji',
					label: emoji,
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'emoji', 'use', emoji);
			}).bind(this));
		},

		// todo: remove function
		configResolution: function() {
			this.config = helper.mergeOptions(this.config, {
				stickerResolutionType : 'mdpi',
				tabResolutionType: 'hdpi'
			});

			if (window.devicePixelRatio == 2) {
				this.config = helper.mergeOptions(this.config, {
					stickerResolutionType : 'xhdpi',
					tabResolutionType: 'xxhdpi'
				});
			}
		},

		fetchPacks: function(attrs) {
			this.baseService.updatePacks((function(stickerPacks) {
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
			return this.baseService.getNewStickersFlag(this.baseService.getPacksFromStorage().packs || []);
		},

		resetNewStickersFlag: function() {
			return this.baseService.resetNewStickersFlag();
		},

		parseStickerFromText: function(text) {
			return this.baseService.parseStickerFromText(text);
		},

		parseEmojiFromText: function(text) {
			return this.emojiService.parseEmojiFromText(text);
		},

		parseEmojiFromHtml: function(html) {
			return this.emojiService.parseEmojiFromHtml(html);
		},

		// todo rewrite
		renderCurrentTab: function(tabName) {
			var obj = this.baseService.getPacksFromStorage();

			//this.start(); // todo

			helper.forEach(obj.packs, (function(pack, key) {

				if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
					this.tabActive = +key;
				}

			}).bind(this));

			//this.stickersModel[this.tabActive].newPack = false;
			//this.baseService.setPacksToStorage(this.stickersModel);

			//this._renderAll();
		},

		isNewPack: function(packName) {
			return this.baseService.isNewPack(this.stickersModel, packName);
		},

		onUserMessageSent: function(isSticker) {
			return this.baseService.onUserMessageSent(isSticker);
		},

		renderPack: function(pack) {
			this.storeView.render(pack);
		},

		purchaseSuccess: function(packName) {
			this.baseService.purchaseSuccess(packName);
		}
	});

})(window, window.StickersModule);
