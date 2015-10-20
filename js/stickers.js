

// include: "analytics.js"
// include: "config_base.js"
// include: "Lockr.js"
// include: "helper.js"
// include: "controller_base.js"
// include: "service_base.js"
// include: "view_base.js"


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
                stService.setPacksToStorge(stickersModel);

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
            var storgeStickerData;

            storgeStickerData =  stService.getPacksFromStorge();

            stService.getPacksFromServer(
                Config.packsUrl,
                Config.apikey,
                (function(response) {
                    if(response.status == "success") {
                        var stickerPacks = response.data;

                        stickerPacks = stService.markNewPacks(storgeStickerData.packs, stickerPacks);
                        stService.setPacksToStorge(stickerPacks);

                        stickersModel = stickerPacks;

                        if(!attrs.onlyFetch){
                            _init();
                        }


                        if(attrs.callback) attrs.callback.apply();
                    }
                }).bind(this)
            );
        };

        this.start = function(callback) {
            var storgeStickerData;

            tabActive = -1;

            storgeStickerData =  stService.getPacksFromStorge();

            if(storgeStickerData.actual) {

                stickersModel = storgeStickerData.packs;
                _init();

                if(callback) {
                    callback.apply();
                }
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
            return stService.getNewStickersFlag(stService.getPacksFromStorge().packs || []);
        };

        this.resetNewStickersFlag = function() {
            return stService.resetNewStickersFlag();
        };

        this.getStickerUrl = function(text) {
            return stService.getStickerUrl(text);
        };

        this.renderCurrentTab = function(tabName) {
            var obj = stService.getPacksFromStorge();

            this.start();

            _module.StickerHelper.forEach(obj.packs, function(pack, key) {

                if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
                    tabActive = +key;
                }

            })

            //stickersModel[tabActive].newPack = false;
            //stService.setPacksToStorge(stickersModel);

            _renderAll();
        };

        this.isNewPack = function(packName) {
            return stService.isNewPack(stickersModel, packName);
        };

    }

    Plugin.Stickers = Stickers;

})(window, StickersModule);
