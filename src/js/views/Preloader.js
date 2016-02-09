
(function(Plugin) {

	Plugin.View.Preloader = function(parentEl) {

		// Constructor

		var el = document.createElement('div');
		el.className = 'sp-preloader';

		el.innerHTML = '' +
			'<div class="sp-preloader-content">' +
				'<div class="sp-preloader-chasing-dots">' +
					'<div class="sp-preloader-child sp-preloader-dot1"></div>' +
					'<div class="sp-preloader-child sp-preloader-dot2"></div>' +
				'</div>' +
			'</div>';

		if (parentEl) {
			parentEl.appendChild(el);
		}

		// ***********

		return {

			getEl: function() {
				return el;
			},

			show: function() {
				el.style.display = '';
			},

			hide: function() {
				el.style.display = 'none';
			}
		};
	};

})(window.StickersModule);