

/* Begin: js/analytics.js */

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

/* End: js/analytics.js */
/* Begin: js/config_base.js */
(function(Plugin) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    Plugin.StickersModule.Config = {

        tabContainerId: 'sttab',
        tabItemClass: 'sttab_item',

        stickersContainerId: 'stitems',
        stickerItemClass: 'stitems_item',

        storeContainerId: 'ststore',

        domain : 'http://api.stickerpipe.com',
        baseFolder: 'stk',

        stickerResolutionType : 'mdpi',
        tabResolutionType: 'xxhdpi',

        htmlForEmptyRecent: '<div class="emptyRecent">Ваши Стикеры</div>',
        apikey: '72921666b5ff8651f374747bfefaf7b2',
        clientPacksUrl: 'http://api.stickerpipe.com/api/v1/client-packs',
        userPacksUrl: 'http://api.stickerpipe.com/api/v1/user/packs',
        trackStatUrl: 'http://api.stickerpipe.com/api/v1/track-statistic',

        storagePrefix: 'stickerPipe',
        enableCustomTab: false,

        userId: null

    };

})(window);
/* End: js/config_base.js */
/* Begin: js/Lockr.js */

(function(Plugin, Config) {

    Plugin.StickersModule = Plugin.StickersModule || {};
    Plugin.StickersModule.Lockr = {};


    var Lockr = Plugin.StickersModule.Lockr;

        Lockr.prefix = Config.storagePrefix;

        Lockr._getPrefixedKey = function(key, options) {
            options = options || {};

            if (options.noPrefix) {
                return key;
            } else {
                return this.prefix + key;
            }

        };

        Lockr.set = function (key, value, options) {
            var query_key = this._getPrefixedKey(key, options);

            try {
                localStorage.setItem(query_key, JSON.stringify({"data": value}));
            } catch (e) {
                if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
            }
        };

        Lockr.get = function (key, missing, options) {
            var query_key = this._getPrefixedKey(key, options),
                value;

            try {
                value = JSON.parse(localStorage.getItem(query_key));
            } catch (e) {
                value = null;
            }
            if(value === null)
                return missing;
            else
                return (value.data || missing);
        };

        Lockr.sadd = function(key, value, options) {
            var query_key = this._getPrefixedKey(key, options),
                json;

            var values = Lockr.smembers(key);

            if (values.indexOf(value) > -1) {
                return null;
            }

            try {
                values.push(value);
                json = JSON.stringify({"data": values});
                localStorage.setItem(query_key, json);
            } catch (e) {
                console.log(e);
                if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
            }
        };

        Lockr.smembers = function(key, options) {
            var query_key = this._getPrefixedKey(key, options),
                value;

            try {
                value = JSON.parse(localStorage.getItem(query_key));
            } catch (e) {
                value = null;
            }

            if (value === null)
                return [];
            else
                return (value.data || []);
        };

        Lockr.sismember = function(key, value, options) {
            var query_key = this._getPrefixedKey(key, options);

            return Lockr.smembers(key).indexOf(value) > -1;
        };

        Lockr.getAll = function () {
            var keys = Object.keys(localStorage);

            return keys.map(function (key) {
                return Lockr.get(key);
            });
        };

        Lockr.srem = function(key, value, options) {
            var query_key = this._getPrefixedKey(key, options),
                json,
                index;

            var values = Lockr.smembers(key, value);

            index = values.indexOf(value);

            if (index > -1)
                values.splice(index, 1);

            json = JSON.stringify({"data": values});

            try {
                localStorage.setItem(query_key, json);
            } catch (e) {
                if (console) console.warn("Lockr couldn't remove the "+ value +" from the set "+ key);
            }
        };

        Lockr.rm =  function (key) {
            localStorage.removeItem(key);
        };

        Lockr.flush = function () {
            localStorage.clear();
        };

})(window, window.StickersModule.Config);
/* End: js/Lockr.js */
/* Begin: js/md5.js */

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

})(window);/* End: js/md5.js */
/* Begin: js/helper.js */

(function(Plugin, Lockr, MD5) {
    Plugin.StickersModule = Plugin.StickersModule || {};


    Plugin.StickersModule.StickerHelper = {

        forEach: function(data, callback) {
            for (var x in data){
                callback(data[x], x);
            }
        },

        mergeOptions: function(obj1, obj2){
            var obj3 = {};
            for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
            for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
            return obj3;
        },

        setEvent: function(eventType, id, className, callback) {

            document.getElementById(id).addEventListener(eventType, function (event) {

                var el = event.target
                    , found;

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
            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader("Apikey", apikey);
            xmlhttp.setRequestHeader("Platform", "JS");

            this.forEach(header, function(value, name) {
                xmlhttp.setRequestHeader(name, value);
            });

            xmlhttp.send();
        },

        ajaxPost: function(url, apikey, data, callback) {
            var xmlhttp,
                uniqUserId = Lockr.get("uniqUserId");

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 &&
                    xmlhttp.status == 200,
                    typeof callback != "undefined"){

                    callback(JSON.parse(xmlhttp.responseText));
                }
            };


            if(typeof uniqUserId == "undefined") {
                uniqUserId = + new Date();
                Lockr.set("uniqUserId", uniqUserId);
            }

            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Apikey", apikey);
            xmlhttp.setRequestHeader("Platform", "JS");
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("DeviceId", uniqUserId);


            xmlhttp.send(JSON.stringify(data));
        },

        md5: function(string) {
            return MD5(string);
        }

    };

})(window, window.StickersModule.Lockr, window.StickersModule.MD5);
/* End: js/helper.js */
/* Begin: js/controller_base.js */

(function(Plugin, StickerHelper) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    function BaseController() {

        this.handleClickTab = function(itemsBlockId, itemsClassName, callback) {
            StickerHelper.setEvent("click", itemsBlockId, itemsClassName, callback);
        };

        this.handleClickSticker = function( itemsBlockId, itemsClassName, callback) {
            StickerHelper.setEvent("click", itemsBlockId, itemsClassName, callback);
        };

    };

    Plugin.StickersModule.BaseController = BaseController;

})(window, window.StickersModule.StickerHelper);/* End: js/controller_base.js */
/* Begin: js/service_base.js */

(function(Plugin, StickerHelper, Lockr) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    function BaseService(Config) {

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

    }

    Plugin.StickersModule.BaseService = BaseService;

})(window,
    StickersModule.StickerHelper,
    StickersModule.Lockr
);/* End: js/service_base.js */
/* Begin: js/view_base.js */

(function(Plugin, StickerHelper, BaseService) {

    function BaseView(Config) {

        var clearBlock = function(idBlock) {
            var conteinerEl = document.getElementById(idBlock);
            conteinerEl.setAttribute("style", "display:block");
            conteinerEl.innerHTML = "";
        };

        this.hideBlock = function(idBlock) {
            var conteinerEl = document.getElementById(idBlock);
            conteinerEl.setAttribute("style", "display:none");
        };

        this.renderTabs = function(stickerPacks, tabActive, tabContainerId, tabItemClass) {
            var conteinerEl = document.getElementById(tabContainerId),
                iteratorTabs = 0,
                newTabClass = "",
                tabActiveClass = "";

            clearBlock(tabContainerId);

            if(Config.enableCustomTab) {
                tabActiveClass = tabActive == -2 ? " active" : "";
                conteinerEl.innerHTML += "<span id = \"custom_tab\" class= \"" + tabItemClass + tabActiveClass + "\" data-tab-number = \"-2\" ></span>";
            }

            tabActiveClass = tabActive == -1 ? " active" : "";
            conteinerEl.innerHTML += "<span id = \"recents_tab\" class= \"" + tabItemClass + tabActiveClass +  "\" data-tab-number = \"-1\" ></span>";

            StickerHelper.forEach(stickerPacks, function(pack) {

                var tabActiveClass = newTabClass = "",
                    icon_src,
                    packItem;

                if(tabActive === iteratorTabs) {
                    tabActiveClass = " active";
                }

                if(pack.newPack) {
                    newTabClass = " stnewtab";
                }

                icon_src = Config.domain +
                    "/" +
                    Config.baseFolder +
                    "/" +
                    pack.pack_name +
                    "/tab_icon_" +
                    Config.tabResolutionType +
                    ".png";

                packItem = "<span class= \"" + tabItemClass + newTabClass + tabActiveClass + "\" data-tab-number = " + iteratorTabs + " > <img src=" + icon_src + "></span>";

                conteinerEl.innerHTML += packItem;
                iteratorTabs++;

            });
        };


        this.renderUseStickers = function(latesUseSticker, stickerContainerId, stickerItemClass) {
            var conteinerEl = document.getElementById(stickerContainerId),
                base_service = new BaseService(Config);

            clearBlock(stickerContainerId);

            if(latesUseSticker.length == 0) {

                conteinerEl.innerHTML += Config.htmlForEmptyRecent;

                return false;
            };


            StickerHelper.forEach(latesUseSticker, function(sticker) {

                var icon_src = base_service.parseStickerFromText("[[" + sticker.code + "]]"),
                    packItem;

                    packItem = "<span data-sticker-string=" + sticker.code +" class=" + stickerItemClass + "> <img src=" + icon_src.url + "></span>";

                    conteinerEl.innerHTML += packItem;
            });

        };

        this.renderStickers = function(stickerPacks, tabActive, stickerContainerId, stickerItemClass) {
            var conteinerEl = document.getElementById(stickerContainerId),
                tabNumber = 0;

            clearBlock(stickerContainerId);

            StickerHelper.forEach(stickerPacks, function(pack) {

                if(tabNumber == tabActive) {
                    StickerHelper.forEach(pack.stickers, function(sticker) {

                        var icon_src = Config.domain +
                                       "/" +
                                       Config.baseFolder +
                                       "/" +
                                       pack.pack_name +
                                       "/" +
                                       sticker.name +
                                       "_" +
                                       Config.stickerResolutionType +
                                       ".png",

                            packItem = "<span data-sticker-string=" + pack.pack_name + "_" + sticker.name +" class=" + stickerItemClass + "> <img src=" + icon_src + "></span>";

                        conteinerEl.innerHTML += packItem;
                    });
                };

                tabNumber++;
            });
        };

        this.renderStorePack = function(pack) {

            var storeContainerEl = document.getElementById(Config.storeContainerId),
                iframe = document.createElement('iframe'),
                urlParams = {
                    apiKey: Config.apikey,
                    platform: 'JS',
                    userId: Config.userId,
                    density: Config.stickerResolutionType
                },
                urlSerialize = function(obj) {
                    var str = [];
                    for(var p in obj)
                        if (obj.hasOwnProperty(p)) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                    return str.join('&');
                };

            storeContainerEl.appendChild(iframe);

            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = '0';
            iframe.src = 'http://work.stk.908.vc/api/v1/web/?' + urlSerialize(urlParams) + '/#/packs/' + pack;
        };

    }


    Plugin.StickersModule.BaseView = BaseView;

})(window, StickersModule.StickerHelper, StickersModule.BaseService);/* End: js/view_base.js */

(function(Plugin, _module) {

    function Stickers(configObj) {

        var Config = _module.StickerHelper.mergeOptions(_module.Config, configObj);
            stService = new _module.BaseService(Config),
            stView = new _module.BaseView(Config),
            stController = new _module.BaseController(Config),
            configObj = configObj || {},
            stickersModel = {},
            tabActive = 0;


        var _renderAll = function() {
            
            stView.renderTabs(stickersModel, tabActive, Config.tabContainerId, Config.tabItemClass);

            if(tabActive == -1) {
                stView.renderUseStickers(stService.getLatestUse(), Config.stickersContainerId, Config.stickerItemClass);
            } else if (tabActive == -2) {
                stView.hideBlock(Config.stickersContainerId);
            } else {
                stView.renderStickers(stickersModel, tabActive, Config.stickersContainerId, Config.stickerItemClass);
            }

        };

        var  _init = function() {

            _renderAll();

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {
                tabActive = +el.getAttribute("data-tab-number");

                if(tabActive >= 0) stickersModel[tabActive].newPack = false;
                stService.setPacksToStorage(stickersModel);

                _renderAll();
            });

            stController.handleClickSticker(Config.stickersContainerId, Config.stickerItemClass, function(el) {
                var stickerAttribute = el.getAttribute("data-sticker-string"),
                    nowDate = new Date().getTime()/1000|0;


                _module.StickerHelper.ajaxPost(Config.trackStatUrl, Config.apikey, [
                    {
                        action: 'use',
                        category: 'sticker',
                        label: "[[" + stickerAttribute + "]]",
                        time: nowDate
                    }

                ]);

                ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split("_")[0], stickerAttribute.split("_")[1], 1);

                stService.addToLatestUse(stickerAttribute)
                _renderAll();

            });

        };

        this.fetchPacks = function(attrs) {
            var storageStickerData;

            storageStickerData =  stService.getPacksFromStorage();

            stService.getPacksFromServer(
                function(response) {
                    if(response.status == 'success') {
                        var stickerPacks = response.data;

                        stickerPacks = stService.markNewPacks(storageStickerData.packs, stickerPacks);
                        stService.setPacksToStorage(stickerPacks);

                        stickersModel = stickerPacks;

                        if(!attrs.onlyFetch){
                            _init();
                        }


                        if(attrs.callback) attrs.callback.apply();
                    }
                }
            );
        };

        this.start = function(callback) {
            var storageStickerData;

            tabActive = -1;

            storageStickerData =  stService.getPacksFromStorage();

            if(storageStickerData.actual) {

                stickersModel = storageStickerData.packs;
                _init();

                if(callback) callback.apply();
            } else {

                this.fetchPacks({
                    callback: callback
                });
            }


        };

        this.onClickSticker = function(callback, context) {

            stController.handleClickSticker(Config.stickersContainerId, Config.stickerItemClass, function(el) {
                callback.call(context, "[[" + el.getAttribute("data-sticker-string") + "]]");
            });

        };

        this.onClickCustomTab = function(callback, context) {

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {

                if (el.getAttribute("id") == "custom_tab" ) {
                    callback.call(context, el);
                }

            });

        };

        this.onClickTab = function(callback, context) {

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {
                callback.call(context, el);
            });

        };

        this.getNewStickersFlag = function() {
            return stService.getNewStickersFlag(stService.getPacksFromStorage().packs || []);
        };

        this.resetNewStickersFlag = function() {
            return stService.resetNewStickersFlag();
        };

        this.parseStickerFromText = function(text) {
            return stService.parseStickerFromText(text);
        };

        this.renderCurrentTab = function(tabName) {
            var obj = stService.getPacksFromStorage();

            this.start();

            _module.StickerHelper.forEach(obj.packs, function(pack, key) {

                if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
                    tabActive = +key;
                }

            });

            //stickersModel[tabActive].newPack = false;
            //stService.setPacksToStorage(stickersModel);

            _renderAll();
        };

        this.isNewPack = function(packName) {
            return stService.isNewPack(stickersModel, packName);
        };

        this.onUserMessageSent = function(isSticker) {
            return stService.onUserMessageSent(isSticker);
        };

        this.renderPack = function(pack) {
            stView.renderStorePack(pack);
        };

    }

    Plugin.Stickers = Stickers;

})(window, StickersModule);
