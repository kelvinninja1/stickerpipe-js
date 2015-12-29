
(function(Module) {

	Module.StickerHelper.setConfig({

		elId: 'stickerPipe',
		storeContainerId: 'stickerPipeStore',

		stickerResolutionType : (window.devicePixelRatio == 2) ? 'xhdpi' : 'mdpi',
		tabResolutionType: (window.devicePixelRatio == 2) ? 'xxhdpi' : 'hdpi',

		tabItemClass: 'sp-tab-item',
		stickerItemClass: 'sp-sticker-item',
		emojiItemClass: 'sp-emoji',

		htmlForEmptyRecent: '<div class="emptyRecent">No recent stickers</div>',

		apiKey: '', // 72921666b5ff8651f374747bfefaf7b2

		cdnUrl: 'http://cdn.stickerpipe.com',
		apiUrl: 'http://api.stickerpipe.com',
		storeUrl: 'http://api.stickerpipe.com/api/v1/web',

		storagePrefix: 'stickerPipe',

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
		width: '320px',

		lang: document.documentElement.lang.substr(0, 2) || 'en'
	});

})(window.StickersModule);