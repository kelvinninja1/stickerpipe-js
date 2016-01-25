
(function(Module) {

	Module.Service.Helper.setConfig({

		elId: 'stickerPipe',
		storeContainerId: 'stickerPipeStore',

		// todo: more than 2 resolution
		stickerResolutionType : (window.devicePixelRatio == 1) ? 'mdpi' : 'xhdpi',
		tabResolutionType: (window.devicePixelRatio == 1) ? 'hdpi' : 'xxhdpi',

		tabItemClass: 'sp-tab-item',
		stickerItemClass: 'sp-sticker-item',
		emojiItemClass: 'sp-emoji',

		htmlForEmptyRecent: '<div class="emptyRecent">No recent stickers</div>',

		apiKey: null, // example: 72921666b5ff8651f374747bfefaf7b2

		cdnUrl: 'http://cdn.stickerpipe.com',
		apiUrl: 'http://api.stickerpipe.com',
		storeUrl: 'http://api.stickerpipe.com/api/v1/web',

		storagePrefix: 'stickerpipe_',

		enableEmojiTab: false,
		enableHistoryTab: false,
		enableSettingsTab: false,
		enableStoreTab: false,

		userId: null,
		userPremium: false,
		userData: {},

		priceB: null,
		priceC: null,

		// todo: block or popover
		display: 'block',
		height: '350px',
		width: '320px',

		lang: document.documentElement.lang.substr(0, 2) || 'en'
	});

})(window.StickersModule);