
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
	this._constructor(options);
}, {

	stickerpipe: null,
	randomUsers: [],
	currentUser: {},

	$window: $(window),
	$body: $('body'),
	$navbar: $('.navbar'),
	$messages: $('#messages'),
	$messageBox: $('#messageBox'),
	$stickersToggle: $('#stickersToggle'),
	$textarea: $('.textarea'),
	$wipeData: $('#wipeData'),

	configs: {
		stickerpipe: {}
	},

	envConfigs: {
		local: {
			stickerpipe: {
				sdkUrl: 'libs/sdk/stable/',
				apiUrl: 'http://work.stk.908.vc',
				//storeUrl: 'http://localhost/stickerpipe/store/build'
			}
		},
		work: {
			stickerpipe: {
				sdkUrl: 'libs/sdk/stable/',
				apiUrl: 'http://work.stk.908.vc'
			}
		},
		prod: {
			stickerpipe: {
				sdkUrl: 'libs/sdk/stable/'
			}
		}
	},

	getEnvConfigs: function() {
		var arr = window.location.href.split('/');

		switch (arr[2]) {
			case 'localhost':
				return this.envConfigs.local;
			case 'demo.stk.908.vc':
				return this.envConfigs.work;
			default:
				return this.envConfigs.prod;
		}
	},

	_constructor: function() {

		var envConfigs = this.getEnvConfigs();

		var $head = $('head');
		$head.append('<link rel="stylesheet" type="text/css" href="' + envConfigs.stickerpipe.sdkUrl + 'css/stickerpipe.css">');
		$head.append('<script src="' + envConfigs.stickerpipe.sdkUrl + 'js/stickerpipe.js"></script>">');

		if (envConfigs.stickerpipe.apiUrl) {
			StickersModule.Configs.apiUrl = envConfigs.stickerpipe.apiUrl;
		}

		if (envConfigs.stickerpipe.storeUrl) {
			StickersModule.Configs.storeUrl = envConfigs.stickerpipe.storeUrl;
		}

		this.init();
	},

	init: function() {
		// setting lo-dash template
		_.templateSettings = {
			evaluate: /\{\[([\s\S]+?)\]\}/g,   // {[ alert() ]}
			interpolate: /\{\{([\s\S]+?)\}\}/g, // {{ name }}
			escape: /\{\{-([\s\S]+?)-\}\}/g // {{- html -}}
		};

		this.configs.stickerpipe = {
			elId: 'stickersToggle',

			apiKey: '72921666b5ff8651f374747bfefaf7b2',

			enableEmojiTab: true,
			enableHistoryTab: true,
			enableStoreTab: true,

			userId: this.getUserId(),
			userPremium: this.isUserPremium(),
			userData: {
				age: 20,
				gender: 'male'
			},

			primaryColor: '#9c27b0',

			priceB: '4.99 UAH',
			priceC: '9.99 UAH'
		};

		this.$wipeData.on('click', (function() {
			localStorage.clear();
			location.reload();
		}).bind(this));

		this.initStickers();

		var self = this;

		setTimeout(function() {
			self.sendMessage(false, '', true, false);
			self.sendMessage(true, '', true, false);
			self.sendMessage(false, '', true, false);
			self.sendMessage(true, '[[stevie40_1576]]', false, false);
		}, 500);

		this.fetchRandomUsersMock();
		this.initMessageBox();

		_.delay((function() {
			this.$window.resize();
		}).bind(this), 100);

		this.$messages.on('click', 'img.stickerpipe-sticker', (function(e) {
			var $target = $(e.target);

			this.stickerpipe.openStore($target.attr('data-sticker-id'));
		}).bind(this));
	},
	initStickers: function() {

		this.stickerpipe = new Stickers(this.configs.stickerpipe);

		this.stickerpipe.render((function() {
			// todo: make as event
			this.stickerpipe.onClickSticker((function(text) {
				this.sendMessage(true, text);
			}).bind(this));

			// todo: make as event
			this.stickerpipe.onClickEmoji((function(emoji) {
				console.log('click on emoji', emoji);
				this.$textarea.focus();
				this.pasteHtmlAtCaret(this.stickerpipe.parseEmojiFromText(emoji));
			}).bind(this));

			var _pack = this.getUrlParameter('pack');
			if (!!_pack) {
				this.stickerpipe.fetchPacks((function() {
						this.stickerpipe.open(_pack);
					}).bind(this)
				);
			}

		}).bind(this));

		this.$window.on('sp:popover:shown', (function() {
			this.$stickersToggle.addClass('active');
		}).bind(this));

		this.$window.on('sp:popover:hidden', (function() {
			this.$stickersToggle.removeClass('active');
		}).bind(this));

		this.stickerpipe.onPurchase((function(packName, packTitle, pricePoint) {

			var result = confirm('Вы действительно хотите купить пак "' + packTitle + '" за ' + this.configs.stickerpipe['price' + pricePoint] + '?');

			if (result) {
				this.stickerpipe.purchaseSuccess(packName, pricePoint);
			} else {
				this.stickerpipe.purchaseFail();
			}
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

	sendMessage: function(isCurrentUser, text, random, trackToStatistic) {

		trackToStatistic = (typeof trackToStatistic == 'undefined') ? true : trackToStatistic;

		text = text && text.trim();
		random = random || false;

		if (random) {
			text = this.getRandomMessageText();
		}

		if (!text) {
			return;
		}

		text = text.replace(new RegExp('\r?\n','g'), '<br />');

		var user = this.currentUser;

		if (!isCurrentUser) {
			user = this.getRandomUser();
		}

		this.stickerpipe.parseStickerFromText(text, (function(sticker) {
			trackToStatistic && this.stickerpipe.onUserMessageSent(!!sticker);

			var messageTemplate = _.template($('#messageTemplate').html());

			this.$messages.append(messageTemplate({
				isCurrentUser: isCurrentUser,
				user: user,
				text: text,
				date: this.getDateString(0),
				sticker: sticker
			}));

			this.$body.animate({ scrollTop: this.$body[0].scrollHeight }, 0);
		}).bind(this));
	},

	getUrlParameter: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	fetchRandomUsersMock: function() {
		var jsonString = '{"results":[{"user":{"gender":"male","name":{"title":"mr","first":"connor","last":"daniels"},"location":{"street":"6488 third st","city":"portland","state":"arizona","zip":"52462"},"email":"connor.daniels67@example.com","username":"goldenrabbit221","password":"mother","salt":"fqB7DJL3","md5":"68c4545d77c02b3b0049bedc5fa05451","sha1":"ddc2fc130ff11c6f5e4ad64576378683411d262a","sha256":"0a679faafd00ac76df811ae2e2a08ac5bc417640ef05ee27748218211ad74696","registered":"1022167838","dob":"378548641","phone":"(514)-286-4406","cell":"(557)-603-5445","SSN":"365-53-1248","picture":"http://api.randomuser.me/portraits/men/68.jpg"},"seed":"57bf0945e480c93","version":"0.4"},{"user":{"gender":"female","name":{"title":"miss","first":"rosa","last":"hart"},"location":{"street":"7095 adelaide ave","city":"bernalillo","state":"indiana","zip":"19473"},"email":"rosa.hart76@example.com","username":"blackswan710","password":"myxworld","salt":"keuI2YPU","md5":"b2ddeae4c30dd8f4d8cb67860c8d8f4d","sha1":"a07f206acd67037adbbedb5a9e797807972afc47","sha256":"019f862b0161bcc1e240e283efd7453128a9e0bdfc6ce731cd582923a6c4215a","registered":"1032788871","dob":"35620167","phone":"(200)-755-1221","cell":"(772)-479-8129","SSN":"848-49-5410","picture":"http://api.randomuser.me/portraits/women/59.jpg"},"seed":"d57c61e5f056620","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"harvey","last":"carlson"},"location":{"street":"1110 watika st","city":"fountain valley","state":"missouri","zip":"33811"},"email":"harvey.carlson73@example.com","username":"purplebear498","password":"neville","salt":"GEJlz0Qb","md5":"c8e29b95e99aa3162e1624f13f197575","sha1":"2ab466fee3c30828e6b1500147ab656a8576986d","sha256":"09b3ebb0de448641c223d52230476a766a7da24cb5d5b9b43ba2b8efc756e578","registered":"1090373683","dob":"276426569","phone":"(886)-635-7265","cell":"(102)-616-8959","SSN":"288-41-1767","picture":"http://api.randomuser.me/portraits/men/49.jpg"},"seed":"93cadef2c93b4d3","version":"0.4"},{"user":{"gender":"female","name":{"title":"mrs","first":"ramona","last":"brown"},"location":{"street":"1361 adelaide ave","city":"tulsa","state":"montana","zip":"56796"},"email":"ramona.brown10@example.com","username":"lazylion120","password":"newlife","salt":"blzYix4k","md5":"63df08c53d38a90d756d8277f18cad1f","sha1":"e0698327acb469e40edc8006ab268cb8fc522fb0","sha256":"9c3e8c04941a8c3b3ed3e5db20902d34f7805a0c58fe708e8e3e599f6024bdc4","registered":"1408722369","dob":"445345465","phone":"(165)-493-3733","cell":"(338)-937-1344","SSN":"449-45-7467","picture":"http://api.randomuser.me/portraits/women/22.jpg"},"seed":"9c27c751f8fc1a8","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"kenneth","last":"taylor"},"location":{"street":"4745 photinia ave","city":"grapevine","state":"vermont","zip":"29220"},"email":"kenneth.taylor73@example.com","username":"blueladybug11","password":"warrior1","salt":"gAwoaSfc","md5":"977aa69bc2cb5cd01d54cdb0acd702e0","sha1":"14cfe8f590a3f886d4775744597024684a72ac12","sha256":"e3a37c82b32096419ef49fe1cd13a1885eab9eac847bfe2cb8a2733478a8ba5b","registered":"1312528457","dob":"77409657","phone":"(377)-661-7689","cell":"(232)-347-5196","SSN":"294-31-8282","picture":"http://api.randomuser.me/portraits/men/74.jpg"},"seed":"8f412df2cc5f42f","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"darren","last":"fisher"},"location":{"street":"4157 dogwood ave","city":"medford","state":"washington","zip":"13027"},"email":"darren.fisher98@example.com","username":"goldenwolf127","password":"hobbes","salt":"z3qdwWm5","md5":"eb16111266dace3db2f3153d865cf8d8","sha1":"ad701862996dc69cbea8c5d88f34c2ff0527bd55","sha256":"a50ef86e1b3f34091e61078499cba7b8de2600cdba7d18b55d209f57bd05fec9","registered":"1406924205","dob":"158500626","phone":"(476)-810-8497","cell":"(886)-700-8808","SSN":"845-76-2000","picture":"http://api.randomuser.me/portraits/men/77.jpg"},"seed":"7905aadfc678008","version":"0.4"},{"user":{"gender":"female","name":{"title":"mrs","first":"tonya","last":"welch"},"location":{"street":"7588 genschaw rd","city":"shiloh","state":"delaware","zip":"11591"},"email":"tonya.welch79@example.com","username":"silverswan752","password":"spinner","salt":"NORFox6U","md5":"357cf6d74194b9971d2773278838bb81","sha1":"8538063f3ceb9f67e1cc0eb7021a2f3664961467","sha256":"4fde117906a3fb8f9f78eb13320116323887ecb47684be8bd1990618434b4f54","registered":"964082544","dob":"232561907","phone":"(497)-697-9218","cell":"(798)-545-4324","SSN":"405-81-4571","picture":"http://api.randomuser.me/portraits/women/24.jpg"},"seed":"d6df9b37636a3fe","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"eric","last":"anderson"},"location":{"street":"7868 pine rd","city":"richmond","state":"michigan","zip":"43281"},"email":"eric.anderson26@example.com","username":"bluebutterfly953","password":"hogtied","salt":"VknHNfRx","md5":"2958906f465241b6ee72101e7582b203","sha1":"20736265ca00ef3c94ee8e4fc24f881648e4ea7c","sha256":"5cd29232b9fc9f6b145c722da3c15e7bd9a91946cd313784d9c0f062c1954cec","registered":"1270526708","dob":"295580399","phone":"(160)-499-9265","cell":"(492)-438-9304","SSN":"277-27-2826","picture":"http://api.randomuser.me/portraits/men/96.jpg"},"seed":"ef9c2507f2c1175","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"connor","last":"schmidt"},"location":{"street":"7085 lake dr","city":"seagoville","state":"alaska","zip":"47196"},"email":"connor.schmidt16@example.com","username":"orangeduck141","password":"katana","salt":"ujuPynZm","md5":"67a21454d172766d238e48ea2ba1faf7","sha1":"bebf75de4cedc149d89f79030fc8e5d262d35d78","sha256":"a5d6a590621f39d2b03f2a5d626761c3d166137ec8b22918b1f8af5b32675cae","registered":"1163542611","dob":"24592329","phone":"(751)-121-5908","cell":"(281)-946-1681","SSN":"382-17-3489","picture":"http://api.randomuser.me/portraits/men/78.jpg"},"seed":"c264e52753f10fa","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"jamie","last":"gutierrez"},"location":{"street":"1552 e center st","city":"greeley","state":"mississippi","zip":"79900"},"email":"jamie.gutierrez39@example.com","username":"heavyduck248","password":"626262","salt":"dOSSPXPx","md5":"7272ae72fad8301a44ec0d89b2cbb449","sha1":"9034b10992677bb2556b329b3992f68bf30775a6","sha256":"76121efb1b03faebb66ba475b7548e0a35c10bba4b0f576480eb44fd5c84ae65","registered":"931427432","dob":"259177512","phone":"(885)-745-6899","cell":"(776)-360-1048","SSN":"714-26-1078","picture":"http://api.randomuser.me/portraits/men/77.jpg"},"seed":"f24e5f711a1716f","version":"0.4"},{"user":{"gender":"female","name":{"title":"miss","first":"stacy","last":"lewis"},"location":{"street":"1086 crockett st","city":"addison","state":"iawaii","zip":"11688"},"email":"stacy.lewis43@example.com","username":"yellowwolf265","password":"bears","salt":"91KbnaQf","md5":"6f7ab014b8906fa08cd78f860c23e4fc","sha1":"f577f5c2d988958eefc211ef9e287b2ff2e2e621","sha256":"a6e8980cb6bc6d8377e297c6f50619d086b5bbf77666c562c33a25b75d411b37","registered":"1020722679","dob":"328432772","phone":"(813)-604-1286","cell":"(151)-345-6839","SSN":"383-89-6105","picture":"http://api.randomuser.me/portraits/women/49.jpg"},"seed":"52108f56855358f","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"tim","last":"cox"},"location":{"street":"1496 first street","city":"wilmington","state":"idaho","zip":"50130"},"email":"tim.cox46@example.com","username":"ticklishmouse284","password":"konyor","salt":"zZXqXGny","md5":"c79c95b319a262aa247ff51c1476d9f5","sha1":"019c95b2155cf42b5ebef049c1423c01083d81c7","sha256":"d774b521f4169eb9aec38b730da1cc91b4fd2442b9b28270a056a6ea0fbfa9c5","registered":"1074504126","dob":"333119767","phone":"(218)-976-5057","cell":"(459)-483-1624","SSN":"208-39-9836","picture":"http://api.randomuser.me/portraits/men/67.jpg"},"seed":"f2fcf855aee67db","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"louis","last":"graham"},"location":{"street":"8106 hunters creek dr","city":"fremont","state":"washington","zip":"63831"},"email":"louis.graham90@example.com","username":"beautifulduck683","password":"kswbdu","salt":"KAvejOJr","md5":"5ac453ccceff7d559ba3e9a3a95a1261","sha1":"275d8502f6d3e15fd8573aff1cd5e177e533ecc2","sha256":"565b03dc90c71d43420b66823e40333ac4b7a91293f668586d16d71148b98749","registered":"1225901985","dob":"197550695","phone":"(319)-242-6132","cell":"(424)-918-7232","SSN":"365-60-8556","picture":"http://api.randomuser.me/portraits/men/81.jpg"},"seed":"868f7b20c3a9b47","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"patrick","last":"boyd"},"location":{"street":"6263 valley view ln","city":"flowermound","state":"louisiana","zip":"61473"},"email":"patrick.boyd76@example.com","username":"greenmouse395","password":"1214","salt":"hJnUiW6u","md5":"31791bb5aa13889b67fd6270d52c8ed1","sha1":"46323401b76bd91b4b8575663b325f9dc828d933","sha256":"90b8f645bb53608da78588bcce34812d59fe40f25a6b2a3aafe29a91be2ffb15","registered":"1211569701","dob":"61108980","phone":"(213)-270-9970","cell":"(426)-437-1033","SSN":"524-28-2054","picture":"http://api.randomuser.me/portraits/men/92.jpg"},"seed":"f962f1010ad3672","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"lucas","last":"lawson"},"location":{"street":"2991 sweards bluff ave","city":"aubrey","state":"colorado","zip":"72638"},"email":"lucas.lawson49@example.com","username":"beautifulostrich931","password":"poetry","salt":"FyNguljR","md5":"af2eee9d4946a5f8edeed0753b5e152e","sha1":"b7beadb2d32c1d25244754eadf321266b7f3add9","sha256":"7ac6ae080e3ba95ea05043502a1646badb29809f19ee24eb6880555f03147b84","registered":"1234580324","dob":"147455814","phone":"(310)-424-7944","cell":"(722)-685-5161","SSN":"199-79-2500","picture":"http://api.randomuser.me/portraits/men/83.jpg"},"seed":"148e274620f6263","version":"0.4"},{"user":{"gender":"female","name":{"title":"ms","first":"louella","last":"lambert"},"location":{"street":"4760 w dallas st","city":"grand rapids","state":"utah","zip":"70691"},"email":"louella.lambert50@example.com","username":"brownrabbit721","password":"capricor","salt":"GY6kqgus","md5":"c5a1db0ec454562f12e45c7206f250fd","sha1":"84fff0d66cd021e5cafc35c16f6d3233a028149a","sha256":"88eda4de119271117f4024a90acf54b25f1cb03da76609ed2623db51b6b71845","registered":"941551051","dob":"93780119","phone":"(319)-872-2107","cell":"(385)-886-6549","SSN":"835-38-3230","picture":"http://api.randomuser.me/portraits/women/36.jpg"},"seed":"ba67546e2390434","version":"0.4"},{"user":{"gender":"female","name":{"title":"mrs","first":"zoe","last":"berry"},"location":{"street":"1923 elm dr","city":"sacramento","state":"tennessee","zip":"71713"},"email":"zoe.berry74@example.com","username":"orangefish306","password":"ling","salt":"Jaoemzgt","md5":"d2d622b4c50566c5a72d3ab3ebf64126","sha1":"fabbc6d1d4895c8547a97a849a34a8f6142bb1a9","sha256":"50fcd93a14d5169d388e9972908f431a5d150c5b312233cebabd73c9674a1fb9","registered":"1069609048","dob":"396281284","phone":"(753)-371-6226","cell":"(455)-222-8841","SSN":"886-54-4824","picture":"http://api.randomuser.me/portraits/women/15.jpg"},"seed":"867188c8bee0a7c","version":"0.4"},{"user":{"gender":"female","name":{"title":"ms","first":"aubree","last":"owens"},"location":{"street":"8203 dane st","city":"san jose","state":"montana","zip":"14692"},"email":"aubree.owens93@example.com","username":"purplefrog164","password":"hughes","salt":"IEUnUz9V","md5":"3a6ea68b6aa6f49796dd181f1621bdc2","sha1":"e9b2ba5845619c89277cf132c1d10254a64b2ed7","sha256":"63db6245baf79d710001f7b54f5018970d95eaa0fd2157c86d7644e7bfa4b67c","registered":"1375589108","dob":"114216087","phone":"(349)-507-5652","cell":"(741)-485-3089","SSN":"308-53-7293","picture":"http://api.randomuser.me/portraits/women/91.jpg"},"seed":"a4e85ac977f52ea","version":"0.4"},{"user":{"gender":"female","name":{"title":"miss","first":"genesis","last":"mills"},"location":{"street":"8551 beatles ave","city":"coppell","state":"massachusetts","zip":"96887"},"email":"genesis.mills92@example.com","username":"yellowelephant770","password":"zachary","salt":"CJdNpdyO","md5":"2c618a3950260199b1bfa29a03f261c1","sha1":"d61e73fc13567c33aa9e0e5600d4d119aa2b989f","sha256":"599fa0a7bef99c1c918295f96f81c8d838be039edfe60e9fdddc52e6c39925c5","registered":"1269082198","dob":"332578865","phone":"(224)-528-4697","cell":"(949)-239-7954","SSN":"853-67-3281","picture":"http://api.randomuser.me/portraits/women/37.jpg"},"seed":"c5b6a5d8dd17969","version":"0.4"},{"user":{"gender":"male","name":{"title":"mr","first":"rick","last":"miles"},"location":{"street":"4617 w tropical pkwy","city":"pittsburgh","state":"alabama","zip":"33617"},"email":"rick.miles95@example.com","username":"goldenwolf248","password":"vienna","salt":"7KLOZy8d","md5":"5462d09735df231631b2c9e8718b14c9","sha1":"eedd2cef9b20c28f23f5c14135864eb4b622f865","sha256":"0c0808ee549d2481e22335881e4f78f32a0d8081d548466ef4d732475a5febd4","registered":"1050259948","dob":"464837252","phone":"(261)-648-8296","cell":"(222)-532-1584","SSN":"345-98-7091","picture":"http://api.randomuser.me/portraits/men/6.jpg"},"seed":"ea03e4126feb0ee","version":"0.4"}]}';
		var data = JSON.parse(jsonString);

		if (!data.results) return;

		this.currentUser = data.results.pop()['user'];
		this.randomUsers = _.map(data.results, function(userData) {
			return userData['user'];
		});
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
			'At every tiled on ye defer do. No attention suspected oh difficult. Fond his say old meet cold find come whom. The sir park sake bred. Wonder matter now can estate esteem assure fat roused. Am performed on existence as discourse is. Pleasure friendly at marriage blessing or.',
			'[[pinkgorilla_bike]]',
			'No depending be convinced in unfeeling he. Excellence she unaffected and too sentiments her. Rooms he doors there ye aware in by shall. Education remainder in so cordially. His remainder and own dejection daughters sportsmen. Is easy took he shed to kind.',
			'At every tiled on ye defer do. No attention suspected oh difficult. Fond his say old meet cold find come whom. The sir park sake bred. Wonder matter now can estate esteem assure fat roused. Am performed on existence as discourse is. Pleasure friendly at marriage blessing or.',
			'By impossible of in difficulty discovered celebrated ye. Justice joy manners boy met resolve produce. Bed head loud next plan rent had easy add him. As earnestly shameless elsewhere defective estimable fulfilled of. Esteem my advice it an excuse enable. Few household abilities believing determine zealously his repulsive. To open draw dear be by side like.'
		];

		return texts[this.getRandom(0, texts.length - 1)];
	},

	getUserId: function() {
		var userId = localStorage.getItem('userId'),
			resetUserId = this.getUrlParameter('resetUserId');


		if ((!!resetUserId && parseInt(resetUserId, 10) == 1) || !userId) {
			userId = this.getRandom(1, 1000);
			localStorage.setItem('userId', userId);
		}

		return userId;
	},
	isUserPremium: function() {
		var userPremium = this.getUrlParameter('userPremium');
		if (!userPremium) {
			userPremium = '0';
		}
		userPremium = (parseInt(userPremium, 10) == 1);
		return userPremium;
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
	}
});