
(function(Plugin) {

	function getTime() {
		return new Date().getTime() / 1000 | 0;
	}

	Plugin.Service.Statistic = {

		messageSend: function(isSticker) {
			var category = 'message',
				action = 'send',
				label = (isSticker) ? 'sticker' : 'text';

			Plugin.Service.Api.sendStatistic([{
				category: category,
				action: action,
				label: label,
				time: getTime()
			}]);

			ga('stickerTracker.send', 'event', category, action, label);
		},

		useSticker: function(packName, stickerName) {
			var category = 'sticker';

			Plugin.Service.Api.sendStatistic([{
				category: category,
				action: 'use',
				label: '[[' + packName + '_' + stickerName + ']]',
				time: getTime()
			}]);

			ga('stickerTracker.send', 'event', category, packName, stickerName, 1);
		},

		useEmoji: function(emoji) {
			var action = 'use',
				category = 'emoji';

			Plugin.Service.Api.sendStatistic([{
				category: category,
				action: action,
				label: emoji,
				time: getTime()
			}]);

			ga('stickerTracker.send', 'event', category, action, emoji);
		}

	};

})(StickersModule);
