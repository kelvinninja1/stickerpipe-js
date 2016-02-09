
(function(Plugin, Module) {

	var initialized = false;

	Module.ApiListener = {

		init: function() {
			if (initialized) {
				return;
			}

			window.addEventListener('message', function(e) {
				var data = JSON.parse(e.data);

				if (!data.action) {
					return;
				}

				var api = Module.Api;
				api[data.action] && api[data.action](data);
			});

			initialized = true;
		}
	};

})(window.StickersModule, StickersModule.Module.Store);