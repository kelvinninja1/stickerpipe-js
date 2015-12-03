
(function(Module) {

	Module.ScrollView = Module.Class({

		el: null,

		scrollbarEl: null,
		trackEl: null,
		thumbEl: null,
		viewportEl: null,
		overviewEl: null,

		scrollbar: null,

		_constructor: function() {
			this.el = document.createElement('div');
			this.scrollbarEl = document.createElement('div');
			this.trackEl = document.createElement('div');
			this.thumbEl = document.createElement('div');
			this.viewportEl = document.createElement('div');
			this.overviewEl = document.createElement('div');

			this.scrollbarEl.className = 'scrollbar';
			this.trackEl.className = 'track';
			this.thumbEl.className = 'thumb';
			this.viewportEl.className = 'viewport';
			this.overviewEl.className = 'overview';

			this.trackEl.appendChild(this.thumbEl);
			this.scrollbarEl.appendChild(this.trackEl);

			this.viewportEl.appendChild(this.overviewEl);

			this.el.appendChild(this.scrollbarEl);
			this.el.appendChild(this.viewportEl);

			this.scrollbar = Module.Tinyscrollbar(this.el);

			window.addEventListener('resize', (function() {
				this.update();
			}).bind(this));
		},

		getOverview: function() {
			return this.overviewEl;
		},

		update: function() {
			this.scrollbar.update();
		}
	});

})(window.StickersModule);