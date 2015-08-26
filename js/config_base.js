(function(Plugin) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    Plugin.StickersModule.Config = {

        tabContainerId: "sttab",
        tabItemClass: "sttab_item",

        stickersContainerId: "stitems",
        stickerItemClass: "stitems_item",

        domain : "http://api.stickerpipe.com",
        baseFolder: "stk",

        stickerResolutionType : "mdpi",
        tabResolutionType: "xxhdpi",

        htmlForEmptyRecent: "<div class='emptyRecent'>Ваши Стикеры</div>",
        apikey: "72921666b5ff8651f374747bfefaf7b2",
        packsUrl: "http://api.stickerpipe.com/api/v1/client-packs",
        trackStatUrl: "http://api.stickerpipe.com/api/v1/track-statistic",

        storgePrefix: "stickerPipe",
        enableCustomTab: false

    };

})(window);
