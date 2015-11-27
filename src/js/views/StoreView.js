
(function(Module) {

	Module.StoreView = Module.Class({

		config: null,

		el: null,

		_constructor: function(config) {
			this.config = config;

			this.el = document.getElementById(this.config.storeContainerId);
		},

		render: function(packName) {

			var iframe = document.createElement('iframe'),
				urlParams = {
					apiKey: this.config.apikey,
					platform: 'JS',
					userId: this.config.userId,
					density: this.config.stickerResolutionType,
					uri: encodeURIComponent('http://demo.stickerpipe.com/work/libs/store/js/stickerPipeStore.js')
				},
				urlSerialize = function(obj) {
					var str = [];
					for(var p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						}
					return str.join('&');
				};

			this.el.classList.add('sp-store');
			this.el.innerHTML = '';
			this.el.appendChild(iframe);

			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.style.border = '0';

			iframe.src = this.config.storeUrl + '?' + urlSerialize(urlParams) + '#/packs/' + packName
		}
	});

})(window.StickersModule);