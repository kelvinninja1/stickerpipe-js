
(function(Module) {


	var hasMessageListener = false;

	function setWindowMessageListener() {
		if (!hasMessageListener) {
			window.addEventListener('message', (function(e) {
				var data = JSON.parse(e.data);

				if (!data.action) {
					return;
				}

				Module.Service.Store.api[data.action](data);

			}).bind(this));

			hasMessageListener = true;
		}
	}

	Module.StoreView = Module.Class({

		modal: null,
		iframe: null,
		overlay: null,

		_constructor: function() {

			this.iframe = document.createElement('iframe');

			this.iframe.style.width = '100%';
			this.iframe.style.height = '100%';
			this.iframe.style.border = '0';

			this.modal = Module.View.Modal.init(this.iframe, {
				onOpen: (function(contentEl, modalEl, overlay) {
					this.overlay = overlay;
					Module.DOMEventService.resize();
					setWindowMessageListener.bind(this)();
				}).bind(this)
			});

			window.addEventListener('resize', (function() {
				this.resize();
			}).bind(this));
		},

		renderStore: function() {
			this.iframe.src = Module.Api.store.getStoreUrl();
			this.modal.open();
		},

		renderPack: function(packName) {
			this.iframe.src = Module.Api.store.getPackUrl(packName);
			this.modal.open();
		},

		close: function() {
			this.modal.close();
		},

		resize: function(height) {
			height = height || 0;

			var self = this;

			if (window.innerWidth < 544) {
				this.modal.modalEl.style.height = ((window.innerHeight > height) ? window.innerHeight : height) + 'px';

				if (this.overlay) {
					setTimeout(function() {
						self.overlay.style.webkitOverflowScrolling = 'touch';
					}, 1000);
				}
			} else {
				this.modal.modalEl.style.height = '';
				if (parseInt(Module.El.css(this.modal.modalEl, 'height'), 10) < window.innerHeight) {
					var newHeight = window.innerHeight
						- parseInt(Module.El.css(this.modal.modalEl, 'marginTop'), 10)
						- parseInt(Module.El.css(this.modal.modalEl, 'marginBottom'), 10);

					if (newHeight == window.innerHeight) {
						return;
					}

					this.modal.modalEl.style.height = newHeight + 'px';
				}
			}
		}
	});

})(window.StickersModule);