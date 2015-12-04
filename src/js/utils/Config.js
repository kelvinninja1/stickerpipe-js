
(function(Plugin) {

	Plugin.StickersModule.Configs = {
		configs: {},

		add: function(data) {
			var configs = {};

			for(var name in this.configs) {
				configs[name] = this.configs[name];
			}

			for(var name in data) {
				configs[name] = data[name];
			}

			this.configs = configs;
		},

		set: function(name, value) {
			this.configs[name] = value;
		},

		get: function(name) {
			return this.configs[name];
		},

		getAll: function() {
			return this.configs;
		}
	};

})(window);