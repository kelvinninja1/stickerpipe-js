
(function(Plugin) {

	Plugin.Service.Ajax = function(options) {
		options = options || {};

		if (!options.url) {
			return;
		}

		options.type = (options.type && options.type.toUpperCase()) || 'GET';
		options.headers = options.headers || {};
		options.data = options.data || {};
		options.success = options.success || function() {};
		options.error = options.error || function() {};
		options.complete = options.complete || function() {};

		options.headers.Apikey = Plugin.Configs.apiKey;
		options.headers.Platform = 'JS';
		options.headers.Localization = Plugin.Configs.lang;
		options.headers.UserId = Plugin.Configs.userId;

		if (options.type == 'POST' || options.type == 'PUT') {
			options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
			options.headers['DeviceId'] = Plugin.Service.Storage.getDeviceId();
		}


		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open(options.type, options.url, true);

		for (var name in options.headers) {
			xmlhttp.setRequestHeader(name, options.headers[name]);
		}

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					options.success(JSON.parse(xmlhttp.responseText), xmlhttp);
				} else {
					var response = {};
					try {
						response = JSON.parse(xmlhttp.responseText);
					} catch (ex) {
						response = {}
					}
					options.error(response, xmlhttp);
				}

				options.complete(JSON.parse(xmlhttp.responseText), xmlhttp);
			}
		};

		xmlhttp.send(JSON.stringify(options.data));
	};

})(window.StickersModule);