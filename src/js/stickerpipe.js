
//=include modules/analytics.js
//=include modules/config_base.js
//=include modules/class.js
//=include modules/Lockr.js
//=include modules/md5.js
//=include modules/helper.js
//=include modules/tabs/tabsView.js
//=include modules/tabs/tabsController.js
//=include modules/base/baseController.js
//=include modules/base/baseService.js
//=include modules/base/baseView.js
//=include modules/JsApiInterface.js

(function(Plugin, Modules) {

	var helper = Modules.StickerHelper;

    function Stickers(configObj) {

		this.init = function() {
			this.initConfigs(configObj);

			this.stService = new Modules.BaseService(this.config);
			this.stView = new Modules.BaseView(this.config, this.stService);
			this.stController = new Modules.BaseController(this.config);
			this.stickersModel = {};
			this.tabActive = 0;

			Plugin.JsApiInterface && Plugin.JsApiInterface._setConfigs(this.config);
		};

		this.initConfigs = function(configObj) {
			this.config = helper.mergeOptions(Modules.Config, configObj);
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
		};

        this._renderAll = function() {

			this.stView.renderTabs(this.stickersModel, this.tabActive);

			switch (this.tabActive) {
				case this.stView.tabsController.view.controlTabs.custom.number:
					this.stView.renderCustomBlock();
					break;
				case this.stView.tabsController.view.controlTabs.history.number:
					this.stView.renderUseStickers(this.stService.getLatestUse(), this.config.stickerItemClass);
					break;
				case this.stView.tabsController.view.controlTabs.settings.number:
					console.log('click on settings tab');
					break;
				case this.stView.tabsController.view.controlTabs.store.number:
					console.log('click on store tab');
					break;
				case this.stView.tabsController.view.controlTabs.nextPacks.number:
					console.log('click on nextPacks tab');
					break;
				case this.stView.tabsController.view.controlTabs.prevPacks.number:
					console.log('click on prevPacks tab');
					break;
				default:
					this.stView.renderStickers(this.stickersModel, this.tabActive, this.config.stickerItemClass);
					break;
			}
        };

        this._init = function() {

            this._renderAll();

			this.stView.tabsController.handleClickTab(this.stView.tabsEl, this.config.tabItemClass, (function(el) {
				switch(+el.getAttribute('data-tab-number')) {
					case this.stView.tabsController.view.controlTabs.settings.number:
					case this.stView.tabsController.view.controlTabs.store.number:
					case this.stView.tabsController.view.controlTabs.nextPacks.number:
					case this.stView.tabsController.view.controlTabs.prevPacks.number:
						return;
						break;
					default:
						break;
				}

				this.tabActive = +el.getAttribute('data-tab-number');

                if(this.tabActive >= 0) this.stickersModel[this.tabActive].newPack = false;
				this.stService.setPacksToStorage(this.stickersModel);

                this._renderAll();
            }).bind(this));

			this.stController.handleClickSticker(this.stView.stickersEl, this.config.stickerItemClass, (function(el) {

                var stickerAttribute = el.getAttribute('data-sticker-string'),
                    nowDate = new Date().getTime()/1000|0;


				helper.ajaxPost(this.config.trackStatUrl, this.config.apikey, [
                    {
                        action: 'use',
                        category: 'sticker',
                        label: '[[' + stickerAttribute + ']]',
                        time: nowDate
                    }

                ]);

                ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split("_")[0], stickerAttribute.split("_")[1], 1);

				this.stService.addToLatestUse(stickerAttribute);
                this._renderAll();

            }).bind(this));

        };

        this.fetchPacks = function(attrs) {
			this.stService.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

                if(!attrs.onlyFetch){
                    this._init();
                }


                if(attrs.callback) attrs.callback.apply();
            }).bind(this));
        };

        this.start = function(callback) {
            var storageStickerData;

			//this.tabActive = this.stView.controlTabs.history.number;
			this.tabActive = this.stView.tabsController.view.controlTabs.history.number;

            storageStickerData =  this.stService.getPacksFromStorage();

			this.stView.render(this.config.elId);

            if(storageStickerData.actual) {

				this.stickersModel = storageStickerData.packs;
                this._init();

                if(callback) callback.apply();
            } else {

                this.fetchPacks({
                    callback: callback
                });
            }


        };

        this.onClickSticker = function(callback, context) {

			this.stController.handleClickSticker(this.stView.stickersEl, this.config.stickerItemClass, function(el) {
                callback.call(context, '[[' + el.getAttribute('data-sticker-string') + ']]');
            });

        };

        this.onClickCustomTab = function(callback, context) {

			this.stView.tabsController.handleClickTab(this.stView.tabsEl, this.config.tabItemClass, function(el) {

                if (el.getAttribute('id') == 'spTabCustom' ) {
                    callback.call(context, el);
                }

            });

        };

        this.onClickTab = function(callback, context) {

			this.stView.tabsController.handleClickTab(this.stView.tabsEl, this.config.tabItemClass, function(el) {
                callback.call(context, el);
            });

        };

        this.getNewStickersFlag = function() {
            return this.stService.getNewStickersFlag(this.stService.getPacksFromStorage().packs || []);
        };

        this.resetNewStickersFlag = function() {
            return this.stService.resetNewStickersFlag();
        };

        this.parseStickerFromText = function(text) {
            return this.stService.parseStickerFromText(text);
        };

        this.renderCurrentTab = function(tabName) {
            var obj = this.stService.getPacksFromStorage();

            //this.start(); // todo

			helper.forEach(obj.packs, (function(pack, key) {

                if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
					this.tabActive = +key;
                }

            }).bind(this));

            //this.stickersModel[this.tabActive].newPack = false;
            //this.stService.setPacksToStorage(this.stickersModel);

            this._renderAll();
        };

        this.isNewPack = function(packName) {
            return this.stService.isNewPack(this.stickersModel, packName);
        };

        this.onUserMessageSent = function(isSticker) {
            return this.stService.onUserMessageSent(isSticker);
        };

        this.renderPack = function(pack) {
			this.stView.renderStorePack(pack);
        };

        this.purchaseSuccess = function(packName) {
			this.stService.purchaseSuccess(packName);
        };

		this.init();
    }

    Plugin.Stickers = Stickers;

})(window, StickersModule);
