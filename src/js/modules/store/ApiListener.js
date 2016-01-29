
(function(Plugin) {

	var initialized = false;

	Plugin.Module.Store.ApiListener = {

		init: function() {
			if (initialized) {
				return;
			}

			window.addEventListener('message', (function(e) {
				var data = JSON.parse(e.data);

				if (!data.action) {
					return;
				}

				var api = Plugin.Module.Store.Api;
				api[data.action] && api[data.action](data);

			}).bind(this));

			initialized = true;
		}
	};

})(window.StickersModule);