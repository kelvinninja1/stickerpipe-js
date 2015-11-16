
(function(Plugin, Module) {

    Plugin.StickersModule.BaseController = Plugin.StickersModule.Class({

        handleClickSticker: function(el, itemsClassName, callback) {
            Module.StickerHelper.setEvent('click', el, itemsClassName, callback);
        }
    });

})(window, window.StickersModule);