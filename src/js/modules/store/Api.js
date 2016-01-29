
(function(Plugin, Module) {

	Module.Api= {

		showCollections: function(data) {
			Module.Controller.showCollections(data.attrs.packName);
		},

		purchasePack: function(data) {
			var attrs = data.attrs;
			Module.Controller.purchasePack(attrs.packName, attrs.packTitle, attrs.pricePoint);
		},

		showBackButton: function(data) {
			Module.View.showBackButton(data.attrs.show);
		},

		// todo: remove (not used)
		resizeStore: function(data) {
			Module.View.resize(data.attrs.height);
		}
	};

})(StickersModule, StickersModule.Module.Store);
