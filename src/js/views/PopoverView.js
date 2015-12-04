
(function(Module) {

	var parent = Module.BlockView;

	Module.PopoverView = Module.Class(parent, {

		popoverEl: null,
		arrowEl: null,
		toggleEl: null,

		active: false,

		_constructor: function() {
			parent.prototype._constructor.apply(this, arguments);

			this.toggleEl = document.getElementById(this.config.elId);
			this.toggleEl.addEventListener('click', (function() {
				this.toggle();
			}).bind(this));

			this.popoverEl = document.createElement('div');
			this.popoverEl.classList.add('sp-popover');

			this.el = document.createElement('div');

			this.arrowEl = document.createElement('div');
			this.arrowEl.className = 'sp-arrow';

			this.popoverEl.appendChild(this.el);
			this.popoverEl.appendChild(this.arrowEl);

			this.handleClickSticker((function() {
				this.toggle();
			}).bind(this));

			document.getElementsByTagName('body')[0].addEventListener('click', (function(e) {
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

				if (!this.active) {
					return;
				}

				if (!isDescendant(this.popoverEl, e.target) && !isDescendant(this.toggleEl.parentElement, e.target)) {
					this.toggle();
				}
			}).bind(this));

			// todo: addEventListener --> DOMEventService
			if (window.addEventListener) {
				window.addEventListener(Module.DOMEventService.events.popoverShown, function() {
					Module.DOMEventService.resize();
				});
			} else {
				window.attachEvent('on' + Module.DOMEventService.events.popoverShown, function() {
					Module.DOMEventService.resize();
				});
			}
		},

		toggle: function() {
			this.active = !this.active;

			if (this.active) {
				this.toggleEl.parentElement.appendChild(this.popoverEl);
				this.positioned();
				Module.DOMEventService.popoverShown();
			} else {
				this.toggleEl.parentElement.removeChild(this.popoverEl);
				Module.DOMEventService.popoverHidden();
			}
		},

		positioned: function() {
			var arrowOffset = 0;

			if (this.arrowEl) {
				var style = this.toggleEl.currentStyle || window.getComputedStyle(this.toggleEl);
				var marginLeft = parseInt(style.marginLeft, 10);

				this.arrowEl.style.marginLeft = (this.toggleEl.clientWidth / 2) - (this.arrowEl.offsetWidth / 2) + marginLeft + 'px';

				var arrowStyle = this.arrowEl.currentStyle || window.getComputedStyle(this.arrowEl);
				if (arrowStyle.display != 'none') {
					arrowOffset = 15;
				}
			} else {
				console.error('error');
			}

			if (this.arrowEl)
			this.popoverEl.style.top = -(this.popoverEl.offsetHeight + arrowOffset) + 'px';
		}

	});

})(window.StickersModule);