
(function(Plugin, StickerHelper, BaseService) {

    function BaseView(Config) {

        var clearBlock = function(idBlock) {
            var conteinerEl = document.getElementById(idBlock);
            conteinerEl.setAttribute("style", "display:block");
            conteinerEl.innerHTML = "";
        };

        this.hideBlock = function(idBlock) {
            var conteinerEl = document.getElementById(idBlock);
            conteinerEl.setAttribute("style", "display:none");
        };

        this.renderTabs = function(stickerPacks, tabActive, tabContainerId, tabItemClass) {
            var conteinerEl = document.getElementById(tabContainerId),
                iteratorTabs = 0,
                newTabClass = "",
                tabActiveClass = "";

            clearBlock(tabContainerId);

            if(Config.enableCustomTab) {
                tabActiveClass = tabActive == -2 ? " active" : "";
                conteinerEl.innerHTML += "<span id = \"custom_tab\" class= \"" + tabItemClass + tabActiveClass + "\" data-tab-number = \"-2\" ></span>";
            }

            tabActiveClass = tabActive == -1 ? " active" : "";
            conteinerEl.innerHTML += "<span id = \"recents_tab\" class= \"" + tabItemClass + tabActiveClass +  "\" data-tab-number = \"-1\" ></span>";

            StickerHelper.forEach(stickerPacks, function(pack) {

                var tabActiveClass = newTabClass = "",
                    icon_src,
                    packItem;

                if(tabActive === iteratorTabs) {
                    tabActiveClass = " active";
                }

                if(pack.newPack) {
                    newTabClass = " stnewtab";
                }

                icon_src = Config.domain +
                    "/" +
                    Config.baseFolder +
                    "/" +
                    pack.pack_name +
                    "/tab_icon_" +
                    Config.tabResolutionType +
                    ".png";

                packItem = "<span class= \"" + tabItemClass + newTabClass + tabActiveClass + "\" data-tab-number = " + iteratorTabs + " > <img src=" + icon_src + "></span>";

                conteinerEl.innerHTML += packItem;
                iteratorTabs++;

            });
        };


        this.renderUseStickers = function(latesUseSticker, stickerContainerId, stickerItemClass) {
            var conteinerEl = document.getElementById(stickerContainerId),
                base_service = new BaseService(Config);

            clearBlock(stickerContainerId);

            if(latesUseSticker.length == 0) {

                conteinerEl.innerHTML += Config.htmlForEmptyRecent;

                return false;
            };


            StickerHelper.forEach(latesUseSticker, function(sticker) {

                var icon_src = base_service.parseStickerFromText("[[" + sticker.code + "]]"),
                    packItem;

                    packItem = "<span data-sticker-string=" + sticker.code +" class=" + stickerItemClass + "> <img src=" + icon_src.url + "></span>";

                    conteinerEl.innerHTML += packItem;
            });

        };

        this.renderStickers = function(stickerPacks, tabActive, stickerContainerId, stickerItemClass) {
            var conteinerEl = document.getElementById(stickerContainerId),
                tabNumber = 0;

            clearBlock(stickerContainerId);

            StickerHelper.forEach(stickerPacks, function(pack) {

                if(tabNumber == tabActive) {
                    StickerHelper.forEach(pack.stickers, function(sticker) {

                        var icon_src = Config.domain +
                                       "/" +
                                       Config.baseFolder +
                                       "/" +
                                       pack.pack_name +
                                       "/" +
                                       sticker.name +
                                       "_" +
                                       Config.stickerResolutionType +
                                       ".png",

                            packItem = "<span data-sticker-string=" + pack.pack_name + "_" + sticker.name +" class=" + stickerItemClass + "> <img src=" + icon_src + "></span>";

                        conteinerEl.innerHTML += packItem;
                    });
                };

                tabNumber++;
            });
        };

    };


    Plugin.StickersModule.BaseView = BaseView;

})(window, StickersModule.StickerHelper, StickersModule.BaseService);