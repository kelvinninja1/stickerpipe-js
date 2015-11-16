
(function(Plugin, Config) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    Plugin.StickersModule.Lockr = {
		prefix: Config.storagePrefix,

		_getPrefixedKey: function(key, options) {
			options = options || {};

			if (options.noPrefix) {
				return key;
			} else {
				return this.prefix + key;
			}
		},

		set: function (key, value, options) {
			var query_key = this._getPrefixedKey(key, options);

			try {
				localStorage.setItem(query_key, JSON.stringify({
					data: value
				}));
			} catch (e) {
				console && console.warn('Lockr didn\'t successfully save the "{'+ key +': '+ value +'}" pair, because the localStorage is full.');
			}
		},

		get: function (key, missing, options) {
			var query_key = this._getPrefixedKey(key, options),
				value;

			try {
				value = JSON.parse(localStorage.getItem(query_key));
			} catch (e) {
				value = null;
			}

			return (value === null) ? missing : (value.data || missing);
		},

		sadd: function(key, value, options) {
			var query_key = this._getPrefixedKey(key, options),
				json;

			var values = this.smembers(key);

			if (values.indexOf(value) > -1) {
				return null;
			}

			try {
				values.push(value);
				json = JSON.stringify({"data": values});
				localStorage.setItem(query_key, json);
			} catch (e) {
				if (console) {
					console.log(e);
					console.warn('Lockr didn\'t successfully add the '+ value +' to '+ key +' set, because the localStorage is full.');
				}
			}
		},

		smembers: function(key, options) {
			var query_key = this._getPrefixedKey(key, options),
				value;

			try {
				value = JSON.parse(localStorage.getItem(query_key));
			} catch (e) {
				value = null;
			}

			return (value === null) ? [] : (value.data || []);
		},

		sismember: function(key, value, options) {
			var query_key = this._getPrefixedKey(key, options);
			return this.smembers(key).indexOf(value) > -1;
		},

		getAll: function () {
			var keys = Object.keys(localStorage);

			return keys.map((function (key) {
				return this.get(key);
			}).bind(this));
		},

		srem: function(key, value, options) {
			var query_key = this._getPrefixedKey(key, options),
				json,
				index;

			var values = this.smembers(key, value);

			index = values.indexOf(value);

			if (index > -1)
				values.splice(index, 1);

			json = JSON.stringify({
				data: values
			});

			try {
				localStorage.setItem(query_key, json);
			} catch (e) {
				console && console.warn('Lockr couldn\'t remove the ' + value + ' from the set ' + key);
			}
		},

		rm: function (key) {
			localStorage.removeItem(key);
		},

		flush: function () {
			localStorage.clear();
		}
    };

})(window, window.StickersModule.Config);
