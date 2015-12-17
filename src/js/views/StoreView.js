
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

		el: null,

		modal: null,
		iframe: null,

		_constructor: function() {
			this.el = document.getElementById(Module.Configs.storeContainerId);

			this.iframe = document.createElement('iframe');

			this.iframe.style.width = '100%';
			this.iframe.style.height = '100%';
			this.iframe.style.border = '0';

			this.modal = Module.View.Modal.init(this.iframe, {
				onOpen: function() {
					Module.DOMEventService.resize();
				}
			});

			window.addEventListener('resize', resizeModalWindow.bind(this));
		},

		renderStore: function() {
			this.iframe.src = Module.Api.store.getStoreUrl();
			this.modal.open();
		},

		renderPack: function(packName) {
			this.iframe.src = Module.Api.store.getPackUrl(packName);
			this.modal.open();
		}
	});

})(window.StickersModule);