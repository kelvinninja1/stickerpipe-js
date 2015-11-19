
//=include modules/analytics.js
//=include modules/config_base.js
//=include modules/class.js
//=include modules/Lockr.js
//=include modules/md5.js
//=include modules/helper.js
//=include modules/tabs/tabsView.js
//=include modules/base/baseService.js
//=include modules/base/baseView.js
//=include modules/JsApiInterface.js

(function(Plugin, Modules) {

	var helper = Modules.StickerHelper;

	Plugin.Stickers = Modules.Class({

		_constructor: function(config) {
			this.config = helper.mergeOptions(Modules.Config, config);

			this.configResolution();

			this.stService = new Modules.BaseService(this.config);
			this.stickersModel = {};
			this.stView = new Modules.BaseView(this.config, this.stService);

			Plugin.JsApiInterface && Plugin.JsApiInterface._setConfigs(this.config);

			this.delegateEvents();
		},

		delegateEvents: function() {

			this.stView.tabsView.handleClickOnCustomTab((function() {
				this.stView.renderCustomBlock();
			}).bind(this));

			this.stView.tabsView.handleClickOnLastUsedPacksTab((function() {
				this.stView.renderUseStickers(this.stService.getLatestUse());
			}).bind(this));

			this.stView.tabsView.handleClickOnPackTab((function(el) {
				var pack = null,
					packName = el.getAttribute('data-pack-name');

				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].pack_name == packName) {

						// set newPack - false
						this.stickersModel[i].newPack = false;
						this.stService.setPacksToStorage(this.stickersModel);

						pack = this.stickersModel[i];

						break;
					}
				}

				pack && this.stView.renderStickers(pack);
			}).bind(this));

			this.stView.handleClickSticker((function(el) {

				var stickerAttribute = el.getAttribute('data-sticker-string'),
					nowDate = new Date().getTime() / 1000|0;


				helper.ajaxPost(this.config.trackStatUrl, this.config.apikey, [{
					action: 'use',
					category: 'sticker',
					label: '[[' + stickerAttribute + ']]',
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split('_')[0], stickerAttribute.split('_')[1], 1);

				this.stService.addToLatestUse(stickerAttribute);
			}).bind(this));
		},

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

		start: function(callback) {
			var onPacksLoadCallback = (function() {
				callback && callback();

				this.stView.render(this.stickersModel);
				this.stView.renderUseStickers(this.stService.getLatestUse());
			}).bind(this);

			var storageStickerData =  this.stService.getPacksFromStorage();

			if (storageStickerData.actual) {

				this.stickersModel = storageStickerData.packs;

				onPacksLoadCallback.apply();
			} else {

				this.fetchPacks({
					callback: onPacksLoadCallback
				});
			}

		},

		fetchPacks: function(attrs) {
			this.stService.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

				if(attrs.callback) {
					attrs.callback.apply();
				}
			}).bind(this));
		},

		onClickSticker: function(callback, context) {

			this.stView.handleClickSticker(function(el) {
				callback.call(context, '[[' + el.getAttribute('data-sticker-string') + ']]');
			});

		},

		onClickCustomTab: function(callback, context) {
			this.stView.tabsView.handleClickOnCustomTab((function(el) {
				callback.call(context, el);
			}).bind(this));
		},

		onClickTab: function(callback, context) {

			this.stView.tabsView.handleClickOnPackTab(function(el) {
				callback.call(context, el);
			});

		},

		getNewStickersFlag: function() {
			return this.stService.getNewStickersFlag(this.stService.getPacksFromStorage().packs || []);
		},

		resetNewStickersFlag: function() {
			return this.stService.resetNewStickersFlag();
		},

		parseStickerFromText: function(text) {
			return this.stService.parseStickerFromText(text);
		},

		// todo
		renderCurrentTab: function(tabName) {
			var obj = this.stService.getPacksFromStorage();

			//this.start(); // todo

			helper.forEach(obj.packs, (function(pack, key) {

				if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
					this.tabActive = +key;
				}

			}).bind(this));

			//this.stickersModel[this.tabActive].newPack = false;
			//this.stService.setPacksToStorage(this.stickersModel);

			//this._renderAll();
		},

		isNewPack: function(packName) {
			return this.stService.isNewPack(this.stickersModel, packName);
		},

		onUserMessageSent: function(isSticker) {
			return this.stService.onUserMessageSent(isSticker);
		},

		renderPack: function(pack) {
			this.stView.renderStorePack(pack);
		},

		purchaseSuccess: function(packName) {
			this.stService.purchaseSuccess(packName);
		}
	});

})(window, StickersModule);
