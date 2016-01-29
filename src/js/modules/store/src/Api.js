
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
		}
	};

})(StickersModule, StickersModule.Module.Store);
