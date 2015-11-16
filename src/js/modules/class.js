
(function(Plugin) {

	Plugin.StickersModule = Plugin.StickersModule || {};

	Plugin.StickersModule.Class = function(source) {
		var _class = function() {
				this._constructor && this._constructor.apply(this, arguments);
			},
			_prototype = _class.prototype || {};

		for (var property in source) {
			_prototype[property] = source[property];
		}

		_class.prototype = _prototype;

		return _class;

	};

})(window);