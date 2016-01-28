
(function(Plugin) {


	var hasMessageListener = false;

	function setWindowMessageListener() {
		if (!hasMessageListener) {
			window.addEventListener('message', (function(e) {
				var data = JSON.parse(e.data);

				if (!data.action) {
					return;
				}

				var StoreService = Plugin.Service.Store;
				StoreService.api[data.action] && StoreService.api[data.action](data);

			}).bind(this));

			hasMessageListener = true;
		}
	}

	Plugin.Module.Store.View = Plugin.Libs.Class({

		modal: null,
		iframe: null,
		overlay: null,

		_constructor: function() {

			this.iframe = document.createElement('iframe');

			this.iframe.style.width = '100%';
			this.iframe.style.height = '100%';
			this.iframe.style.border = '0';

			this.modal = Plugin.View.Modal.init(this.iframe, {
				onOpen: (function(contentEl, modalEl, overlay) {
					this.overlay = overlay;
					Plugin.Service.Event.resize();
					setWindowMessageListener.bind(this)();

					if (Plugin.Service.Helper.getMobileOS() == 'ios') {
						modalEl.getElementsByClassName('sp-modal-body')[0].style.overflowY = 'scroll';
					}
				}).bind(this)
			});

			this.modal.backButton.addEventListener('click', (function() {
				Plugin.Service.Store.goBack();
			}).bind(this));


			window.addEventListener('resize', (function() {
				this.resize();
			}).bind(this));
		},

		renderStore: function() {
			this.iframe.src = Plugin.Service.Url.getStoreUrl();
			this.modal.open();
		},

		renderPack: function(packName) {
			this.iframe.src = Plugin.Service.Url.getStorePackUrl(packName);
			this.modal.open();
		},

		close: function() {
			// todo: сделать hasOpened функцией конкретного окна
			if (Plugin.View.Modal.hasOpened()) {
				this.modal.close();
			}
		},

		resize: function(height) {
			var dialog = this.modal.modalEl.getElementsByClassName('sp-modal-dialog')[0];
			dialog.style.height = '';

			if (window.innerWidth > 700) {

				var marginTop = parseInt(Plugin.Service.El.css(dialog, 'marginTop'), 10),
					marginBottom = parseInt(Plugin.Service.El.css(dialog, 'marginBottom'), 10);

				var minHeight = window.innerHeight - marginTop - marginBottom;

				dialog.style.height = minHeight + 'px';
			}
		}
	});

})(window.StickersModule);