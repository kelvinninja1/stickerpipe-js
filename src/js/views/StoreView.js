
(function(Module) {


	var hasMessageListener = false;

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

	function setWindowMessageListener() {
		if (!hasMessageListener) {
			window.addEventListener('message', (function(e) {
				var data = JSON.parse(e.data);

				if (!data.action) {
					return;
				}

				Module.Service.Store[data.action](data);

			}).bind(this));

			hasMessageListener = true;
		}
	}

	Module.StoreView = Module.Class({

		modal: null,

		_constructor: function() {

			this.iframe = document.createElement('iframe');

			this.iframe.style.width = '100%';
			this.iframe.style.height = '100%';
			this.iframe.style.border = '0';

			this.modal = Module.View.Modal.init(this.iframe, {
				onOpen: (function() {
					Module.DOMEventService.resize();
					setWindowMessageListener.bind(this)();
				}).bind(this)
			});

			window.addEventListener('resize', resizeModalWindow.bind(this));
		},

		_sendReturn: function (value, data) {
			this.iframe.contentWindow.postMessage(JSON.stringify({
				action: data.action,
				value: value,
				hashKey: data.hashKey
			}), document.location.origin);
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