
(function(Plugin) {

	Plugin.Service.User = {

		init: function() {
			this.updateUserData();
		},

		updateUserData: function() {
			if (!Plugin.Configs.userData) {
				return;
			}

			var storedUserData = Plugin.Service.Storage.getUserData() || {};

			if (!Plugin.Service.Helper.deepCompare(Plugin.Configs.userData, storedUserData)) {
				Plugin.Service.Api.updateUserData(Plugin.Configs.userData);
				Plugin.Service.Storage.setUserData(Plugin.Configs.userData);
			}
		}
	};

})(window.StickersModule);