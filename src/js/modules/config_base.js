(function(Plugin) {

	Plugin.StickersModule = Plugin.StickersModule || {};

	Plugin.StickersModule.Config = {

		elId: 'stickerPipe',
		storeContainerId: 'stickerPipeStore',

		tabItemClass: 'sp-tab-item',
		stickerItemClass: 'sp-sticker-item',

		customTabContent: '<span class="sp-icon-face"></span>',
		historyTabContent: '<span class="sp-icon-clock"></span>',
		storeTabContent: '<span class="sp-icon-plus"></span>',
		settingsTabContent: '<span class="sp-icon-settings"></span>',
		prevPacksTabContent: '<span class="sp-icon-arrow-back"></span>',
		nextPacksTabContent: '<span class="sp-icon-arrow-forward"></span>',

		domain : 'http://api.stickerpipe.com',
		baseFolder: 'stk',

		htmlForEmptyRecent: '<div class="emptyRecent">Ваши Стикеры</div>',
		apikey: '72921666b5ff8651f374747bfefaf7b2',
		clientPacksUrl: 'http://api.stickerpipe.com/api/v1/client-packs',
		userPacksUrl: 'http://api.stickerpipe.com/api/v1/user/packs',
		userPackUrl: 'http://api.stickerpipe.com/api/v1/user/pack',
		trackStatUrl: 'http://api.stickerpipe.com/api/v1/track-statistic',
		storeUrl: 'http://api.stickerpipe.com/api/v1/web',

		storagePrefix: 'stickerPipe',
		enableCustomTab: false,

		userId: null

	};

})(window);
