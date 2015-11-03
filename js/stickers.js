

//include: "analytics.js"
//include: "config_base.js"
//include: "Lockr.js"
//include: "md5.js"
//include: "helper.js"
//include: "controller_base.js"
//include: "service_base.js"
//include: "view_base.js"

(function(Plugin, _module) {

    function Stickers(configObj) {

        var Config = _module.StickerHelper.mergeOptions(_module.Config, configObj);
            stService = new _module.BaseService(Config),
            stView = new _module.BaseView(Config),
            stController = new _module.BaseController(Config),
            configObj = configObj || {},
            stickersModel = {},
            tabActive = 0;


        var _renderAll = function() {
            
            stView.renderTabs(stickersModel, tabActive, Config.tabContainerId, Config.tabItemClass);

            if(tabActive == -1) {
                stView.renderUseStickers(stService.getLatestUse(), Config.stickersContainerId, Config.stickerItemClass);
            } else if (tabActive == -2) {
                stView.hideBlock(Config.stickersContainerId);
            } else {
                stView.renderStickers(stickersModel, tabActive, Config.stickersContainerId, Config.stickerItemClass);
            }

        };

        var  _init = function() {

            _renderAll();

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {
                tabActive = +el.getAttribute("data-tab-number");

                if(tabActive >= 0) stickersModel[tabActive].newPack = false;
                stService.setPacksToStorage(stickersModel);

                _renderAll();
            });

            stController.handleClickSticker(Config.stickersContainerId, Config.stickerItemClass, function(el) {
                var stickerAttribute = el.getAttribute("data-sticker-string"),
                    nowDate = new Date().getTime()/1000|0;


                _module.StickerHelper.ajaxPost(Config.trackStatUrl, Config.apikey, [
                    {
                        action: 'use',
                        category: 'sticker',
                        label: "[[" + stickerAttribute + "]]",
                        time: nowDate
                    }

                ]);

                ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split("_")[0], stickerAttribute.split("_")[1], 1);

                stService.addToLatestUse(stickerAttribute)
                _renderAll();

            });

        };

        this.fetchPacks = function(attrs) {
            var storageStickerData;

            storageStickerData =  stService.getPacksFromStorage();

            stService.getPacksFromServer(
                function(response) {
                    if(response.status == 'success') {
                        var stickerPacks = response.data;

                        stickerPacks = stService.markNewPacks(storageStickerData.packs, stickerPacks);
                        stService.setPacksToStorage(stickerPacks);

                        stickersModel = stickerPacks;

                        if(!attrs.onlyFetch){
                            _init();
                        }


                        if(attrs.callback) attrs.callback.apply();
                    }
                }
            );
        };

        this.start = function(callback) {
            var storageStickerData;

            tabActive = -1;

            storageStickerData =  stService.getPacksFromStorage();

            if(storageStickerData.actual) {

                stickersModel = storageStickerData.packs;
                _init();

                if(callback) callback.apply();
            } else {

                this.fetchPacks({
                    callback: callback
                });
            }


        };

        this.onClickSticker = function(callback, context) {

            stController.handleClickSticker(Config.stickersContainerId, Config.stickerItemClass, function(el) {
                callback.call(context, "[[" + el.getAttribute("data-sticker-string") + "]]");
            });

        };

        this.onClickCustomTab = function(callback, context) {

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {

                if (el.getAttribute("id") == "custom_tab" ) {
                    callback.call(context, el);
                }

            });

        };

        this.onClickTab = function(callback, context) {

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {
                callback.call(context, el);
            });

        };

        this.getNewStickersFlag = function() {
            return stService.getNewStickersFlag(stService.getPacksFromStorage().packs || []);
        };

        this.resetNewStickersFlag = function() {
            return stService.resetNewStickersFlag();
        };

        this.parseStickerFromText = function(text) {
            return stService.parseStickerFromText(text);
        };

        this.renderCurrentTab = function(tabName) {
            var obj = stService.getPacksFromStorage();

            this.start();

            _module.StickerHelper.forEach(obj.packs, function(pack, key) {

                if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
                    tabActive = +key;
                }

            });

            //stickersModel[tabActive].newPack = false;
            //stService.setPacksToStorage(stickersModel);

            _renderAll();
        };

        this.isNewPack = function(packName) {
            return stService.isNewPack(stickersModel, packName);
        };

        this.onUserMessageSent = function(isSticker) {
            return stService.onUserMessageSent(isSticker);
        };

        this.renderPack = function(pack) {
            stView.renderStorePack(pack);
        };

    }

    Plugin.Stickers = Stickers;

})(window, StickersModule);
