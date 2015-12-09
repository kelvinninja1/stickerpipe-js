
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

	// todo: rename to stickerpipe
	stickers: null,
	randomUsers: [],
	currentUser: {},

	$window: null,
	$navbar: null,
	$messages: null,
	$messageBox: null,
	$stickerPipeBlock: null,
	$stickerPipeStickers: null,
	$stickerPipeStore: null,
	$stickersToggle: null,
	$textarea: null,

	init: function() {
		this.$window = $(window);
		this.$navbar = $('.navbar');
		this.$messages = $('#messages');
		this.$messageBox = $('#messageBox');
		this.$stickerPipeBlock = $('#stickerPipe');
		this.$stickerPipeStickers = $('#stickers');
		this.$stickerPipeStore = $('#store');
		this.$stickersToggle = this.$messageBox.find('#stickersToggle');
		this.$textarea = this.$messageBox.find('.textarea');

		this.fetchRandomUsers().done((function() {
			this.sendMessage();
			this.sendMessage(true);
			this.sendMessage();
		}).bind(this));
		this.initLoDash();
		this.initMessageBox();
		this.initStickers();

		this.$window.resize((function() {
			this.resizeWindow();
		}).bind(this));

		this.$messageBox.find('.textarea').on('autosize:resized', (function() {
			this.resizeWindow();
		}).bind(this));

		_.delay((function() {
			this.$window.resize();
		}).bind(this), 100);

		this.$messages.on('click', 'img[data-sticker]', (function(e) {
			var $target = $(e.target);
			//this.openStickersStore($target.attr('data-sticker-pack'));
		}).bind(this));

		//this.$stickersToggle.popover({
		//	content: '213 dfgfgdfg dfgdfgdfg dfgdfgdfgf dfgdfgdgf dfgdfgdfgd ',
		//	placement: 'top',
		//	html: true,
		//	viewport: this.$messageBox
		//});
	},
	initLoDash: function() {
		// setting lo-dash template
		_.templateSettings = {
			evaluate: /\{\[([\s\S]+?)\]\}/g,   // {[ alert() ]}
			interpolate: /\{\{([\s\S]+?)\}\}/g, // {{ name }}
			escape: /\{\{-([\s\S]+?)-\}\}/g // {{- html -}}
		};
	},
	initStickers: function() {
		this.stickers = new Stickers({

			debug: true,

			elId: 'stickersToggle',

			storeContainerId: this.$stickerPipeStore.attr('id'),

			htmlForEmptyRecent: '<div class="emptyRecent">empty recent text</div>',

			apikey: '72921666b5ff8651f374747bfefaf7b2',

			storagePrefix: 'stickerPipe',
			enableEmojiTab: true,
			enableHistoryTab: true,

			userId: '12345678901234567890123456789012',

			callbacks: {
				onPurchase: (function(packTitle, productId, price, packName) {
					if (confirm('#' + productId + ' Вы действительно хотите купить пак "' + packTitle + '", за '+ price + ' UAH?')) {
						this.stickers.purchaseSuccess(packName);
					}
				}).bind(this),

				onPackStoreSuccess: function(packName) {
					console.log('Спасибо за покупку!');
				},

				onPackStoreFail: function(packName) {
					alert('Произошла ошибка при покупке пака. Повторите еще раз!')
				}
			},

			functions: {
				showPackCollection: (function(packName) {
					this.openStickers(packName);
				}).bind(this)
			}

		});

		if (this.stickers.getNewStickersFlag()) {
			this.$stickersToggle.addClass('has-new-content');
		}

		this.stickers.render((function() {
			// todo: make as event
			this.stickers.onClickSticker((function(text) {
				this.sendMessage(true, text);
			}).bind(this));

			// todo: make as event
			this.stickers.onClickEmoji((function(emoji) {
				console.log('click on emoji', emoji);
				this.$textarea.focus();
				this.pasteHtmlAtCaret(this.stickers.parseEmojiFromText(emoji));
			}).bind(this));
		}).bind(this));


		this.resizeWindow();
		// todo: events
		//this.stickers.onClickSticker((function(text) {
		//	this.sendMessage(true, text);
		//}).bind(this));
		//
		//// todo: events
		//this.stickers.onClickEmoji((function(emoji) {
		//	console.log('click on emoji', emoji);
		//	this.$textarea.focus();
		//	this.pasteHtmlAtCaret(this.stickers.parseEmojiFromText(emoji));
		//}).bind(this));

		this.$window.on('sp:content:highlight:show', (function() {
			this.$stickersToggle.addClass('has-new-content');
		}).bind(this));

		this.$window.on('sp:content:highlight:hide', (function() {
			this.$stickersToggle.removeClass('has-new-content');
		}).bind(this));
	},
	initMessageBox: function() {
		var self = this,
			sendMessageHandler = (function() {
				this.sendMessage(true, self.$textarea.html());

				self.$textarea.html('');
			}).bind(this);


		this.$textarea.on('keydown', function (e) {

			if (e.keyCode != 13) return;

			e.preventDefault();

			if (e.keyCode == 13 && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
				self.$textarea.focus();
				self.pasteHtmlAtCaret('<br/>');
				return;
			}

			sendMessageHandler();
		});

		this.$messageBox.find('button[type=submit]').on('click', function() {
			sendMessageHandler();
		});

		this.$stickersToggle.on('click', (function() {
			if (this.$stickersToggle.hasClass('active')) {
				this.closeStickerPipeBlock();
			} else {
				this.openStickers();
			}
		}).bind(this));

		window.addEventListener('sp.popover.shown', (function() {
			this.$stickersToggle.addClass('active');
		}).bind(this));

		window.addEventListener('sp.popover.hidden', (function() {
			this.$stickersToggle.removeClass('active');
		}).bind(this));
	},

	pasteHtmlAtCaret: function(html) {
		var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();

				// Range.createContextualFragment() would be useful here but is
				// only relatively recently standardized and is not supported in
				// some browsers (IE9, for one)
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node, lastNode;
				while ( (node = el.firstChild) ) {
					lastNode = frag.appendChild(node);
				}
				var firstNode = frag.firstChild;
				range.insertNode(frag);

				// Preserve the selection
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		} else if ( (sel = document.selection) && sel.type != "Control") {
			// IE < 9
			var originalRange = sel.createRange();
			originalRange.collapse(true);
			sel.createRange().pasteHTML(html);
		}
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

		var messageTemplate = _.template($('#messageTemplate').html());

		this.$messages.append(messageTemplate({
			isCurrentUser: isCurrentUser,
			user: user,
			text: text,
			date: this.getDateString(0),
			sticker: parseSticker
		})).animate({ scrollTop: this.$messages[0].scrollHeight }, 1000);
	},

	openStickerPipeBlock: function(completeCallback) {

		if (this.$stickersToggle.hasClass('active')) {
			completeCallback && completeCallback();
			return;
		}

		var messagesHeight = this.$messages.height();
		this.$messages.attr('data-saved-height', messagesHeight);

		//this.$stickersToggle.addClass('active');

		this.$stickerPipeBlock.slideDown({
			progress: (function() {
				this.$messages.height(messagesHeight - this.$stickerPipeBlock.height());
			}).bind(this),
			complete: function() {
				completeCallback && completeCallback();
			}
		});
	},
	closeStickerPipeBlock: function() {
		if (!this.$stickersToggle.hasClass('active')) {
			return;
		}

		var messagesSavedHeight = this.$messages.attr('data-saved-height');

		//this.$stickersToggle.removeClass('active');

		this.$stickerPipeBlock.slideUp({
			progress: (function() {
				this.$messages.height(messagesSavedHeight - this.$stickerPipeBlock.height());
			}).bind(this)
		});
	},

	openStickers: function(packName) {

		this.$stickerPipeStickers.show();
		this.$stickerPipeStore.hide();

		this.openStickerPipeBlock((function() {
			if (packName) {
				this.stickers.renderCurrentTab(packName);
			}
		}).bind(this));
	},
	openStickersStore: function(packName) {

		this.$stickerPipeStickers.hide();
		this.$stickerPipeStore.show();

		this.openStickerPipeBlock();

		this.resizeWindow();

		this.stickers.renderPack(packName);
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

		this.$messages.height(
			this.$window.outerHeight(true) -
			this.$navbar.offset().top -
			this.$navbar.outerHeight(true) -
			this.$messageBox.parent().outerHeight(true) -
			parseInt(this.$messages.css('margin-bottom'), 10) -
			(this.$stickerPipeBlock.is(':visible') ? this.$stickerPipeBlock.outerHeight(true) : 0)
		);
	}
});