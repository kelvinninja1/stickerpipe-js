
(function(Module) {

	function resizeModalWindow() {
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

	Module.StoreView = Module.Class({

		modal: null,

		_constructor: function(storeService) {

			var self = this;

			this.storeService = storeService;

			var iframe = document.createElement('iframe');

			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.style.border = '0';

			this.modal = Module.View.Modal.init(iframe, {
				onOpen: function() {
					Module.DOMEventService.resize();
					self.storeService._setWindow(iframe.contentWindow);
				}
			});

			this.iframe = iframe;

			window.addEventListener('resize', resizeModalWindow.bind(this));
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
		}
	});

})(window.StickersModule);