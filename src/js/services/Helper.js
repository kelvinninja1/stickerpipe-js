
(function(Plugin) {

	Plugin.Service.Helper = {

		merge: function(obj1, obj2) {
			var obj3 = {};

			for(var attrname in obj1) {
				obj3[attrname] = obj1[attrname];
			}

			for(var attrname in obj2) {
				obj3[attrname] = obj2[attrname];
			}

			return obj3;
		},

		setConfig: function(config) {
			Plugin.Configs = this.merge(Plugin.Configs || {}, config);
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