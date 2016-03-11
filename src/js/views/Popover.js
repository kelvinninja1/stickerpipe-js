
(function(Plugin) {

	var parent = Plugin.View.Block;

	Plugin.View.Popover = parent.extend({

		popoverEl: null,
		triangleEl: null,
		toggleEl: null,

		active: false,

		_constructor: function() {
			parent.prototype._constructor.apply(this, arguments);

			var self = this;

			this.toggleEl = document.getElementById(Plugin.Configs.elId);
			this.toggleEl.addEventListener('click', (function() {
				this.toggle();
			}).bind(this));

			this.popoverEl = document.createElement('div');
			this.popoverEl.className = 'stickerpipe-popover';

			this.el = document.createElement('div');

			this.triangleEl = document.createElement('div');
			this.triangleEl.className = 'sp-arrow';

			this.popoverEl.appendChild(this.el);
			this.popoverEl.appendChild(this.triangleEl);

			this.handleClickOnSticker((function() {
				this.toggle();
			}).bind(this));

			// check if click outside popover - hide popover
			document.body.addEventListener('click', function(e) {
				function isDescendant(parent, child) {
					var node = child.parentNode;
					while (node != null) {
						if (node == parent) {
							return true;
						}
						node = node.parentNode;
					}
					return false;
				}

				if (!self.active) {
					return;
				}

				if (!isDescendant(self.popoverEl, e.target) && !isDescendant(self.toggleEl.parentElement, e.target)) {
					self.toggle();
				}
			});

			window.addEventListener(Plugin.Service.Event.events.showContentHighlight, function() {
				self.toggleEl.classList.add('stickerpipe-content-highlight');
			});

			window.addEventListener(Plugin.Service.Event.events.hideContentHighlight, function() {
				self.toggleEl.classList.remove('stickerpipe-content-highlight');
			});

			window.addEventListener(Plugin.Service.Event.events.popoverShown, function() {
				Plugin.Service.Event.resize();
			})
		},

		toggle: function() {
			if (!this.active) {
				this.open();
			} else {
				this.close();
			}
		},

		open: function() {
			if (!this.active) {

				this.active = true;

				this.toggleEl.parentElement.appendChild(this.popoverEl);
				this.positioned();
				Plugin.Service.Event.popoverShown();
			}

			parent.prototype.open.apply(this, arguments);
		},

		close: function() {
			this.active = false;
			this.toggleEl.parentElement.removeChild(this.popoverEl);
			Plugin.Service.Event.popoverHidden();
			// todo
			this.popoverEl.style.marginTop = 0;
		},

		positioned: function() {
			var arrowOffset = 0;

			// todo: check
			if (this.triangleEl) {
				var style = this.toggleEl.currentStyle || window.getComputedStyle(this.toggleEl);
				var marginLeft = parseInt(style.marginLeft, 10);

				this.popoverEl.style.marginLeft = marginLeft + 'px';

				//if (this.popoverEl.getBoundingClientRect().left + this.popoverEl.offsetWidth > window.innerWidth) {
				//	this.popoverEl.style.marginLeft = marginLeft - (this.popoverEl.offsetWidth / 2) + (this.toggleEl.clientWidth / 2) + 'px';
				//}

				this.triangleEl.style.marginLeft = this.toggleEl.getBoundingClientRect().left
					- this.popoverEl.getBoundingClientRect().left
					+ (this.toggleEl.clientWidth / 2) - (this.triangleEl.offsetWidth / 2)
					+ 'px';

				var arrowStyle = this.triangleEl.currentStyle || window.getComputedStyle(this.triangleEl);
				if (arrowStyle.display != 'none') {
					arrowOffset = 15;
				}

				var elOffset = this.toggleEl.getBoundingClientRect().top + this.toggleEl.offsetHeight - this.popoverEl.getBoundingClientRect().top;

				// todo 5px remove
				this.popoverEl.style.marginTop = -(this.popoverEl.offsetHeight + this.toggleEl.offsetHeight + arrowOffset - elOffset + 5) + 'px';
			} else {
				console && console.error('error: triangle not found');
			}
		}

	});

})(window.StickersModule);