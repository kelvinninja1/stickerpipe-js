
(function(Module) {


	var hasMessageListener = false;

	function setWindowMessageListener() {
		if (!hasMessageListener) {
			window.addEventListener('message', (function(e) {
				var data = JSON.parse(e.data);

				if (!data.action) {
					return;
				}

				var StoreService = Module.Service.Store;
				StoreService.api[data.action] && StoreService.api[data.action](data);

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

					if (Module.Service.Helper.getMobileOS() == 'ios') {
						modalEl.getElementsByClassName('sp-modal-body')[0].style.overflowY = 'scroll';
					}
				}).bind(this)
			});

			this.modal.backButton.addEventListener('click', (function() {
				Module.Service.Store.goBack();
			}).bind(this));


			window.addEventListener('resize', (function() {
				this.resize();
			}).bind(this));
		},

		renderStore: function() {
			this.iframe.src = Module.Url.getStoreUrl();
			this.modal.open();
		},

		renderPack: function(packName) {
			this.iframe.src = Module.Url.getStorePackUrl(packName);
			this.modal.open();
		},

		close: function() {
			this.modal.close();
		},

		resize: function(height) {
			var dialog = this.modal.modalEl.getElementsByClassName('sp-modal-dialog')[0];
			dialog.style.height = '';

			if (window.innerWidth > 700) {

				var marginTop = parseInt(Module.El.css(dialog, 'marginTop'), 10),
					marginBottom = parseInt(Module.El.css(dialog, 'marginBottom'), 10);

				var minHeight = window.innerHeight - marginTop - marginBottom;

				dialog.style.height = minHeight + 'px';
			}
		}
	});

})(window.StickersModule);