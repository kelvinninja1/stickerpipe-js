
document.addEventListener("DOMContentLoaded", function(event) {

    if(typeof window.ga === "undefined"){

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    }

    ga('create', 'UA-1113296-81', 'auto', {'name': 'stickerTracker'});
    ga('stickerTracker.send', 'pageview');

});

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

		storagePrefix: 'stickerPipe',
		enableCustomTab: false,

		userId: null

	};

})(window);


(function(Plugin) {

	Plugin.StickersModule = Plugin.StickersModule || {};

	Plugin.StickersModule.Class = function(source) {
		var _class = function() {
				this._constructor && this._constructor.apply(this, arguments);
			},
			_prototype = _class.prototype || {};

		for (var property in source) {
			_prototype[property] = source[property];
		}

		_class.prototype = _prototype;

		return _class;

	};

})(window);

(function(Plugin, Config) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    Plugin.StickersModule.Lockr = {
		prefix: Config.storagePrefix,

		_getPrefixedKey: function(key, options) {
			options = options || {};

			if (options.noPrefix) {
				return key;
			} else {
				return this.prefix + key;
			}
		},

		set: function (key, value, options) {
			var query_key = this._getPrefixedKey(key, options);

			try {
				localStorage.setItem(query_key, JSON.stringify({
					data: value
				}));
			} catch (e) {
				console && console.warn('Lockr didn\'t successfully save the "{'+ key +': '+ value +'}" pair, because the localStorage is full.');
			}
		},

		get: function (key, missing, options) {
			var query_key = this._getPrefixedKey(key, options),
				value;

			try {
				value = JSON.parse(localStorage.getItem(query_key));
			} catch (e) {
				value = null;
			}

			return (value === null) ? missing : (value.data || missing);
		},

		sadd: function(key, value, options) {
			var query_key = this._getPrefixedKey(key, options),
				json;

			var values = this.smembers(key);

			if (values.indexOf(value) > -1) {
				return null;
			}

			try {
				values.push(value);
				json = JSON.stringify({"data": values});
				localStorage.setItem(query_key, json);
			} catch (e) {
				if (console) {
					console.log(e);
					console.warn('Lockr didn\'t successfully add the '+ value +' to '+ key +' set, because the localStorage is full.');
				}
			}
		},

		smembers: function(key, options) {
			var query_key = this._getPrefixedKey(key, options),
				value;

			try {
				value = JSON.parse(localStorage.getItem(query_key));
			} catch (e) {
				value = null;
			}

			return (value === null) ? [] : (value.data || []);
		},

		sismember: function(key, value, options) {
			var query_key = this._getPrefixedKey(key, options);
			return this.smembers(key).indexOf(value) > -1;
		},

		getAll: function () {
			var keys = Object.keys(localStorage);

			return keys.map((function (key) {
				return this.get(key);
			}).bind(this));
		},

		srem: function(key, value, options) {
			var query_key = this._getPrefixedKey(key, options),
				json,
				index;

			var values = this.smembers(key, value);

			index = values.indexOf(value);

			if (index > -1)
				values.splice(index, 1);

			json = JSON.stringify({
				data: values
			});

			try {
				localStorage.setItem(query_key, json);
			} catch (e) {
				console && console.warn('Lockr couldn\'t remove the ' + value + ' from the set ' + key);
			}
		},

		rm: function (key) {
			localStorage.removeItem(key);
		},

		flush: function () {
			localStorage.clear();
		}
    };

})(window, window.StickersModule.Config);


(function(Plugin) {

	Plugin.StickersModule = Plugin.StickersModule || {};
	Plugin.StickersModule.MD5 = function (string) {

		string = string.toString();

		function RotateLeft(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}

		function AddUnsigned(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x,y,z) { return (x & y) | ((~x) & z); }
		function G(x,y,z) { return (x & z) | (y & (~z)); }
		function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }

		function FF(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function GG(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function HH(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function II(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		}

		function WordToHex(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		}

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		}

		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}

		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

		return temp.toLowerCase();
	};

})(window);

(function(Plugin, Lockr, MD5) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    Plugin.StickersModule.StickerHelper = {

        forEach: function(data, callback) {
            for (var x in data){
                callback(data[x], x);
            }
        },

        mergeOptions: function(obj1, obj2) {
			var obj3 = {};

			for(var attrname in obj1) {
				obj3[attrname] = obj1[attrname];
			}

			for(var attrname in obj2) {
				obj3[attrname] = obj2[attrname];
			}

			return obj3;
        },

        setEvent: function(eventType, el, className, callback) {

            el.addEventListener(eventType, function (event) {

                var el = event.target, found;

                while (el && !(found = el.className.match(className))) {
                    el = el.parentElement;
                }

                if (found) {
                    callback(el, event);
                }
            });

        },

        ajaxGet: function(url, apikey, callback, header) {

            header = header || {};

            var xmlhttp;

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    callback(JSON.parse(xmlhttp.responseText));
                }
            };
            xmlhttp.open('GET', url, true);
            xmlhttp.setRequestHeader('Apikey', apikey);
            xmlhttp.setRequestHeader('Platform', 'JS');

            this.forEach(header, function(value, name) {
                xmlhttp.setRequestHeader(name, value);
            });

            xmlhttp.send();
        },

        ajaxPost: function(url, apikey, data, callback, header) {
            var xmlhttp,
                uniqUserId = Lockr.get('uniqUserId');

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    callback && callback(JSON.parse(xmlhttp.responseText));
                }
            };


            if(typeof uniqUserId == 'undefined') {
                uniqUserId = + new Date();
                Lockr.set('uniqUserId', uniqUserId);
            }

            xmlhttp.open('POST', url, true);
            xmlhttp.setRequestHeader('Apikey', apikey);
            xmlhttp.setRequestHeader('Platform', 'JS');
            xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xmlhttp.setRequestHeader('DeviceId', uniqUserId);

            this.forEach(header, function(value, name) {
                xmlhttp.setRequestHeader(name, value);
            });

            xmlhttp.send(JSON.stringify(data));
        },

        md5: function(string) {
            return MD5(string);
        }

    };

})(window, window.StickersModule.Lockr, window.StickersModule.MD5);


(function(Plugin, Module) {


	Module.TabsView = Module.Class({

		el: null,
		scrollableContentEl: null,

		controlTabs: null,
		config: null,

		currentPage: 0,

		_constructor: function(config) {
			this.config = config;

			this.controlTabs = {
				custom: {
					id: 'spTabCustom',
					class: 'sp-tab-custom',
					content: this.config.customTabContent,
					number: -1,
					el: null
				},
				history: {
					id: 'spTabHistory',
					class: 'sp-tab-history',
					content: this.config.historyTabContent,
					number: -2,
					el: null
				},
				settings: {
					id: 'spTabSettings',
					class: 'sp-tab-settings',
					content: this.config.settingsTabContent,
					number: -3,
					el: null
				},
				store: {
					id: 'spTabSettings',
					class: 'sp-tab-store',
					content: this.config.storeTabContent,
					number: -4,
					el: null
				},
				prevPacks: {
					id: 'spTabPrevPacks',
					class: 'sp-tab-prev-packs',
					content: this.config.prevPacksTabContent,
					number: -5,
					el: null
				},
				nextPacks: {
					id: 'spTabNextPacks',
					class: 'sp-tab-next-packs',
					content: this.config.nextPacksTabContent,
					number: -6,
					el: null
				}
			};

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},

		// el == tabsEl
		render: function(el, stickerPacks, tabActive) {

			this.el = el;
			this.el.innerHTML = '';

			this.renderControlTab(this.el, this.controlTabs.prevPacks, tabActive);
			this.controlTabs.prevPacks.el.style.display = 'none';
			this.controlTabs.prevPacks.el.addEventListener('click', (function() {
				this.currentPage--;
				this.onWindowResize();
				this.scrollableContentEl.scrollLeft = this.scrollableContentWidth * this.currentPage;
			}).bind(this));

			// scrollable container

			this.scrollableContentEl = document.createElement('div');
			this.scrollableContentEl.style.float = 'left';

			this.scrollableContentEl.style.width = '300px';
			this.scrollableContentEl.style.whiteSpace = 'nowrap';
			this.scrollableContentEl.style.overflow = 'hidden';
			this.scrollableContentEl.style.display = 'flex';

			this.el.appendChild(this.scrollableContentEl);

			// ********************

			this.config.enableCustomTab && this.renderControlTab(this.scrollableContentEl, this.controlTabs.custom, tabActive);
			this.renderControlTab(this.scrollableContentEl, this.controlTabs.history, tabActive);

			//this.renderPackTab(stickerPacks[0], 0, tabActive);

			for (var j = 0; j < 6; j++) {
				for (var i = 0; i < stickerPacks.length; i++) {
					this.renderPackTab(stickerPacks[i], i, tabActive);
				}
			}

			this.renderControlTab(this.scrollableContentEl, this.controlTabs.settings, tabActive);
			this.renderControlTab(this.el, this.controlTabs.store, tabActive);

			this.renderControlTab(this.el, this.controlTabs.nextPacks, tabActive);
			this.controlTabs.nextPacks.el.addEventListener('click', (function() {
				this.currentPage++;
				this.onWindowResize();
				this.scrollableContentEl.scrollLeft = this.scrollableContentWidth * this.currentPage;
			}).bind(this));

			this.onWindowResize();
		},
		renderControlTab: function(el, tab, tabActive) {
			tab.el = this.renderTab(el, tab.id, [tab.class, 'sp-control-tab'], tab.number, tab.content, tabActive);
			return tab.el;
		},
		renderPackTab: function(pack, number, tabActive) {
			var classes = ['sp-pack-tab'];

			if(pack.newPack) {
				classes.push('sp-new-pack');
			}

			var iconSrc = this.config.domain + '/' +
				this.config.baseFolder + '/' +
				pack.pack_name + '/tab_icon_' +
				this.config.tabResolutionType + '.png';

			var content = '<img src=' + iconSrc + '>';

			this.renderTab(this.scrollableContentEl, null, classes, number, content, tabActive);
		},
		renderTab: function(el ,id, classes, dataTabNumber, content, tabActive) {
			var tabEl = document.createElement('span');

			if (id) {
				tabEl.id = id;
			}

			classes.push(this.config.tabItemClass);

			if (tabActive == dataTabNumber) {
				classes.push('active');
			}

			tabEl.classList.add.apply(tabEl.classList, classes);
			tabEl.setAttribute('data-tab-number', dataTabNumber);
			tabEl.innerHTML = content;

			el.appendChild(tabEl);

			return tabEl;
		},

		onWindowResize: function() {

			if (this.currentPage > 0) {
				this.controlTabs.prevPacks.el.style.display = 'inline-block';
			} else {
				this.controlTabs.prevPacks.el.style.display = 'none';
			}

			this.scrollableContentWidth = this.el.parentElement.offsetWidth
				- this.controlTabs.store.el.offsetWidth
				- this.controlTabs.nextPacks.el.offsetWidth
				- this.controlTabs.prevPacks.el.offsetWidth;

			this.scrollableContentEl.style.width = this.scrollableContentWidth + 'px';

			var packContainerWidth = this.scrollableContentWidth
				- this.controlTabs.custom.el.offsetWidth
				- this.controlTabs.history.el.offsetWidth;

			var packTabs = this.scrollableContentEl.getElementsByClassName('sp-pack-tab');

			var packTabWidth = packTabs[0].offsetWidth;
			var packTabsInRow = parseInt(packContainerWidth / packTabWidth, 10);

			var margin = (packContainerWidth - (packTabsInRow * packTabWidth)) / (2 * packTabsInRow);

			for(var i = 0; i <packTabs.length; i++) {
				packTabs[i].style.marginLeft = margin + 'px';
				packTabs[i].style.marginRight = margin + 'px';
			}

			if (this.scrollableContentEl.scrollWidth > this.scrollableContentEl.offsetWidth) {
				this.controlTabs.nextPacks.el.style.display = 'inline-block';
			} else {
				this.controlTabs.nextPacks.el.style.display = 'none';
			}
		}
	});

})(window, window.StickersModule);

(function(Plugin, Module) {

	var StickerHelper = Module.StickerHelper;

	Plugin.StickersModule.TabsController = Module.Class({

		config: null,
		view: null,

		_constructor: function(config) {
			this.config = config;
			this.view = new Module.TabsView(this.config);
		},

		handleClickTab: function(el, itemsClassName, callback) {
			StickerHelper.setEvent('click', el, itemsClassName, callback);
		}

	});

})(window, window.StickersModule);

(function(Plugin, Module) {

    Plugin.StickersModule.BaseController = Plugin.StickersModule.Class({

        handleClickSticker: function(el, itemsClassName, callback) {
            Module.StickerHelper.setEvent('click', el, itemsClassName, callback);
        }
    });

})(window, window.StickersModule);

(function(Plugin, StickerHelper, Lockr) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    Plugin.StickersModule.BaseService = function(Config) {

        var parseCountStat = 0,
            parseCountWithStickerStat = 0;

        var parseStickerStatHandle = function(is_have) {
            var nowDate = new Date().getTime()/1000|0;

            parseCountStat++;

            if(is_have) {
                parseCountWithStickerStat++;
            }

            if(parseCountStat >= 50) {

                StickerHelper.ajaxPost(Config.trackStatUrl, Config.apikey, [
                    {
                        action: 'check',
                        category: 'message',
                        label: 'Events count',
                        time: nowDate,
                        value: parseCountStat

                    },
                    {
                        action: 'check',
                        category: 'message',
                        label: 'Stickers count',
                        time: nowDate,
                        value: parseCountWithStickerStat
                    }

                ]);


                ga('stickerTracker.send', 'event', 'message', 'check', 'Events count', parseCountStat);
                ga('stickerTracker.send', 'event', 'message', 'check', 'Stickers count', parseCountWithStickerStat);

                parseCountWithStickerStat = 0;
                parseCountStat = 0;

            }

        };

        this.addToLatestUse = function(code) {

            var storageDate = Lockr.get("sticker_latest_use") || [],
                newStorageDate = [];

            StickerHelper.forEach(storageDate, function(codeFromStorage) {

                if(codeFromStorage.code != code) {
                    newStorageDate.push(codeFromStorage);
                }

            });

            storageDate = newStorageDate;

            storageDate.unshift({
                code : code
            });

            Lockr.set("sticker_latest_use", storageDate);
        };

        this.getNewStickersFlag = function(packs) {
            return Lockr.get("sticker_have_new");
        };

        this.resetNewStickersFlag = function(packs) {
            return Lockr.set("sticker_have_new", false);
        };

        this.getLatestUse = function() {
            return Lockr.get("sticker_latest_use") || [];
        };

        this.getPacksFromStorage = function() {
            var expireDate = ( + new Date()),
                packsObj = Lockr.get("sticker_packs");

            if(typeof packsObj === "undefined" ||
                packsObj.expireDate < expireDate) {

                return {
                    actual: false,
                    packs: typeof packsObj == "object" && packsObj.packs ? packsObj.packs : []
                };
            } else {

                return {
                    actual: true,
                    packs: packsObj.packs
                };
            }
        };

        this.markNewPacks = function(oldPacks, newPacks) {
            var globalNew = false;


            if(oldPacks.length != 0){

                StickerHelper.forEach(newPacks, function(newPack, key) {
                    var isNewPack = true;

                    StickerHelper.forEach(oldPacks, function(oldPack) {


                        if(newPack.pack_name == oldPack.pack_name) {
                            isNewPack = oldPack.newPack;
                        }

                    });

                    if(isNewPack)  globalNew = true;
                    newPacks[key]['newPack'] = isNewPack;
                });


                if(globalNew) {
                    Lockr.set('sticker_have_new', globalNew);
                }
            }

            return newPacks;
        };

        this.setPacksToStorage = function(packsObj) {
            var expireDate = new Date(),
                saveObj = {
                    packs: packsObj,
                    expireDate: ( expireDate.setDate( expireDate.getDate() + 1) )
                };

            return Lockr.set("sticker_packs", saveObj);
        };

        this.getPacksFromServer = function(callback) {

            var options = {
                url: Config.clientPacksUrl,
                header: []
            };

            if (Config.userId !== null) {
                options.url = Config.userPacksUrl;
                options.header['UserId'] = StickerHelper.md5(Config.userId + Config.apikey);
            }

            StickerHelper.ajaxGet(options.url, Config.apikey, callback, options.header);
        };

        this.parseStickerFromText = function(text) {
            var outData = {
                    isSticker: false,
                    url: ''
                },
                matchData = text.match(/\[\[(\S+)_(\S+)\]\]/);

            parseStickerStatHandle(!!matchData);

            if (matchData) {
                outData.isSticker = true;
                outData.url = Config.domain +
                    '/' +
                    Config.baseFolder +
                    '/' + matchData[1] +
                    '/' + matchData[2] +
                    '_' + Config.stickerResolutionType +
                    '.png';


                outData.pack = matchData[1];
                outData.name = matchData[2];
            }

            return outData;
        };

        this.isNewPack = function(packs, packName)  {
            var isNew = false;

            StickerHelper.forEach(packs, function(pack) {

                if(pack.pack_name &&
                    pack.pack_name.toLowerCase() == packName.toLowerCase()) {

                    isNew = !!pack.newPack;
                }

            });

            return isNew;

        };

        this.onUserMessageSent = function(isSticker) {
            var nowDate = new Date().getTime() / 1000 | 0,
                action = 'send',
                category = 'message',
                label = (isSticker) ? 'sticker' : 'text';

            StickerHelper.ajaxPost(Config.trackStatUrl, Config.apikey, [
                {
                    action: action,
                    category: category,
                    label: label,
                    time: nowDate
                }
            ]);


            ga('stickerTracker.send', 'event', category, action, label);
        };

        this.isExistPackInStorage = function(packName) {
            var packs = this.getPacksFromStorage()['packs'];

            for (var i = 0; i < packs.length; i++) {
                if (packs[i].pack_name == packName) {
                    return true;
                }
            }

            return false;
        };

        this.updatePacks = function(successCallback) {
            var storageStickerData;

            storageStickerData = this.getPacksFromStorage();

            this.getPacksFromServer(
                (function(response) {
                    if(response.status != 'success') {
                        return;
                    }

                    var stickerPacks = response.data;

                    stickerPacks = this.markNewPacks(storageStickerData.packs, stickerPacks);
                    this.setPacksToStorage(stickerPacks);

                    successCallback && successCallback(stickerPacks);
                }).bind(this)
            );
        };

		this.changeUserPackStatus = function(packName, status, callback) {

			var options = {
				url: Config.userPackUrl + '/' + packName,
				header: {
					UserId: StickerHelper.md5(Config.userId + Config.apikey)
				}
			};

			StickerHelper.ajaxPost(options.url, Config.apikey, {
				status: status
			}, callback, options.header);
		};

        this.purchaseSuccess = function(packName) {
			try {
				var handler = function() {
					if (!Plugin.JsApiInterface) {
						throw new Error('JSApiInterface not found!');
					}

					Plugin.JsApiInterface.downloadPack(packName, function() {
						Config.callbacks.onPackStoreSuccess(packName);
					});
				};

				if (Config.userId !== null) {
					this.changeUserPackStatus(packName, true, handler);
				} else {
					handler();
				}
			} catch(e) {
				console.error(e.message);
				Config.callbacks.onPackStoreFail(packName);
			}
        };
    }

})(window,
    StickersModule.StickerHelper,
    StickersModule.Lockr
);

(function(Plugin, Module) {

	var StickerHelper = Module.StickerHelper;

	Plugin.StickersModule.BaseView = Module.Class({

		config: null,
		service: null,

		el: null,
		tabsEl:  null,
		stickersEl:  null,

		controlTabs:  {},

		tabsController: null,

		_constructor: function(config, service) {
			this.config = config;
			this.service = service;

			//this.controlTabs = {
			//	custom: {
			//		id: 'spTabCustom',
			//		class: 'sp-tab-custom',
			//		content: this.config.customTabContent,
			//		number: -1,
			//		el: null
			//	},
			//	history: {
			//		id: 'spTabHistory',
			//		class: 'sp-tab-history',
			//		content: this.config.historyTabContent,
			//		number: -2,
			//		el: null
			//	},
			//	settings: {
			//		id: 'spTabSettings',
			//		class: 'sp-tab-settings',
			//		content: this.config.settingsTabContent,
			//		number: -3,
			//		el: null
			//	},
			//	store: {
			//		id: 'spTabSettings',
			//		class: 'sp-tab-store',
			//		content: this.config.storeTabContent,
			//		number: -4,
			//		el: null
			//	},
			//	prevPacks: {
			//		id: 'spTabPrevPacks',
			//		class: 'sp-tab-prev-packs',
			//		content: this.config.prevPacksTabContent,
			//		number: -5,
			//		el: null
			//	},
			//	nextPacks: {
			//		id: 'spTabNextPacks',
			//		class: 'sp-tab-next-packs',
			//		content: this.config.nextPacksTabContent,
			//		number: -6,
			//		el: null
			//	}
			//};

			this.tabsController = new Module.TabsController(this.config);
		},

		clearBlock: function(el) {
			el.setAttribute('style', 'display:block');
			el.innerHTML = '';
		},

		render: function(elId) {

			this.el = document.getElementById(elId);

			this.clearBlock(this.el);

			this.el.classList.add('sticker-pipe');

			this.tabsEl = document.createElement('div');
			this.tabsEl.classList.add('sp-tabs');

			this.stickersEl = document.createElement('div');
			this.stickersEl.classList.add('sp-stickers');

			this.el.appendChild(this.tabsEl);
			this.el.appendChild(this.stickersEl);
		},

		renderTabs: function(stickerPacks, tabActive) {

			this.tabsController.view.render(this.tabsEl, stickerPacks, tabActive);

			//this.clearBlock(this.tabsEl);
			//
			//this.renderControlTab(this.controlTabs.prevPacks, tabActive);
			//this.config.enableCustomTab && this.renderControlTab(this.controlTabs.custom, tabActive);
			//this.renderControlTab(this.controlTabs.history, tabActive);
			//
			//for (var j = 0; j < 1; j++) {
			//	for (var i = 0; i < stickerPacks.length; i++) {
			//		this.renderPackTab(stickerPacks[i], i, tabActive);
			//	}
			//}
			//
			//this.renderControlTab(this.controlTabs.settings, tabActive);
			//this.renderControlTab(this.controlTabs.store, tabActive);
			//this.renderControlTab(this.controlTabs.nextPacks, tabActive);
		},
		//renderPackTab: function(pack, number, tabActive) {
		//	var classes = ['sp-pack-tab'];
		//
		//	if(pack.newPack) {
		//		classes.push('stnewtab');
		//	}
		//
		//	var iconSrc = this.config.domain + '/' +
		//		this.config.baseFolder + '/' +
		//		pack.pack_name + '/tab_icon_' +
		//		this.config.tabResolutionType + '.png';
		//
		//	var content = '<img src=' + iconSrc + '>';
		//
		//	this.renderTab(null, classes, number, content, tabActive);
		//},
		//renderControlTab: function(tab, tabActive) {
		//	tab.el = this.renderTab(tab.id, [tab.class, 'sp-control-tab'], tab.number, tab.content, tabActive);
		//	return tab.el;
		//},
		//renderTab: function(id, classes, dataTabNumber, content, tabActive) {
		//	var tabEl = document.createElement('span');
		//
		//	if (id) {
		//		tabEl.id = id;
		//	}
		//
		//	classes.push(this.config.tabItemClass);
		//
		//	if (tabActive == dataTabNumber) {
		//		classes.push('active');
		//	}
		//
		//	tabEl.classList.add.apply(tabEl.classList, classes);
		//	tabEl.setAttribute('data-tab-number', dataTabNumber);
		//	tabEl.innerHTML = content;
		//
		//	this.tabsEl.appendChild(tabEl);
		//
		//	return tabEl;
		//},

		renderUseStickers: function(latesUseSticker, stickerItemClass) {
			var self = this;

			this.clearBlock(self.stickersEl);

			if (latesUseSticker.length == 0) {

				this.stickersEl.innerHTML += this.config.htmlForEmptyRecent;

				return false;
			}


			StickerHelper.forEach(latesUseSticker, (function(sticker) {

				var icon_src = this.service.parseStickerFromText("[[" + sticker.code + "]]"),
					packItem;

				packItem = "<span data-sticker-string=" + sticker.code +" class=" + stickerItemClass + "> <img src=" + icon_src.url + "></span>";

				self.stickersEl.innerHTML += packItem;
			}).bind(this));

		},

		renderCustomBlock: function() {
			this.clearBlock(this.stickersEl);
		},

		renderStickers: function(stickerPacks, tabActive, stickerItemClass) {
			var self = this,
				tabNumber = 0;

			this.clearBlock(this.stickersEl);

			StickerHelper.forEach(stickerPacks, function(pack) {

				if (tabNumber == tabActive) {
					StickerHelper.forEach(pack.stickers, function(sticker) {

						var icon_src = self.config.domain +
								"/" +
								self.config.baseFolder +
								"/" +
								pack.pack_name +
								"/" +
								sticker.name +
								"_" +
								self.config.stickerResolutionType +
								".png",

							packItem = "<span data-sticker-string=" + pack.pack_name + "_" + sticker.name +" class=" + stickerItemClass + "> <img src=" + icon_src + "></span>";

						self.stickersEl.innerHTML += packItem;
					});
				}

				tabNumber++;
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
			//iframe.src = 'http://work.stk.908.vc/api/v1/web?' + urlSerialize(urlParams) + '#/packs/' + packName;
			iframe.src = 'http://localhost/stickerpipe/store/build?' + urlSerialize(urlParams) + '#/packs/' + packName;
		}
	});

})(window, window.StickersModule);

(function(Plugin, BaseService) {

	Plugin.JsApiInterface = {

		config: null,

		_setConfigs: function(Config) {
			this.config = Config;
		},

		showPackCollections: function(packName) {
			this.config.functions.showPackCollection(packName);
		},

		downloadPack: function(packName, callback) {
			var services = new BaseService(this.config);
			services.updatePacks((function() {
				this.config.functions.showPackCollection(packName);
				callback && callback();
			}).bind(this));
		},

		purchasePackInStore: function(packTitle, packProductId, packPrice, packName) {
			this.config.callbacks.onPurchase(packTitle, packProductId, packPrice, packName);
		},

		isPackActive: function(packName) {
			return this.isPackExistsAtUserLibrary(packName);
		},

		isPackExistsAtUserLibrary: function(packName) {
			var services = new BaseService(this.config);
			return services.isExistPackInStorage(packName);
		}
	};

})(window, StickersModule.BaseService);


(function(Plugin, Modules) {

	var helper = Modules.StickerHelper;

    function Stickers(configObj) {

		this.init = function() {
			this.initConfigs(configObj);

			this.stService = new Modules.BaseService(this.config);
			this.stView = new Modules.BaseView(this.config, this.stService);
			this.stController = new Modules.BaseController(this.config);
			this.stickersModel = {};
			this.tabActive = 0;

			Plugin.JsApiInterface && Plugin.JsApiInterface._setConfigs(this.config);
		};

		this.initConfigs = function(configObj) {
			this.config = helper.mergeOptions(Modules.Config, configObj);
			this.config = helper.mergeOptions(this.config, {
				stickerResolutionType : 'mdpi',
				tabResolutionType: 'hdpi'
			});

			if (window.devicePixelRatio == 2) {
				this.config = helper.mergeOptions(this.config, {
					stickerResolutionType : 'xhdpi',
					tabResolutionType: 'xxhdpi'
				});
			}
		};

        this._renderAll = function() {

			this.stView.renderTabs(this.stickersModel, this.tabActive);

			switch (this.tabActive) {
				case this.stView.tabsController.view.controlTabs.custom.number:
					this.stView.renderCustomBlock();
					break;
				case this.stView.tabsController.view.controlTabs.history.number:
					this.stView.renderUseStickers(this.stService.getLatestUse(), this.config.stickerItemClass);
					break;
				case this.stView.tabsController.view.controlTabs.settings.number:
					console.log('click on settings tab');
					break;
				case this.stView.tabsController.view.controlTabs.store.number:
					console.log('click on store tab');
					break;
				case this.stView.tabsController.view.controlTabs.nextPacks.number:
					console.log('click on nextPacks tab');
					break;
				case this.stView.tabsController.view.controlTabs.prevPacks.number:
					console.log('click on prevPacks tab');
					break;
				default:
					this.stView.renderStickers(this.stickersModel, this.tabActive, this.config.stickerItemClass);
					break;
			}
        };

        this._init = function() {

            this._renderAll();

			this.stView.tabsController.handleClickTab(this.stView.tabsEl, this.config.tabItemClass, (function(el) {
				switch(+el.getAttribute('data-tab-number')) {
					case this.stView.tabsController.view.controlTabs.settings.number:
					case this.stView.tabsController.view.controlTabs.store.number:
					case this.stView.tabsController.view.controlTabs.nextPacks.number:
					case this.stView.tabsController.view.controlTabs.prevPacks.number:
						return;
						break;
					default:
						break;
				}

				this.tabActive = +el.getAttribute('data-tab-number');

                if(this.tabActive >= 0) this.stickersModel[this.tabActive].newPack = false;
				this.stService.setPacksToStorage(this.stickersModel);

                this._renderAll();
            }).bind(this));

			this.stController.handleClickSticker(this.stView.stickersEl, this.config.stickerItemClass, (function(el) {

                var stickerAttribute = el.getAttribute('data-sticker-string'),
                    nowDate = new Date().getTime()/1000|0;


				helper.ajaxPost(this.config.trackStatUrl, this.config.apikey, [
                    {
                        action: 'use',
                        category: 'sticker',
                        label: '[[' + stickerAttribute + ']]',
                        time: nowDate
                    }

                ]);

                ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split("_")[0], stickerAttribute.split("_")[1], 1);

				this.stService.addToLatestUse(stickerAttribute);
                this._renderAll();

            }).bind(this));

        };

        this.fetchPacks = function(attrs) {
			this.stService.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

                if(!attrs.onlyFetch){
                    this._init();
                }


                if(attrs.callback) attrs.callback.apply();
            }).bind(this));
        };

        this.start = function(callback) {
            var storageStickerData;

			//this.tabActive = this.stView.controlTabs.history.number;
			this.tabActive = this.stView.tabsController.view.controlTabs.history.number;

            storageStickerData =  this.stService.getPacksFromStorage();

			this.stView.render(this.config.elId);

            if(storageStickerData.actual) {

				this.stickersModel = storageStickerData.packs;
                this._init();

                if(callback) callback.apply();
            } else {

                this.fetchPacks({
                    callback: callback
                });
            }


        };

        this.onClickSticker = function(callback, context) {

			this.stController.handleClickSticker(this.stView.stickersEl, this.config.stickerItemClass, function(el) {
                callback.call(context, '[[' + el.getAttribute('data-sticker-string') + ']]');
            });

        };

        this.onClickCustomTab = function(callback, context) {

			this.stView.tabsController.handleClickTab(this.stView.tabsEl, this.config.tabItemClass, function(el) {

                if (el.getAttribute('id') == 'spTabCustom' ) {
                    callback.call(context, el);
                }

            });

        };

        this.onClickTab = function(callback, context) {

			this.stView.tabsController.handleClickTab(this.stView.tabsEl, this.config.tabItemClass, function(el) {
                callback.call(context, el);
            });

        };

        this.getNewStickersFlag = function() {
            return this.stService.getNewStickersFlag(this.stService.getPacksFromStorage().packs || []);
        };

        this.resetNewStickersFlag = function() {
            return this.stService.resetNewStickersFlag();
        };

        this.parseStickerFromText = function(text) {
            return this.stService.parseStickerFromText(text);
        };

        this.renderCurrentTab = function(tabName) {
            var obj = this.stService.getPacksFromStorage();

            //this.start(); // todo

			helper.forEach(obj.packs, (function(pack, key) {

                if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
					this.tabActive = +key;
                }

            }).bind(this));

            //this.stickersModel[this.tabActive].newPack = false;
            //this.stService.setPacksToStorage(this.stickersModel);

            this._renderAll();
        };

        this.isNewPack = function(packName) {
            return this.stService.isNewPack(this.stickersModel, packName);
        };

        this.onUserMessageSent = function(isSticker) {
            return this.stService.onUserMessageSent(isSticker);
        };

        this.renderPack = function(pack) {
			this.stView.renderStorePack(pack);
        };

        this.purchaseSuccess = function(packName) {
			this.stService.purchaseSuccess(packName);
        };

		this.init();
    }

    Plugin.Stickers = Stickers;

})(window, StickersModule);
