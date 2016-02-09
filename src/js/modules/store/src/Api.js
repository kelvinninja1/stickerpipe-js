
(function(Plugin, Module) {

	Module.Api= {

		showCollections: function(data) {
			Module.Controller.showCollections(data.attrs.packName);
		},

		purchasePack: function(data) {
			var attrs = data.attrs;
			Module.Controller.purchasePack(attrs.packName, attrs.packTitle, attrs.pricePoint);
		},

		showPagePreloader: function(data) {
			Module.View.showPagePreloader(data.attrs.show);
		},

		showBackButton: function(data) {
			Module.View.showBackButton(data.attrs.show);
		},

		setYScroll: function(data) {
			Module.View.setYScroll(data.attrs.yPosition);
		}
	};

})(StickersModule, StickersModule.Module.Store);
