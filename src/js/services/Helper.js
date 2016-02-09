
(function(Plugin) {

	Plugin.Service.Helper = {

		extend: function(out) {
			out = out || {};

			for (var i = 1; i < arguments.length; i++) {
				if (!arguments[i])
					continue;

				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key))
						out[key] = arguments[i][key];
				}
			}

			return out;
		},

		setConfig: function(config) {
			Plugin.Configs = this.extend({}, Plugin.Configs || {}, config);
		},

		setEvent: function(eventType, el, className, callback) {

			el.addEventListener(eventType, function (event) {

				var el = event.target, found;

				while (el && !(found = el.className.match(className))) {
					el = el.parentElement;
				}

				if (found) {
					callback(el, event);
				}
			});
		},

		urlParamsSerialize: function(params) {
			var str = [];
			for(var p in params)
				if (params.hasOwnProperty(p)) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
				}
			return str.join('&');
		},

		isIE: function() {
			return ((navigator.appName == 'Microsoft Internet Explorer') ||
			(navigator.userAgent.match(/MSIE\s+\d+\.\d+/)) ||
			(navigator.userAgent.match(/Trident\/\d+\.\d+/)));
		},

		md5: function(string) {
			return Plugin.Libs.MD5(string);
		},

		getLocation: function(url) {
			var location = document.createElement('a');
			location.href = url;
			return location;
		},

		getDomain: function(url) {
			var location = this.getLocation(url);
			return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
		},

		getMobileOS: function() {
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;

			if(userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i )) {
				return 'ios';
			} else if(userAgent.match( /Android/i )) {
				return 'android';
			} else {
				return 'other';
			}
		}
	};

})(window.StickersModule);