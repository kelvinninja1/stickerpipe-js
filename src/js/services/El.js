
(function(Plugin, Module) {

	Module.El = {

		css: function(el, property) {
			// todo: getComputedStyle add IE 8 supporting

			return (el.style && el.style[property])
				|| (el.currentStyle && el.currentStyle[property])
				|| (getComputedStyle(el)[property]);

		},

		outerWidth: function(el) {
			var width = el.offsetWidth;
			width += parseInt(this.css(el, 'marginLeft')) + parseInt(this.css(el, 'marginRight'));
			return width;
		}
	};
})(window, window.StickersModule);