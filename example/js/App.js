
var _makeClass = function(constructor, source) {
	var _class = constructor,
		_prototype = _class.prototype || {};

	for (var property in source) {
		_prototype[property] = source[property];
	}

	_class.prototype = _prototype;

	return _class;
};

var App = _makeClass(function(options) {
	this.init(options);
}, {

	stickers: null,
	randomUsers: [],
	currentUser: {},

	init: function() {

		// setting lo-dash template
		_.templateSettings = {
			evaluate: /\{\[([\s\S]+?)\]\}/g,   // {[ alert() ]}
			interpolate: /\{\{([\s\S]+?)\}\}/g, // {{ name }}
			escape: /\{\{-([\s\S]+?)-\}\}/g // {{- html -}}
		};

		this.fetchRandomUsers().done((function() {
			this.sendMessage();
			this.sendMessage(true);
			this.sendMessage();
		}).bind(this));
		this.initMessageBox();

		var $window = $(window).resize((function() {
			this.resizeWindow();
		}).bind(this));

		$('.message-box textarea').on('autosize:resized', (function() {
			this.resizeWindow();
		}).bind(this));

		_.delay(function() {
			$window.resize();
		}, 100);

		$('#messages').on('click', 'img[data-sticker]', (function(e) {
			var $target = $(e.target);
			this.openPackInStore($target.attr('data-sticker-pack'));
		}).bind(this));

		this.initStickers();
	},

	initStickers: function() {
		this.stickers = new Stickers({

			tabContainerId: 'sttab',
			tabItemClass: 'sttab_item',

			stickersContainerId: 'stitems',
			stickerItemClass: 'stitems_item',

			storeContainerId: 'ststore',

			stickerResolutionType: 'mdpi',
			tabResolutionType: 'xhdpi',

			htmlForEmptyRecent: '<div class="emptyRecent">empty recent text</div>',

			apikey: '72921666b5ff8651f374747bfefaf7b2',
			storagePrefix: 'stickerPipe',
			enableCustomTab: true

		});

		this.stickers.start();

		this.stickers.onClickSticker((function(text) {
			this.sendMessage(true, text);
		}).bind(this));


		this.stickers.onClickCustomTab(function() {
			alert('customTab');
		});
	},

	initMessageBox: function() {
		var $messageBox = $('.message-box'),
			$textarea = $messageBox.find('textarea'),
			sendMessageFunc = (function() {
				this.sendMessage(true, $textarea.val());

				$textarea.val('');

				autosize.update($textarea);
			}).bind(this);

		autosize($textarea);

		$textarea.keydown(function (e) {

			if (e.keyCode != 13) return;

			e.preventDefault();

			if (e.keyCode == 13 && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
				$textarea.val($textarea.val() + '\n');
				autosize.update($textarea);
				return;
			}

			sendMessageFunc();
		});

		$messageBox.find('button[type=submit]').on('click', function() {
			sendMessageFunc();
		});

		var $stickersBlock = $('.stickers-block'),
			$showStickersButton = $messageBox.find('.show-stickers');

		$showStickersButton.on('click', (function() {
			$('.sttab').show();
			$('.stitems').show();

			$('.ststore').hide();

			var $messages = $('#messages');

			if ($showStickersButton.hasClass('active')) {
				$showStickersButton.removeClass('active');


				var messagesSavedHeight = $messages.attr('data-saved-height');

				$stickersBlock.slideUp({
					progress: function() {
						$messages.height(messagesSavedHeight - $stickersBlock.height());
					}
				});
			} else {

				var messagesHeight = $messages.height();
				$messages.attr('data-saved-height', messagesHeight);

				$showStickersButton.addClass('active');
				$stickersBlock.slideDown({
					progress: function() {
						$messages.height(messagesHeight - $stickersBlock.height());
					}
				});
			}
		}).bind(this));
	},
	sendMessage: function(isCurrentUser, text) {

		text = (text && text.trim()) || this.getRandomMessageText();
		text = text.replace(new RegExp('\r?\n','g'), '<br />');

		var user = this.currentUser;

		if (!isCurrentUser) {
			user = this.getRandomUser();
		}

		var parseSticker = this.stickers.parseStickerFromText(text);

		this.stickers.onUserMessageSent(parseSticker.isSticker);

		var $messages = $('#messages'),
			messageTemplate = _.template($('#messageTemplate').html());

		$messages.append(messageTemplate({
			isCurrentUser: isCurrentUser,
			user: user,
			text: text,
			date: this.getDateString(0),
			sticker: parseSticker
		})).animate({ scrollTop: $messages[0].scrollHeight }, 1000);
	},

	fetchRandomUsers: function() {
		return $.ajax({
			url: 'http://api.randomuser.me/0.4/?results=20',
			success: (function(data) {
				if (!data.results) return;

				this.currentUser = data.results.pop()['user'];
				this.randomUsers = _.map(data.results, function(userData) {
					return userData['user'];
				});
			}).bind(this)
		});
	},

	openPackInStore: function(pack) {

		$showStickersButton = $('.show-stickers');

		if (!$showStickersButton.hasClass('active')) {
			$showStickersButton.trigger('click');
		}

		$('.sttab').hide();
		$('.stitems').hide();

		$('.ststore').show();

		this.resizeWindow();

		this.stickers.renderPack(pack);
	},

	getRandom: function(min, max) {
		return Math.round(min + Math.random() * (max - min));
	},
	getRandomUser: function() {
		return this.randomUsers[this.getRandom(0, this.randomUsers.length - 1)];
	},
	getRandomMessageText: function() {
		var texts = [
			'Certainty determine at of arranging perceived situation or. Or wholly pretty county in oppose. Favour met itself wanted settle put garret twenty. In astonished apartments resolution so an it. Unsatiable on by contrasted to reasonable companions an. On otherwise no admitting to suspicion furniture it. ',
			'[[pinkgorilla_tower]]',
			'Too cultivated use solicitude frequently. Dashwood likewise up consider continue entrance ladyship oh. Wrong guest given purse power is no. Friendship to connection an am considered difficulty. Country met pursuit lasting moments why calling certain the. Middletons boisterous our way understood law. Among state cease how and sight since shall. Material did pleasure breeding our humanity she contempt had. So ye really mutual no cousin piqued summer result.',
			'Silent sir say desire fat him letter. Whatever settling goodness too and honoured she building answered her. Strongly thoughts remember mr to do consider debating. Spirits musical behaved on we he farther letters. Repulsive he he as deficient newspaper dashwoods we. Discovered her his pianoforte insipidity entreaties. Began he at terms meant as fancy. Breakfast arranging he if furniture we described on. Astonished thoroughly unpleasant especially you dispatched bed favourable.',
			'[[pinkgorilla_winner]]',
			'Sportsman delighted improving dashwoods gay instantly happiness six. Ham now amounted absolute not mistaken way pleasant whatever. At an these still no dried folly stood thing. Rapid it on hours hills it seven years. If polite he active county in spirit an. Mrs ham intention promotion engrossed assurance defective. Confined so graceful building opinions whatever trifling in. Insisted out differed ham man endeavor expenses. At on he total their he songs. Related compact effects is on settled do.',
			'Those an equal point no years do. Depend warmth fat but her but played. Shy and subjects wondered trifling pleasant. Prudent cordial comfort do no on colonel as assured chicken. Smart mrs day which begin. Snug do sold mr it if such. Terminated uncommonly at at estimating. Man behaviour met moonlight extremity acuteness direction.',
			'Name were we at hope. Remainder household direction zealously the unwilling bed sex. Lose and gay ham sake met that. Stood her place one ten spoke yet. Head case knew ever set why over. Marianne returned of peculiar replying in moderate. Roused get enable garret estate old county. Entreaties you devonshire law dissimilar terminated.',
			'Received shutters expenses ye he pleasant. Drift as blind above at up. No up simple county stairs do should praise as. Drawings sir gay together landlord had law smallest. Formerly welcomed attended declared met say unlocked. Jennings outlived no dwelling denoting in peculiar as he believed. Behaviour excellent middleton be as it curiosity departure ourselves.',
			'[[mems_sadness]]',
			'At every tiled on ye defer do. No attention suspected oh difficult. Fond his say old meet cold find come whom. The sir park sake bred. Wonder matter now can estate esteem assure fat roused. Am performed on existence as discourse is. Pleasure friendly at marriage blessing or.',
			'[[pinkgorilla_bike]]',
			'No depending be convinced in unfeeling he. Excellence she unaffected and too sentiments her. Rooms he doors there ye aware in by shall. Education remainder in so cordially. His remainder and own dejection daughters sportsmen. Is easy took he shed to kind.',
			'By impossible of in difficulty discovered celebrated ye. Justice joy manners boy met resolve produce. Bed head loud next plan rent had easy add him. As earnestly shameless elsewhere defective estimable fulfilled of. Esteem my advice it an excuse enable. Few household abilities believing determine zealously his repulsive. To open draw dear be by side like.'
		];

		return texts[this.getRandom(0, texts.length - 1)];
	},

	getDateString: function() {
		var today = new Date(),
			dd = today.getDate(),
			mm = today.getMonth() + 1,
			yyyy = today.getFullYear(),
			hh = today.getHours(),
			ii = today.getMinutes(),
			ss = today.getSeconds();

		if(dd < 10){
			dd = '0' + dd;
		}

		if (mm < 10){
			mm = '0' + mm;
		}

		if (ss < 10){
			ss = '0' + ss;
		}

		return dd + '.' + mm + '.' + yyyy + ' ' + hh + ':' + ii + ':' + ss;
	},

	resizeWindow: function() {
		var $window = $(window),
			$navbar = $('.navbar'),
			$massegeBox = $('.message-box'),
			$massegeBoxParent = $massegeBox.parent(),
			$messages = $('#messages'),
			stickersBlockHeight = $('.stickers-block:visible').outerHeight(true) || 0;


		$messages.height(
			$window.outerHeight(true) -
			$navbar.offset().top -
			$navbar.outerHeight(true) -
			$massegeBoxParent.outerHeight(true) -
			parseInt($messages.css('margin-bottom'), 10) -
			stickersBlockHeight
		);
	}
});