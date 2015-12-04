
(function(Plugin, Module) {

	Module.Http = {

		get: function(url, callbacks, headers) {
			callbacks = callbacks || {};
			headers = headers || {};

			this.ajax({
				type: 'GET',
				url: url,
				headers: headers,
				success: callbacks.success,
				error: callbacks.error,
				complete: callbacks.complete
			});
		},

		post: function(url, data, callbacks, headers) {
			data = data || {};
			callbacks = callbacks || {};
			headers = headers || {};

			this.ajax({
				type: 'POST',
				url: url,
				data: data,
				headers: headers,
				success: callbacks.success,
				error: callbacks.error,
				complete: callbacks.complete
			});
		},

		ajax: function(options) {
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

			options.headers.Apikey = Module.Configs.apikey;
			options.headers.Platform = 'JS';
			options.headers.Localization = Module.Configs.lang;

			if (options.type == 'POST') {
				options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded';
				options.headers['DeviceId'] = Module.Storage.getUniqUserId();
			}


			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open(options.type, options.url, true);

			Module.StickerHelper.forEach(options.headers, function(value, name) {
				xmlhttp.setRequestHeader(name, value);
			});

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						options.success(JSON.parse(xmlhttp.responseText), xmlhttp);
					} else {
						options.error(JSON.parse(xmlhttp.responseText), xmlhttp);
					}

					options.complete(JSON.parse(xmlhttp.responseText), xmlhttp);
				}
			};

			xmlhttp.send(JSON.stringify(options.data));
		}
	};
})(window, window.StickersModule);