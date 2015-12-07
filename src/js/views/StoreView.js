
(function(Module) {

	Module.StoreView = Module.Class({

		el: null,

		_constructor: function() {
			this.el = document.getElementById(Module.Configs.storeContainerId);
		},

		render: function(packName) {

			var iframe = document.createElement('iframe'),
				urlParams = {
					apiKey: Module.Configs.apikey,
					platform: 'JS',
					userId: Module.Configs.userId,
					density: Module.Configs.stickerResolutionType,
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

			iframe.src = Module.Configs.storeUrl + '?' + urlSerialize(urlParams) + '#/packs/' + packName
		}
	});

})(window.StickersModule);