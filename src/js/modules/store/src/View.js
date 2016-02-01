
(function(Plugin, Module) {

	Module.View = {

		modal: null,
		iframe: null,

		modalBody: null,

		iosFixScrollTimeoutId: null,

		init: function() {
			this.iframe = document.createElement('iframe');

			this.iframe.style.width = '100%';
			this.iframe.style.height = '100%';
			this.iframe.style.border = '0';

			this.modal = Plugin.Module.Modal.init(this.iframe, {
				onOpen: (function(contentEl, modalEl, overlay) {
					Plugin.Service.Event.resize();
					Module.ApiListener.init();

					if (Plugin.Service.Helper.getMobileOS() == 'ios') {
						var modalBody = modalEl.getElementsByClassName('sp-modal-body')[0];
						modalBody.style.overflowY = 'scroll';

						modalBody.addEventListener('scroll', (function() {
							if (this.iosFixScrollTimeoutId) {
								clearTimeout(this.iosFixScrollTimeoutId);
							}

							this.iosFixScrollTimeoutId = setTimeout((function() {
								Module.Controller.onScrollContent(modalBody.scrollTop);
								this.iosFixScrollTimeoutId = null;
							}).bind(this), 500);
						}).bind(this));

						this.modalBody = modalBody;
					}
				}).bind(this)
			});

			this.modal.backButton.addEventListener('click', (function() {
				Module.Controller.goBack();
			}).bind(this));


			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},

		open: function(packName) {
			var url = Plugin.Service.Url.getStoreUrl();

			if (packName) {
				url = Plugin.Service.Url.getStorePackUrl(packName);
			}

			this.iframe.src = url;
			this.modal.open();
		},

		close: function() {
			if (this.modal && this.modal.hasGlobalOpened()) {
				this.modal.close();
			}
		},

		showBackButton: function(show) {
			var modal = this.modal;
			modal.backButton.style.display = (show) ? 'block' : 'none';
		},

		setYScroll: function(yPosition) {
			if (this.modalBody) {
				this.modalBody.scrollTop = yPosition;
			}
		},

		onWindowResize: function() {
			var dialog = this.modal.modalEl.getElementsByClassName('sp-modal-dialog')[0];
			dialog.style.height = '';

			if (window.innerWidth > 700) {

				var marginTop = parseInt(Plugin.Service.El.css(dialog, 'marginTop'), 10),
					marginBottom = parseInt(Plugin.Service.El.css(dialog, 'marginBottom'), 10);

				var minHeight = window.innerHeight - marginTop - marginBottom;

				dialog.style.height = minHeight + 'px';
			}
		}
	};

})(window.StickersModule, StickersModule.Module.Store);