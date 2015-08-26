
(function(Plugin, StickerHelper) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    function BaseController() {

        this.handleClickTab = function(itemsBlockId, itemsClassName, callback) {
            StickerHelper.setEvent("click", itemsBlockId, itemsClassName, callback);
        };

        this.handleClickSticker = function( itemsBlockId, itemsClassName, callback) {
            StickerHelper.setEvent("click", itemsBlockId, itemsClassName, callback);
        };

    };

    Plugin.StickersModule.BaseController = BaseController;

})(window, window.StickersModule.StickerHelper);