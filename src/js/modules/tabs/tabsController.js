
(function(Plugin, Module) {

	var StickerHelper = Module.StickerHelper;

	Plugin.StickersModule.TabsController = Module.Class({

		config: null,
		view: null,

		_constructor: function(config) {
			this.config = config;
			this.view = new Module.TabsView(this.config);
		},

		handleClickTab: function(el, itemsClassName, callback) {
			StickerHelper.setEvent('click', el, itemsClassName, callback);
		}

	});

})(window, window.StickersModule);