
(function(Plugin, Module) {

	Module.StickerHelper = {

		forEach: function(data, callback) {
			for (var x in data) {
				callback(data[x], x);
			}
		},

		mergeOptions: function(obj1, obj2) {
			var obj3 = {};

			for(var attrname in obj1) {
				obj3[attrname] = obj1[attrname];
			}

			for(var attrname in obj2) {
				obj3[attrname] = obj2[attrname];
			}

			return obj3;
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

		md5: function(string) {
			return StickersModule.MD5(string);
		}

	};
})(window, window.StickersModule);