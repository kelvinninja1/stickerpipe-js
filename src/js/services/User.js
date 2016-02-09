
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

			if (JSON.stringify(storedUserData) != JSON.stringify(Plugin.Configs.userData)) {
				Plugin.Service.Api.updateUserData(Plugin.Configs.userData);
				Plugin.Service.Storage.setUserData(Plugin.Configs.userData);
			}
		}
	};

})(window.StickersModule);