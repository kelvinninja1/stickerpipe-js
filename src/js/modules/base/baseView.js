
(function(Plugin, Module) {

	var StickerHelper = Module.StickerHelper;

	Plugin.StickersModule.BaseView = Module.Class({

		config: null,
		service: null,

		el: null,
		stickersEl:  null,

		controlTabs:  {},

		tabsView: null,

		_constructor: function(config, service) {
			this.config = config;
			this.service = service;

			this.tabsView = new Module.TabsView(this.config);

			this.el = document.getElementById(this.config.elId);
			this.stickersEl = document.createElement('div');
		},

		clearBlock: function(el) {
			el.setAttribute('style', 'display:block');
			el.innerHTML = '';
		},

		render: function(stickerPacks) {
			this.tabsView.render(stickerPacks);

			this.el.innerHTML = '';

			this.el.classList.add('sticker-pipe');

			this.stickersEl.classList.add('sp-stickers');

			this.el.appendChild(this.tabsView.el);
			this.el.appendChild(this.stickersEl);
		},

		renderUseStickers: function(latesUseSticker) {
			var self = this;

			this.clearBlock(self.stickersEl);

			if (latesUseSticker.length == 0) {

				this.stickersEl.innerHTML += this.config.htmlForEmptyRecent;

				return false;
			}


			StickerHelper.forEach(latesUseSticker, (function(sticker) {

				var icon_src = this.service.parseStickerFromText("[[" + sticker.code + "]]"),
					packItem;

				packItem = "<span data-sticker-string=" + sticker.code +" class=" + self.config.stickerItemClass + "> <img src=" + icon_src.url + "></span>";

				self.stickersEl.innerHTML += packItem;
			}).bind(this));

		},

		renderCustomBlock: function() {
			this.clearBlock(this.stickersEl);
		},

		renderStickers: function(pack) {
			var self = this;

			this.clearBlock(this.stickersEl);

			StickerHelper.forEach(pack.stickers, function(sticker) {

				var icon_src = self.config.domain + '/' +
					self.config.baseFolder + '/' +
					pack.pack_name + '/' +
					sticker.name + '_' + self.config.stickerResolutionType +
					'.png';

				self.stickersEl.innerHTML +=
					'<span data-sticker-string=' + pack.pack_name + '_' + sticker.name +' class=' + self.config.stickerItemClass + '> <img src=' + icon_src + '></span>';
			});
		},

		renderStorePack: function(packName) {

			var storeEl = document.getElementById(this.config.storeContainerId),
				iframe = document.createElement('iframe'),
				urlParams = {
					apiKey: this.config.apikey,
					platform: 'JS',
					userId: this.config.userId,
					density: this.config.stickerResolutionType
				},
				urlSerialize = function(obj) {
					var str = [];
					for(var p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						}
					return str.join('&');
				};

			storeEl.classList.add('sp-store');
			storeEl.innerHTML = '';
			storeEl.appendChild(iframe);

			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.style.border = '0';

			// todo
			iframe.src = this.config.storeUrl + '?' + urlSerialize(urlParams) + '#/packs/' + packName;
		},

		handleClickSticker: function(callback) {
			Module.StickerHelper.setEvent('click', this.stickersEl, this.config.stickerItemClass, callback);
		}
	});

})(window, window.StickersModule);