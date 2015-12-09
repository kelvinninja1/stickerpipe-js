
(function(Module) {

	var parent = Module.BlockView;

	Module.PopoverView = Module.Class(parent, {

		popoverEl: null,
		triangleEl: null,
		toggleEl: null,

		active: false,

		_constructor: function() {
			parent.prototype._constructor.apply(this, arguments);

			this.toggleEl = document.getElementById(Module.Configs.elId);
			this.toggleEl.addEventListener('click', (function() {
				this.toggle();
			}).bind(this));

			this.popoverEl = document.createElement('div');
			this.popoverEl.classList.add('sp-popover');

			this.el = document.createElement('div');

			this.triangleEl = document.createElement('div');
			this.triangleEl.className = 'sp-arrow';

			this.popoverEl.appendChild(this.el);
			this.popoverEl.appendChild(this.triangleEl);

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
				this.open();
			} else {
				this.close();
			}
		},

		open: function() {
			this.toggleEl.parentElement.appendChild(this.popoverEl);
			this.positioned();
			Module.DOMEventService.popoverShown();
		},

		close: function() {
			this.toggleEl.parentElement.removeChild(this.popoverEl);
			Module.DOMEventService.popoverHidden();
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

				this.popoverEl.style.marginTop = -(this.popoverEl.offsetHeight + this.toggleEl.offsetHeight + arrowOffset) + 'px';
			} else {
				console && console.error('error: triangle not found');
			}
		}

	});

})(window.StickersModule);