
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

		ajaxGet: function(url, apikey, callback, header) {
			header = header || {};

			var xmlhttp;

			xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
					callback(JSON.parse(xmlhttp.responseText));
				}
			};
			xmlhttp.open('GET', url, true);
			xmlhttp.setRequestHeader('Apikey', apikey);
			xmlhttp.setRequestHeader('Platform', 'JS');
			xmlhttp.setRequestHeader('Localization', Module.Configs.get('lang'));

			this.forEach(header, function(value, name) {
				xmlhttp.setRequestHeader(name, value);
			});

			xmlhttp.send();
		},

		ajaxPost: function(url, apikey, data, callback, header) {
			var storageService = new Module.StorageService(Module.Configs.get('storagePrefix')),
				uniqUserId = storageService.getUniqUserId(),
				xmlhttp;

			xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					callback && callback(JSON.parse(xmlhttp.responseText));
				}
			};

			xmlhttp.open('POST', url, true);
			xmlhttp.setRequestHeader('Apikey', apikey);
			xmlhttp.setRequestHeader('Platform', 'JS');
			xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xmlhttp.setRequestHeader('DeviceId', uniqUserId);
			xmlhttp.setRequestHeader('Localization', Module.Configs.get('lang'));

			this.forEach(header, function(value, name) {
				xmlhttp.setRequestHeader(name, value);
			});

			xmlhttp.send(JSON.stringify(data));
		},

		md5: function(string) {
			return StickersModule.MD5(string);
		}
	};
})(window, window.StickersModule);