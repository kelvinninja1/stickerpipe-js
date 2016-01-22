
// todo: move StickersModule --> Stickers
window.StickersModule = {};


window.StickersModule.Utils = {};
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

	/**
	 *
	 * Copyright (C) 2011 by crac <![[dawid.kraczkowski[at]gmail[dot]com]]>
	 * Thanks for Hardy Keppler<![[Keppler.H[at]online.de]]> for shortened version
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 *
	 **/
	var Class = (function() {

		function _rewriteStatics(fnc, statics) {
			for (var prop in statics) {
				if (prop === 'extend' || prop === 'static' || prop === 'typeOf' || prop === 'mixin' ) {
					continue;
				}

				if (typeof statics[prop] === 'object' || typeof statics[prop] === 'function') {
					fnc[prop] = statics[prop];
					return;
				}

				//check if static is a constant
				if (prop === prop.toUpperCase()) {
					Object.defineProperty(fnc, prop, {
						writable: false,
						configurable: false,
						enumerable: true,
						value: statics[prop]
					});
					Object.defineProperty(fnc.prototype, prop, {
						writable: false,
						configurable: false,
						enumerable: true,
						value: statics[prop]
					});
				} else {
					Object.defineProperty(fnc, prop, {
						get: function() {
							return statics[prop]
						},
						set: function(val) {
							statics[prop] = val;
						}
					});
					Object.defineProperty(fnc.prototype, prop, {
						get: function() {
							return statics[prop]
						},
						set: function(val) {
							statics[prop] = val;
						}
					});
				}
			}
		}

		function _extend(base, source, overrideConstructor) {
			overrideConstructor = overrideConstructor || false;

			for (var p in source) {
				if ((p === '_constructor' && !overrideConstructor) || p === 'typeOf' || p === 'mixin' || p === 'static' || p === 'extend') {
					continue;
				}
				base[p] = source[p];
			}
		}

		return function (classBody) {

			var _preventCreateCall = false;

			return (function createClass(self, classBody) {

				var _mixins = [];
				var instance;

				var isSingleton = classBody.hasOwnProperty('singleton') && classBody.singleton;

				var classConstructor = function () {
					//apply constructor pattern
					if (typeof this['_constructor'] === 'function' && _preventCreateCall === false) {
						this._constructor.apply(this, arguments);
					}

					//apply getter pattern
					if (classBody.hasOwnProperty('get')) {
						for (var p in classBody.get) {

							var setter = 'set' in classBody ? (p in classBody.set ? classBody.set[p] : null) : null;
							if (setter === null) {
								Object.defineProperty(this, p, {
									get: classBody.get[p]
								});
							}
						}
					}

					//apply setter pattern
					if (classBody.hasOwnProperty('set')) {
						for (var p in classBody.set) {

							var getter = 'get' in classBody ? (p in classBody.get ? classBody.get[p] : null) : null;
							if (getter !== null) {
								Object.defineProperty(this, p, {
									set: classBody.set[p],
									get: classBody.get[p]
								});
							} else {
								Object.defineProperty(this, p, {
									set: classBody.set[p]
								});
							}
						}
					}

					if (isSingleton && typeof this !== 'undefined') {
						throw new Error('Singleton object cannot have more than one instance, call instance method instead');
					}
					this.constructor = classConstructor;
				};

				//make new class instance of extended object
				if (self !== null) {
					_preventCreateCall = true;
					classConstructor.prototype = new self();
					_preventCreateCall = false;
				}

				var classPrototype = classConstructor.prototype;

				classPrototype.typeOf = function(cls) {
					if (typeof cls === 'object') {
						return _mixins.indexOf(cls) >= 0;
					} else if (typeof cls === 'function') {
						if (this instanceof cls) {
							return true;
						} else if (_mixins.indexOf(cls) >= 0) {
							return true;
						}
					}

					return false;
				};
				if (typeof classBody === 'function') {
					classBody = classBody();
				}

				_extend(classPrototype, classBody, true);

				/**
				 * Defines statics and constans in class' body.
				 *
				 * @param {Object} statics
				 * @returns {Function}
				 */
				classConstructor.static = function(statics) {
					_rewriteStatics(classConstructor, statics);
					return classConstructor;
				};

				/**
				 * Extends class body by passed other class declaration
				 * @param {Function} *mixins
				 * @returns {Function}
				 */
				classConstructor.mixin = function() {
					for (var i = 0, l = arguments.length; i < l; i++) {
						//check if class implements interfaces
						var mixin = arguments[i];

						if (typeof mixin === 'function') {
							var methods = mixin.prototype;
						} else if (typeof mixin === 'object') {
							var methods = mixin;
						} else {
							throw new Error('js.class mixin method accepts only types: object, function - `' + (typeof mixin) + '` type given');
						}
						_extend(classPrototype, methods, false);
						_mixins.push(mixin);
					}
					return classConstructor;
				};

				/**
				 * Creates and returns new constructor function which extends
				 * its parent
				 *
				 * @param {Object} classBody
				 * @returns {Function}
				 */
				if (isSingleton) {
					classConstructor.extend = function() {
						throw new Error('Singleton class cannot be extended');
					};

					classConstructor.instance = function() {
						if (!instance) {
							isSingleton = false;
							instance = new classConstructor();
							isSingleton = true;
						}
						return instance;
					}

				} else {
					classConstructor.extend = function (classBody) {
						return createClass(this, classBody);
					};
				}

				return classConstructor;
			})(null, classBody);
		}
	})();

	if (typeof module !== "undefined") {
		module.exports = Class;
	} else {
		Plugin.StickersModule.Class = Class;   // for browser
	}

})(window);

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-12-13
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
	if (!("classList" in document.createElement("_"))) {

		(function (view) {

			"use strict";

			if (!('Element' in view)) return;

			var
				classListProp = "classList"
				, protoProp = "prototype"
				, elemCtrProto = view.Element[protoProp]
				, objCtr = Object
				, strTrim = String[protoProp].trim || function () {
						return this.replace(/^\s+|\s+$/g, "");
					}
				, arrIndexOf = Array[protoProp].indexOf || function (item) {
						var
							i = 0
							, len = this.length
							;
						for (; i < len; i++) {
							if (i in this && this[i] === item) {
								return i;
							}
						}
						return -1;
					}
			// Vendors: please allow content code to instantiate DOMExceptions
				, DOMEx = function (type, message) {
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				}
				, checkTokenAndGetIndex = function (classList, token) {
					if (token === "") {
						throw new DOMEx(
							"SYNTAX_ERR"
							, "An invalid or illegal string was specified"
						);
					}
					if (/\s/.test(token)) {
						throw new DOMEx(
							"INVALID_CHARACTER_ERR"
							, "String contains an invalid character"
						);
					}
					return arrIndexOf.call(classList, token);
				}
				, ClassList = function (elem) {
					var
						trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
						, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
						, i = 0
						, len = classes.length
						;
					for (; i < len; i++) {
						this.push(classes[i]);
					}
					this._updateClassName = function () {
						elem.setAttribute("class", this.toString());
					};
				}
				, classListProto = ClassList[protoProp] = []
				, classListGetter = function () {
					return new ClassList(this);
				}
				;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function () {
				var
					tokens = arguments
					, i = 0
					, l = tokens.length
					, token
					, updated = false
					;
				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var
					tokens = arguments
					, i = 0
					, l = tokens.length
					, token
					, updated = false
					, index
					;
				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, force) {
				token += "";

				var
					result = this.contains(token)
					, method = result ?
					force !== true && "remove"
						:
					force !== false && "add"
					;

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter
					, enumerable: true
					, configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) { // IE 8 doesn't support enumerable:true
					if (ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}

		}(self));

	} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

		(function () {
			"use strict";

			var testElement = document.createElement("_");

			testElement.classList.add("c1", "c2");

			// Polyfill for IE 10/11 and Firefox <26, where classList.add and
			// classList.remove exist but support only one argument at a time.
			if (!testElement.classList.contains("c2")) {
				var createMethod = function(method) {
					var original = DOMTokenList.prototype[method];

					DOMTokenList.prototype[method] = function(token) {
						var i, len = arguments.length;

						for (i = 0; i < len; i++) {
							token = arguments[i];
							original.call(this, token);
						}
					};
				};
				createMethod('add');
				createMethod('remove');
			}

			testElement.classList.toggle("c3", false);

			// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
			// support the second argument.
			if (testElement.classList.contains("c3")) {
				var _toggle = DOMTokenList.prototype.toggle;

				DOMTokenList.prototype.toggle = function(token, force) {
					if (1 in arguments && !this.contains(token) === !force) {
						return force;
					} else {
						return _toggle.call(this, token);
					}
				};

			}

			testElement = null;
		}());

	}

}

(function(Plugin) {

	Plugin.StickersModule.Lockr = {
		prefix: '',

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

})(window);
(function(Plugin) {

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
;(function(window, undefined) {
	"use strict";


	function extend() {
		for(var i=1; i < arguments.length; i++) {
			for(var key in arguments[i]) {
				if(arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
		}
		return arguments[0];
	}

	var pluginName = "tinyscrollbar"
		,   defaults = {
			axis: 'y'
			,   wheel: true
			,   wheelSpeed: 40
			,   wheelLock: true
			,   touchLock: true
			,   trackSize: false
			,   thumbSize: false
			,   thumbSizeMin: 20
		}
		;

	function Plugin($container, options) {
		/**
		 * The options of the carousel extend with the defaults.
		 *
		 * @property options
		 * @type Object
		 * @default defaults
		 */
		this.options = extend({}, defaults, options);

		/**
		 * @property _defaults
		 * @type Object
		 * @private
		 * @default defaults
		 */
		this._defaults = defaults;

		/**
		 * @property _name
		 * @type String
		 * @private
		 * @final
		 * @default 'tinyscrollbar'
		 */
		this._name = pluginName;

		var lastMousePositionNew = null;

		var self = this
			,   $body = document.querySelectorAll("body")[0]
			,   $viewport = $container.querySelectorAll(".viewport")[0]
			,   $overview = $container.querySelectorAll(".overview")[0]
			,   $scrollbar = $container.querySelectorAll(".scrollbar")[0]
			,   $track = $scrollbar.querySelectorAll(".track")[0]
			,   $thumb = $scrollbar.querySelectorAll(".thumb")[0]

			,   mousePosition = 0
			,   isHorizontal = this.options.axis === 'x'
			,   hasTouchEvents = ("ontouchstart" in document.documentElement)
			,   wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
				document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
					"DOMMouseScroll" // let's assume that remaining browsers are older Firefox

			,   sizeLabel = isHorizontal ? "width" : "height"
			,   posiLabel = isHorizontal ? "left" : "top"
			,   moveEvent = document.createEvent("HTMLEvents")
			;

		moveEvent.initEvent("move", true, true);

		/**
		 * The position of the content relative to the viewport.
		 *
		 * @property contentPosition
		 * @type Number
		 * @default 0
		 */
		this.contentPosition = 0;

		/**
		 * The height or width of the viewport.
		 *
		 * @property viewportSize
		 * @type Number
		 * @default 0
		 */
		this.viewportSize = 0;

		/**
		 * The height or width of the content.
		 *
		 * @property contentSize
		 * @type Number
		 * @default 0
		 */
		this.contentSize = 0;

		/**
		 * The ratio of the content size relative to the viewport size.
		 *
		 * @property contentRatio
		 * @type Number
		 * @default 0
		 */
		this.contentRatio = 0;

		/**
		 * The height or width of the content.
		 *
		 * @property trackSize
		 * @type Number
		 * @default 0
		 */
		this.trackSize = 0;

		/**
		 * The size of the track relative to the size of the content.
		 *
		 * @property trackRatio
		 * @type Number
		 * @default 0
		 */
		this.trackRatio = 0;

		/**
		 * The height or width of the thumb.
		 *
		 * @property thumbSize
		 * @type Number
		 * @default 0
		 */
		this.thumbSize = 0;

		/**
		 * The position of the thumb relative to the track.
		 *
		 * @property thumbPosition
		 * @type Number
		 * @default 0
		 */
		this.thumbPosition = 0;

		/**
		 * Will be true if there is content to scroll.
		 *
		 * @property hasContentToScroll
		 * @type Boolean
		 * @default false
		 */
		this.hasContentToSroll = false;

		/**
		 * @method _initialize
		 * @private
		 */
		function _initialize() {
			self.update();
			_setEvents();

			return self;
		}

		/**
		 * You can use the update method to adjust the scrollbar to new content or to move the scrollbar to a certain point.
		 *
		 * @method update
		 * @chainable
		 * @param {Number|String} [scrollTo] Number in pixels or the values "relative" or "bottom". If you dont specify a parameter it will default to top
		 */
		this.update = function(scrollTo) {
			var sizeLabelCap = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase();
			var scrcls = $scrollbar.className;

			this.viewportSize = $viewport['offset'+ sizeLabelCap];
			this.contentSize = $overview['scroll'+ sizeLabelCap];
			this.contentRatio = this.viewportSize / this.contentSize;
			this.trackSize = this.options.trackSize || this.viewportSize;
			this.trackSize -= 2; // bugfix (for css - top: 2px)
			this.thumbSize = Math.min(this.trackSize, Math.max(this.options.thumbSizeMin, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
			this.trackRatio = (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize);
			this.hasContentToSroll = this.contentRatio < 1;

			$scrollbar.className = this.hasContentToSroll ? scrcls.replace(/disable/g, "") : scrcls.replace(/ disable/g, "") + " disable";

			switch (scrollTo) {
				case "bottom":
					this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0);
					break;

				case "relative":
					this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
					break;

				default:
					this.contentPosition = parseInt(scrollTo, 10) || 0;
			}

			this.thumbPosition = self.contentPosition / self.trackRatio;

			_setCss();

			return self;
		};

		this._isAtEnd = function() {
			return _isAtEnd();
		};

		this._isAtBegin = function() {
			return _isAtBegin();
		};

		/**
		 * @method _setCss
		 * @private
		 */
		function _setCss() {
			$thumb.style[posiLabel] = self.thumbPosition + "px";
			$overview.style[posiLabel] = -self.contentPosition + "px";
			$scrollbar.style[sizeLabel] = self.trackSize + "px";
			$track.style[sizeLabel] = self.trackSize + "px";
			$thumb.style[sizeLabel] = self.thumbSize + "px";
		}

		/**
		 * @method _setEvents
		 * @private
		 */
		function _setEvents() {
			if(hasTouchEvents) {
				$viewport.ontouchstart = function(event) {
					if(1 === event.touches.length) {
						_start(event.touches[0]);
						event.stopPropagation();
					}
				};
			}
			else {
				$thumb.onmousedown = function(event) {
					event.stopPropagation();
					_start(event);
				};

				$track.onmousedown = function(event) {
					_start(event, true);
				};
			}

			window.addEventListener("resize", function() {
				self.update("relative");
			}, true);

			if(self.options.wheel && window.addEventListener) {
				$container.addEventListener(wheelEvent, _wheel, false );
			}
			else if(self.options.wheel) {
				$container.onmousewheel = _wheel;
			}
		}

		/**
		 * @method _isAtBegin
		 * @private
		 */
		function _isAtBegin() {
			return self.contentPosition > 0;
		}

		/**
		 * @method _isAtEnd
		 * @private
		 */
		function _isAtEnd() {
			return self.contentPosition <= (self.contentSize - self.viewportSize) - 5;
		}

		/**
		 * @method _start
		 * @private
		 */
		function _start(event, gotoMouse) {
			if(self.hasContentToSroll) {
				lastMousePositionNew = null;

				var posiLabelCap = posiLabel.charAt(0).toUpperCase() + posiLabel.slice(1).toLowerCase();
				mousePosition = gotoMouse ? $thumb.getBoundingClientRect()[posiLabel] : (isHorizontal ? event.clientX : event.clientY);

				$body.className += " noSelect";

				if(hasTouchEvents) {
					document.ontouchmove = function(event) {
						if(self.options.touchLock || _isAtBegin() && _isAtEnd()) {
							event.preventDefault();
						}
						_drag(event.touches[0]);
					};
					document.ontouchend = _end;
				}
				else {
					document.onmousemove = _drag;
					document.onmouseup = $thumb.onmouseup = _end;
				}

				_drag(event);
			}
		}

		/**
		 * @method _wheel
		 * @private
		 */
		function _wheel(event) {
			if(self.hasContentToSroll) {
				var evntObj = event || window.event
					,   wheelSpeedDelta = -(evntObj.deltaY || evntObj.detail || (-1 / 3 * evntObj.wheelDelta)) / 40
					,   multiply = (evntObj.deltaMode === 1) ? self.options.wheelSpeed : 1
					;

				// bugfix
				wheelSpeedDelta = wheelSpeedDelta || 0;

				// todo
				if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 &&
					navigator.platform.indexOf('Win') > -1) {

					var speed = 2.5;
					wheelSpeedDelta = (wheelSpeedDelta > 0) ? speed : speed * -1;
				}

				//console.log(wheelSpeedDelta, self.options.wheelSpeed, self.contentSize, self.viewportSize, self.contentPosition);

				self.contentPosition -= wheelSpeedDelta * self.options.wheelSpeed;
				self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));
				self.thumbPosition = self.contentPosition / self.trackRatio;

				$container.dispatchEvent(moveEvent);

				$thumb.style[posiLabel] = self.thumbPosition + "px";
				$overview.style[posiLabel] = -self.contentPosition + "px";

				if(self.options.wheelLock || _isAtBegin() && _isAtEnd()) {
					evntObj.preventDefault();
				}
			}
			event.stopPropagation();
		}


		/**
		 * @method _drag
		 * @private
		 */
		function _drag(event) {
			if(self.hasContentToSroll)
			{
				var mousePositionNew = isHorizontal ? event.clientX : event.clientY;
				//var thumbPositionDelta = hasTouchEvents ? (mousePosition - mousePositionNew) : (mousePositionNew - mousePosition);

				var thumbPositionDelta = mousePositionNew - mousePosition;
				if (hasTouchEvents) {
					if (lastMousePositionNew) {
						if (mousePositionNew - lastMousePositionNew > 5) {
							mousePositionNew = lastMousePositionNew + 5;
						} else if (mousePositionNew - lastMousePositionNew < -5) {
							mousePositionNew = lastMousePositionNew - 5;
						}
					}
					thumbPositionDelta = mousePosition - mousePositionNew;
				}

				var thumbPositionNew = Math.min((self.trackSize - self.thumbSize), Math.max(0, self.thumbPosition + thumbPositionDelta));

				//if (window.StickersModule.Service.Helper.getMobileOS() == 'ios') {
				//
				//	var speed = 1.5;
				//	self.trackRatio = (self.trackRatio > 0) ? speed : speed * -1;
				//}
				var log = document.getElementById('log');
				log.innerHTML += 'm: ' + hasTouchEvents + ', ' + mousePosition + ', ' + mousePositionNew + '<br/>';

				self.contentPosition = thumbPositionNew * self.trackRatio;

				$container.dispatchEvent(moveEvent);

				$thumb.style[posiLabel] = thumbPositionNew + "px";
				$overview.style[posiLabel] = -self.contentPosition + "px";

				lastMousePositionNew = mousePositionNew;
			}
		}


		/**
		 * @method _end
		 * @private
		 */
		function _end() {
			self.thumbPosition = parseInt($thumb.style[posiLabel], 10) || 0;

			$body.className = $body.className.replace(" noSelect", "");
			document.onmousemove = document.onmouseup = null;
			$thumb.onmouseup = null;
			$track.onmouseup = null;
			document.ontouchmove = document.ontouchend = null;
		}

		return _initialize();
	}

	/**
	 * @class window.tinyscrollbar
	 * @constructor
	 * @param {Object} [$container] Element to attach scrollbar to.
	 * @param {Object} options
	 @param {String} [options.axis='y'] Vertical or horizontal scroller? ( x || y ).
	 @param {Boolean} [options.wheel=true] Enable or disable the mousewheel.
	 @param {Boolean} [options.wheelSpeed=40] How many pixels must the mousewheel scroll at a time.
	 @param {Boolean} [options.wheelLock=true] Lock default window wheel scrolling when there is no more content to scroll.
	 @param {Number} [options.touchLock=true] Lock default window touch scrolling when there is no more content to scroll.
	 @param {Boolean|Number} [options.trackSize=false] Set the size of the scrollbar to auto(false) or a fixed number.
	 @param {Boolean|Number} [options.thumbSize=false] Set the size of the thumb to auto(false) or a fixed number
	 @param {Boolean} [options.thumbSizeMin=20] Minimum thumb size.
	 */
	var tinyscrollbar = function($container, options) {
		return new Plugin($container, options);
	};

	if(typeof define == 'function' && define.amd) {
		define(function(){ return tinyscrollbar; });
	}
	else if(typeof module === 'object' && module.exports) {
		module.exports = tinyscrollbar;
	}
	else {
		window.StickersModule.Tinyscrollbar = tinyscrollbar;
	}
})(window);
(function(Plugin) {

	/*jslint indent: 2, browser: true, bitwise: true, plusplus: true */
	Plugin.StickersModule.Twemoji = (function (
		/*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
		 https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
		 */

		// WARNING:   this file is generated automatically via
		//            `node twemoji-generator.js`
		//            please update its `createTwemoji` function
		//            at the bottom of the same file instead.

	) {
		'use strict';

		/*jshint maxparams:4 */

		var
		// the exported module object
			twemoji = {


				/////////////////////////
				//      properties     //
				/////////////////////////

				// default assets url, by default will be Twitter Inc. CDN
				base: (location.protocol === 'https:' ? 'https:' : 'http:') +
				'//twemoji.maxcdn.com/',

				// default assets file extensions, by default '.png'
				ext: '.png',

				// default assets/folder size, by default "36x36"
				// available via Twitter CDN: 16, 36, 72
				size: '36x36',

				// default class name, by default 'emoji'
				className: 'emoji',

				// basic utilities / helpers to convert code points
				// to JavaScript surrogates and vice versa
				convert: {

					/**
					 * Given an HEX codepoint, returns UTF16 surrogate pairs.
					 *
					 * @param   string  generic codepoint, i.e. '1F4A9'
					 * @return  string  codepoint transformed into utf16 surrogates pair,
					 *          i.e. \uD83D\uDCA9
					 *
					 * @example
					 *  twemoji.convert.fromCodePoint('1f1e8');
					 *  // "\ud83c\udde8"
					 *
					 *  '1f1e8-1f1f3'.split('-').map(twemoji.convert.fromCodePoint).join('')
					 *  // "\ud83c\udde8\ud83c\uddf3"
					 */
					fromCodePoint: fromCodePoint,

					/**
					 * Given UTF16 surrogate pairs, returns the equivalent HEX codepoint.
					 *
					 * @param   string  generic utf16 surrogates pair, i.e. \uD83D\uDCA9
					 * @param   string  optional separator for double code points, default='-'
					 * @return  string  utf16 transformed into codepoint, i.e. '1F4A9'
					 *
					 * @example
					 *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
					 *  // "1f1e8-1f1f3"
					 *
					 *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
					 *  // "1f1e8~1f1f3"
					 */
					toCodePoint: toCodePoint
				},


				/////////////////////////
				//       methods       //
				/////////////////////////

				/**
				 * User first: used to remove missing images
				 * preserving the original text intent when
				 * a fallback for network problems is desired.
				 * Automatically added to Image nodes via DOM
				 * It could be recycled for string operations via:
				 *  $('img.emoji').on('error', twemoji.onerror)
				 */
				onerror: function onerror() {
					if (this.parentNode) {
						this.parentNode.replaceChild(createText(this.alt), this);
					}
				},

				/**
				 * Main method/logic to generate either <img> tags or HTMLImage nodes.
				 *  "emojify" a generic text or DOM Element.
				 *
				 * @overloads
				 *
				 * String replacement for `innerHTML` or server side operations
				 *  twemoji.parse(string);
				 *  twemoji.parse(string, Function);
				 *  twemoji.parse(string, Object);
				 *
				 * HTMLElement tree parsing for safer operations over existing DOM
				 *  twemoji.parse(HTMLElement);
				 *  twemoji.parse(HTMLElement, Function);
				 *  twemoji.parse(HTMLElement, Object);
				 *
				 * @param   string|HTMLElement  the source to parse and enrich with emoji.
				 *
				 *          string              replace emoji matches with <img> tags.
				 *                              Mainly used to inject emoji via `innerHTML`
				 *                              It does **not** parse the string or validate it,
				 *                              it simply replaces found emoji with a tag.
				 *                              NOTE: be sure this won't affect security.
				 *
				 *          HTMLElement         walk through the DOM tree and find emoji
				 *                              that are inside **text node only** (nodeType === 3)
				 *                              Mainly used to put emoji in already generated DOM
				 *                              without compromising surrounding nodes and
				 *                              **avoiding** the usage of `innerHTML`.
				 *                              NOTE: Using DOM elements instead of strings should
				 *                              improve security without compromising too much
				 *                              performance compared with a less safe `innerHTML`.
				 *
				 * @param   Function|Object  [optional]
				 *                              either the callback that will be invoked or an object
				 *                              with all properties to use per each found emoji.
				 *
				 *          Function            if specified, this will be invoked per each emoji
				 *                              that has been found through the RegExp except
				 *                              those follwed by the invariant \uFE0E ("as text").
				 *                              Once invoked, parameters will be:
				 *
				 *                                codePoint:string  the lower case HEX code point
				 *                                                  i.e. "1f4a9"
				 *
				 *                                options:Object    all info for this parsing operation
				 *
				 *                                variant:char      the optional \uFE0F ("as image")
				 *                                                  variant, in case this info
				 *                                                  is anyhow meaningful.
				 *                                                  By default this is ignored.
				 *
				 *                              If such callback will return a falsy value instead
				 *                              of a valid `src` to use for the image, nothing will
				 *                              actually change for that specific emoji.
				 *
				 *
				 *          Object              if specified, an object containing the following properties
				 *
				 *            callback   Function  the callback to invoke per each found emoji.
				 *            base       string    the base url, by default twemoji.base
				 *            ext        string    the image extension, by default twemoji.ext
				 *            size       string    the assets size, by default twemoji.size
				 *
				 * @example
				 *
				 *  twemoji.parse("I \u2764\uFE0F emoji!");
				 *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"> emoji!
				 *
				 *
				 *  twemoji.parse("I \u2764\uFE0F emoji!", function(icon, options, variant) {
       *    return '/assets/' + icon + '.gif';
       *  });
				 *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"> emoji!
				 *
				 *
				 * twemoji.parse("I \u2764\uFE0F emoji!", {
       *   size: 72,
       *   callback: function(icon, options, variant) {
       *     return '/assets/' + options.size + '/' + icon + options.ext;
       *   }
       * });
				 *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/72x72/2764.png"> emoji!
				 *
				 */
				parse: parse,

				/**
				 * Given a string, invokes the callback argument
				 *  per each emoji found in such string.
				 * This is the most raw version used by
				 *  the .parse(string) method itself.
				 *
				 * @param   string    generic string to parse
				 * @param   Function  a generic callback that will be
				 *                    invoked to replace the content.
				 *                    This calback wil receive standard
				 *                    String.prototype.replace(str, callback)
				 *                    arguments such:
				 *  callback(
				 *    match,  // the emoji match
				 *    icon,   // the emoji text (same as text)
				 *    variant // either '\uFE0E' or '\uFE0F', if present
				 *  );
				 *
				 *                    and others commonly received via replace.
				 *
				 *  NOTE: When the variant \uFE0E is found, remember this is an explicit intent
				 *  from the user: the emoji should **not** be replaced with an image.
				 *  In \uFE0F case one, it's the opposite, it should be graphic.
				 *  This utility convetion is that only \uFE0E are not translated into images.
				 */
				replace: replace,

				/**
				 * Simplify string tests against emoji.
				 *
				 * @param   string  some text that might contain emoji
				 * @return  boolean true if any emoji was found, false otherwise.
				 *
				 * @example
				 *
				 *  if (twemoji.test(someContent)) {
       *    console.log("emoji All The Things!");
       *  }
				 */
				test: test
			},

		// used to escape HTML special chars in attributes
			escaper = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				"'": '&#39;',
				'"': '&quot;'
			},

		// RegExp based on emoji's official Unicode standards
		// http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
			re = /((?:\ud83c\udde8\ud83c\uddf3|\ud83c\uddfa\ud83c\uddf8|\ud83c\uddf7\ud83c\uddfa|\ud83c\uddf0\ud83c\uddf7|\ud83c\uddef\ud83c\uddf5|\ud83c\uddee\ud83c\uddf9|\ud83c\uddec\ud83c\udde7|\ud83c\uddeb\ud83c\uddf7|\ud83c\uddea\ud83c\uddf8|\ud83c\udde9\ud83c\uddea|\u0039\ufe0f?\u20e3|\u0038\ufe0f?\u20e3|\u0037\ufe0f?\u20e3|\u0036\ufe0f?\u20e3|\u0035\ufe0f?\u20e3|\u0034\ufe0f?\u20e3|\u0033\ufe0f?\u20e3|\u0032\ufe0f?\u20e3|\u0031\ufe0f?\u20e3|\u0030\ufe0f?\u20e3|\u0023\ufe0f?\u20e3|\ud83d\udeb3|\ud83d\udeb1|\ud83d\udeb0|\ud83d\udeaf|\ud83d\udeae|\ud83d\udea6|\ud83d\udea3|\ud83d\udea1|\ud83d\udea0|\ud83d\ude9f|\ud83d\ude9e|\ud83d\ude9d|\ud83d\ude9c|\ud83d\ude9b|\ud83d\ude98|\ud83d\ude96|\ud83d\ude94|\ud83d\ude90|\ud83d\ude8e|\ud83d\ude8d|\ud83d\ude8b|\ud83d\ude8a|\ud83d\ude88|\ud83d\ude86|\ud83d\ude82|\ud83d\ude81|\ud83d\ude36|\ud83d\ude34|\ud83d\ude2f|\ud83d\ude2e|\ud83d\ude2c|\ud83d\ude27|\ud83d\ude26|\ud83d\ude1f|\ud83d\ude1b|\ud83d\ude19|\ud83d\ude17|\ud83d\ude15|\ud83d\ude11|\ud83d\ude10|\ud83d\ude0e|\ud83d\ude08|\ud83d\ude07|\ud83d\ude00|\ud83d\udd67|\ud83d\udd66|\ud83d\udd65|\ud83d\udd64|\ud83d\udd63|\ud83d\udd62|\ud83d\udd61|\ud83d\udd60|\ud83d\udd5f|\ud83d\udd5e|\ud83d\udd5d|\ud83d\udd5c|\ud83d\udd2d|\ud83d\udd2c|\ud83d\udd15|\ud83d\udd09|\ud83d\udd08|\ud83d\udd07|\ud83d\udd06|\ud83d\udd05|\ud83d\udd04|\ud83d\udd02|\ud83d\udd01|\ud83d\udd00|\ud83d\udcf5|\ud83d\udcef|\ud83d\udced|\ud83d\udcec|\ud83d\udcb7|\ud83d\udcb6|\ud83d\udcad|\ud83d\udc6d|\ud83d\udc6c|\ud83d\udc65|\ud83d\udc2a|\ud83d\udc16|\ud83d\udc15|\ud83d\udc13|\ud83d\udc10|\ud83d\udc0f|\ud83d\udc0b|\ud83d\udc0a|\ud83d\udc09|\ud83d\udc08|\ud83d\udc07|\ud83d\udc06|\ud83d\udc05|\ud83d\udc04|\ud83d\udc03|\ud83d\udc02|\ud83d\udc01|\ud83d\udc00|\ud83c\udfe4|\ud83c\udfc9|\ud83c\udfc7|\ud83c\udf7c|\ud83c\udf50|\ud83c\udf4b|\ud83c\udf33|\ud83c\udf32|\ud83c\udf1e|\ud83c\udf1d|\ud83c\udf1c|\ud83c\udf1a|\ud83c\udf18|\ud83c\udccf|\ud83c\udd8e|\ud83c\udd91|\ud83c\udd92|\ud83c\udd93|\ud83c\udd94|\ud83c\udd95|\ud83c\udd96|\ud83c\udd97|\ud83c\udd98|\ud83c\udd99|\ud83c\udd9a|\ud83d\udc77|\ud83d\udec5|\ud83d\udec4|\ud83d\udec3|\ud83d\udec2|\ud83d\udec1|\ud83d\udebf|\ud83d\udeb8|\ud83d\udeb7|\ud83d\udeb5|\ud83c\ude01|\ud83c\ude32|\ud83c\ude33|\ud83c\ude34|\ud83c\ude35|\ud83c\ude36|\ud83c\ude38|\ud83c\ude39|\ud83c\ude3a|\ud83c\ude50|\ud83c\ude51|\ud83c\udf00|\ud83c\udf01|\ud83c\udf02|\ud83c\udf03|\ud83c\udf04|\ud83c\udf05|\ud83c\udf06|\ud83c\udf07|\ud83c\udf08|\ud83c\udf09|\ud83c\udf0a|\ud83c\udf0b|\ud83c\udf0c|\ud83c\udf0f|\ud83c\udf11|\ud83c\udf13|\ud83c\udf14|\ud83c\udf15|\ud83c\udf19|\ud83c\udf1b|\ud83c\udf1f|\ud83c\udf20|\ud83c\udf30|\ud83c\udf31|\ud83c\udf34|\ud83c\udf35|\ud83c\udf37|\ud83c\udf38|\ud83c\udf39|\ud83c\udf3a|\ud83c\udf3b|\ud83c\udf3c|\ud83c\udf3d|\ud83c\udf3e|\ud83c\udf3f|\ud83c\udf40|\ud83c\udf41|\ud83c\udf42|\ud83c\udf43|\ud83c\udf44|\ud83c\udf45|\ud83c\udf46|\ud83c\udf47|\ud83c\udf48|\ud83c\udf49|\ud83c\udf4a|\ud83c\udf4c|\ud83c\udf4d|\ud83c\udf4e|\ud83c\udf4f|\ud83c\udf51|\ud83c\udf52|\ud83c\udf53|\ud83c\udf54|\ud83c\udf55|\ud83c\udf56|\ud83c\udf57|\ud83c\udf58|\ud83c\udf59|\ud83c\udf5a|\ud83c\udf5b|\ud83c\udf5c|\ud83c\udf5d|\ud83c\udf5e|\ud83c\udf5f|\ud83c\udf60|\ud83c\udf61|\ud83c\udf62|\ud83c\udf63|\ud83c\udf64|\ud83c\udf65|\ud83c\udf66|\ud83c\udf67|\ud83c\udf68|\ud83c\udf69|\ud83c\udf6a|\ud83c\udf6b|\ud83c\udf6c|\ud83c\udf6d|\ud83c\udf6e|\ud83c\udf6f|\ud83c\udf70|\ud83c\udf71|\ud83c\udf72|\ud83c\udf73|\ud83c\udf74|\ud83c\udf75|\ud83c\udf76|\ud83c\udf77|\ud83c\udf78|\ud83c\udf79|\ud83c\udf7a|\ud83c\udf7b|\ud83c\udf80|\ud83c\udf81|\ud83c\udf82|\ud83c\udf83|\ud83c\udf84|\ud83c\udf85|\ud83c\udf86|\ud83c\udf87|\ud83c\udf88|\ud83c\udf89|\ud83c\udf8a|\ud83c\udf8b|\ud83c\udf8c|\ud83c\udf8d|\ud83c\udf8e|\ud83c\udf8f|\ud83c\udf90|\ud83c\udf91|\ud83c\udf92|\ud83c\udf93|\ud83c\udfa0|\ud83c\udfa1|\ud83c\udfa2|\ud83c\udfa3|\ud83c\udfa4|\ud83c\udfa5|\ud83c\udfa6|\ud83c\udfa7|\ud83c\udfa8|\ud83c\udfa9|\ud83c\udfaa|\ud83c\udfab|\ud83c\udfac|\ud83c\udfad|\ud83c\udfae|\ud83c\udfaf|\ud83c\udfb0|\ud83c\udfb1|\ud83c\udfb2|\ud83c\udfb3|\ud83c\udfb4|\ud83c\udfb5|\ud83c\udfb6|\ud83c\udfb7|\ud83c\udfb8|\ud83c\udfb9|\ud83c\udfba|\ud83c\udfbb|\ud83c\udfbc|\ud83c\udfbd|\ud83c\udfbe|\ud83c\udfbf|\ud83c\udfc0|\ud83c\udfc1|\ud83c\udfc2|\ud83c\udfc3|\ud83c\udfc4|\ud83c\udfc6|\ud83c\udfc8|\ud83c\udfca|\ud83c\udfe0|\ud83c\udfe1|\ud83c\udfe2|\ud83c\udfe3|\ud83c\udfe5|\ud83c\udfe6|\ud83c\udfe7|\ud83c\udfe8|\ud83c\udfe9|\ud83c\udfea|\ud83c\udfeb|\ud83c\udfec|\ud83c\udfed|\ud83c\udfee|\ud83c\udfef|\ud83c\udff0|\ud83d\udc0c|\ud83d\udc0d|\ud83d\udc0e|\ud83d\udc11|\ud83d\udc12|\ud83d\udc14|\ud83d\udc17|\ud83d\udc18|\ud83d\udc19|\ud83d\udc1a|\ud83d\udc1b|\ud83d\udc1c|\ud83d\udc1d|\ud83d\udc1e|\ud83d\udc1f|\ud83d\udc20|\ud83d\udc21|\ud83d\udc22|\ud83d\udc23|\ud83d\udc24|\ud83d\udc25|\ud83d\udc26|\ud83d\udc27|\ud83d\udc28|\ud83d\udc29|\ud83d\udc2b|\ud83d\udc2c|\ud83d\udc2d|\ud83d\udc2e|\ud83d\udc2f|\ud83d\udc30|\ud83d\udc31|\ud83d\udc32|\ud83d\udc33|\ud83d\udc34|\ud83d\udc35|\ud83d\udc36|\ud83d\udc37|\ud83d\udc38|\ud83d\udc39|\ud83d\udc3a|\ud83d\udc3b|\ud83d\udc3c|\ud83d\udc3d|\ud83d\udc3e|\ud83d\udc40|\ud83d\udc42|\ud83d\udc43|\ud83d\udc44|\ud83d\udc45|\ud83d\udc46|\ud83d\udc47|\ud83d\udc48|\ud83d\udc49|\ud83d\udc4a|\ud83d\udc4b|\ud83d\udc4c|\ud83d\udc4d|\ud83d\udc4e|\ud83d\udc4f|\ud83d\udc50|\ud83d\udc51|\ud83d\udc52|\ud83d\udc53|\ud83d\udc54|\ud83d\udc55|\ud83d\udc56|\ud83d\udc57|\ud83d\udc58|\ud83d\udc59|\ud83d\udc5a|\ud83d\udc5b|\ud83d\udc5c|\ud83d\udc5d|\ud83d\udc5e|\ud83d\udc5f|\ud83d\udc60|\ud83d\udc61|\ud83d\udc62|\ud83d\udc63|\ud83d\udc64|\ud83d\udc66|\ud83d\udc67|\ud83d\udc68|\ud83d\udc69|\ud83d\udc6a|\ud83d\udc6b|\ud83d\udc6e|\ud83d\udc6f|\ud83d\udc70|\ud83d\udc71|\ud83d\udc72|\ud83d\udc73|\ud83d\udc74|\ud83d\udc75|\ud83d\udc76|\ud83d\udeb4|\ud83d\udc78|\ud83d\udc79|\ud83d\udc7a|\ud83d\udc7b|\ud83d\udc7c|\ud83d\udc7d|\ud83d\udc7e|\ud83d\udc7f|\ud83d\udc80|\ud83d\udc81|\ud83d\udc82|\ud83d\udc83|\ud83d\udc84|\ud83d\udc85|\ud83d\udc86|\ud83d\udc87|\ud83d\udc88|\ud83d\udc89|\ud83d\udc8a|\ud83d\udc8b|\ud83d\udc8c|\ud83d\udc8d|\ud83d\udc8e|\ud83d\udc8f|\ud83d\udc90|\ud83d\udc91|\ud83d\udc92|\ud83d\udc93|\ud83d\udc94|\ud83d\udc95|\ud83d\udc96|\ud83d\udc97|\ud83d\udc98|\ud83d\udc99|\ud83d\udc9a|\ud83d\udc9b|\ud83d\udc9c|\ud83d\udc9d|\ud83d\udc9e|\ud83d\udc9f|\ud83d\udca0|\ud83d\udca1|\ud83d\udca2|\ud83d\udca3|\ud83d\udca4|\ud83d\udca5|\ud83d\udca6|\ud83d\udca7|\ud83d\udca8|\ud83d\udca9|\ud83d\udcaa|\ud83d\udcab|\ud83d\udcac|\ud83d\udcae|\ud83d\udcaf|\ud83d\udcb0|\ud83d\udcb1|\ud83d\udcb2|\ud83d\udcb3|\ud83d\udcb4|\ud83d\udcb5|\ud83d\udcb8|\ud83d\udcb9|\ud83d\udcba|\ud83d\udcbb|\ud83d\udcbc|\ud83d\udcbd|\ud83d\udcbe|\ud83d\udcbf|\ud83d\udcc0|\ud83d\udcc1|\ud83d\udcc2|\ud83d\udcc3|\ud83d\udcc4|\ud83d\udcc5|\ud83d\udcc6|\ud83d\udcc7|\ud83d\udcc8|\ud83d\udcc9|\ud83d\udcca|\ud83d\udccb|\ud83d\udccc|\ud83d\udccd|\ud83d\udcce|\ud83d\udccf|\ud83d\udcd0|\ud83d\udcd1|\ud83d\udcd2|\ud83d\udcd3|\ud83d\udcd4|\ud83d\udcd5|\ud83d\udcd6|\ud83d\udcd7|\ud83d\udcd8|\ud83d\udcd9|\ud83d\udcda|\ud83d\udcdb|\ud83d\udcdc|\ud83d\udcdd|\ud83d\udcde|\ud83d\udcdf|\ud83d\udce0|\ud83d\udce1|\ud83d\udce2|\ud83d\udce3|\ud83d\udce4|\ud83d\udce5|\ud83d\udce6|\ud83d\udce7|\ud83d\udce8|\ud83d\udce9|\ud83d\udcea|\ud83d\udceb|\ud83d\udcee|\ud83d\udcf0|\ud83d\udcf1|\ud83d\udcf2|\ud83d\udcf3|\ud83d\udcf4|\ud83d\udcf6|\ud83d\udcf7|\ud83d\udcf9|\ud83d\udcfa|\ud83d\udcfb|\ud83d\udcfc|\ud83d\udd03|\ud83d\udd0a|\ud83d\udd0b|\ud83d\udd0c|\ud83d\udd0d|\ud83d\udd0e|\ud83d\udd0f|\ud83d\udd10|\ud83d\udd11|\ud83d\udd12|\ud83d\udd13|\ud83d\udd14|\ud83d\udd16|\ud83d\udd17|\ud83d\udd18|\ud83d\udd19|\ud83d\udd1a|\ud83d\udd1b|\ud83d\udd1c|\ud83d\udd1d|\ud83d\udd1e|\ud83d\udd1f|\ud83d\udd20|\ud83d\udd21|\ud83d\udd22|\ud83d\udd23|\ud83d\udd24|\ud83d\udd25|\ud83d\udd26|\ud83d\udd27|\ud83d\udd28|\ud83d\udd29|\ud83d\udd2a|\ud83d\udd2b|\ud83d\udd2e|\ud83d\udd2f|\ud83d\udd30|\ud83d\udd31|\ud83d\udd32|\ud83d\udd33|\ud83d\udd34|\ud83d\udd35|\ud83d\udd36|\ud83d\udd37|\ud83d\udd38|\ud83d\udd39|\ud83d\udd3a|\ud83d\udd3b|\ud83d\udd3c|\ud83d\udd3d|\ud83d\udd50|\ud83d\udd51|\ud83d\udd52|\ud83d\udd53|\ud83d\udd54|\ud83d\udd55|\ud83d\udd56|\ud83d\udd57|\ud83d\udd58|\ud83d\udd59|\ud83d\udd5a|\ud83d\udd5b|\ud83d\uddfb|\ud83d\uddfc|\ud83d\uddfd|\ud83d\uddfe|\ud83d\uddff|\ud83d\ude01|\ud83d\ude02|\ud83d\ude03|\ud83d\ude04|\ud83d\ude05|\ud83d\ude06|\ud83d\ude09|\ud83d\ude0a|\ud83d\ude0b|\ud83d\ude0c|\ud83d\ude0d|\ud83d\ude0f|\ud83d\ude12|\ud83d\ude13|\ud83d\ude14|\ud83d\ude16|\ud83d\ude18|\ud83d\ude1a|\ud83d\ude1c|\ud83d\ude1d|\ud83d\ude1e|\ud83d\ude20|\ud83d\ude21|\ud83d\ude22|\ud83d\ude23|\ud83d\ude24|\ud83d\ude25|\ud83d\ude28|\ud83d\ude29|\ud83d\ude2a|\ud83d\ude2b|\ud83d\ude2d|\ud83d\ude30|\ud83d\ude31|\ud83d\ude32|\ud83d\ude33|\ud83d\ude35|\ud83d\ude37|\ud83d\ude38|\ud83d\ude39|\ud83d\ude3a|\ud83d\ude3b|\ud83d\ude3c|\ud83d\ude3d|\ud83d\ude3e|\ud83d\ude3f|\ud83d\ude40|\ud83d\ude45|\ud83d\ude46|\ud83d\ude47|\ud83d\ude48|\ud83d\ude49|\ud83d\ude4a|\ud83d\ude4b|\ud83d\ude4c|\ud83d\ude4d|\ud83d\ude4e|\ud83d\ude4f|\ud83d\ude80|\ud83d\ude83|\ud83d\ude84|\ud83d\ude85|\ud83d\ude87|\ud83d\ude89|\ud83d\ude8c|\ud83d\ude8f|\ud83d\ude91|\ud83d\ude92|\ud83d\ude93|\ud83d\ude95|\ud83d\ude97|\ud83d\ude99|\ud83d\ude9a|\ud83d\udea2|\ud83d\udea4|\ud83d\udea5|\ud83d\udea7|\ud83d\udea8|\ud83d\udea9|\ud83d\udeaa|\ud83d\udeab|\ud83d\udeac|\ud83d\udead|\ud83d\udeb2|\ud83d\udeb6|\ud83d\udeb9|\ud83d\udeba|\ud83d\udebb|\ud83d\udebc|\ud83d\udebd|\ud83d\udebe|\ud83d\udec0|\ud83c\udde6|\ud83c\udde7|\ud83c\udde8|\ud83c\udde9|\ud83c\uddea|\ud83c\uddeb|\ud83c\uddec|\ud83c\udded|\ud83c\uddee|\ud83c\uddef|\ud83c\uddf0|\ud83c\uddf1|\ud83c\uddf2|\ud83c\uddf3|\ud83c\uddf4|\ud83c\uddf5|\ud83c\uddf6|\ud83c\uddf7|\ud83c\uddf8|\ud83c\uddf9|\ud83c\uddfa|\ud83c\uddfb|\ud83c\uddfc|\ud83c\uddfd|\ud83c\uddfe|\ud83c\uddff|\ud83c\udf0d|\ud83c\udf0e|\ud83c\udf10|\ud83c\udf12|\ud83c\udf16|\ud83c\udf17|\ue50a|\u27b0|\u2797|\u2796|\u2795|\u2755|\u2754|\u2753|\u274e|\u274c|\u2728|\u270b|\u270a|\u2705|\u26ce|\u23f3|\u23f0|\u23ec|\u23eb|\u23ea|\u23e9|\u27bf|\u00a9|\u00ae)|(?:(?:\ud83c\udc04|\ud83c\udd70|\ud83c\udd71|\ud83c\udd7e|\ud83c\udd7f|\ud83c\ude02|\ud83c\ude1a|\ud83c\ude2f|\ud83c\ude37|\u3299|\u303d|\u3030|\u2b55|\u2b50|\u2b1c|\u2b1b|\u2b07|\u2b06|\u2b05|\u2935|\u2934|\u27a1|\u2764|\u2757|\u2747|\u2744|\u2734|\u2733|\u2716|\u2714|\u2712|\u270f|\u270c|\u2709|\u2708|\u2702|\u26fd|\u26fa|\u26f5|\u26f3|\u26f2|\u26ea|\u26d4|\u26c5|\u26c4|\u26be|\u26bd|\u26ab|\u26aa|\u26a1|\u26a0|\u2693|\u267f|\u267b|\u3297|\u2666|\u2665|\u2663|\u2660|\u2653|\u2652|\u2651|\u2650|\u264f|\u264e|\u264d|\u264c|\u264b|\u264a|\u2649|\u2648|\u263a|\u261d|\u2615|\u2614|\u2611|\u260e|\u2601|\u2600|\u25fe|\u25fd|\u25fc|\u25fb|\u25c0|\u25b6|\u25ab|\u25aa|\u24c2|\u231b|\u231a|\u21aa|\u21a9|\u2199|\u2198|\u2197|\u2196|\u2195|\u2194|\u2139|\u2122|\u2049|\u203c|\u2668)([\uFE0E\uFE0F]?)))/g,

		// used to find HTML special chars in attributes
			rescaper = /[&<>'"]/g,

		// nodes with type 1 which should **not** be parsed (including lower case svg)
			shouldntBeParsed = /IFRAME|NOFRAMES|NOSCRIPT|SCRIPT|SELECT|STYLE|TEXTAREA|[a-z]/,

		// just a private shortcut
			fromCharCode = String.fromCharCode;

		return twemoji;


		/////////////////////////
		//  private functions  //
		//     declaration     //
		/////////////////////////

		/**
		 * Shortcut to create text nodes
		 * @param   string  text used to create DOM text node
		 * @return  Node  a DOM node with that text
		 */
		function createText(text) {
			return document.createTextNode(text);
		}

		/**
		 * Utility function to escape html attribute text
		 * @param   string  text use in HTML attribute
		 * @return  string  text encoded to use in HTML attribute
		 */
		function escapeHTML(s) {
			return s.replace(rescaper, replacer);
		}

		/**
		 * Default callback used to generate emoji src
		 *  based on Twitter CDN
		 * @param   string    the emoji codepoint string
		 * @param   string    the default size to use, i.e. "36x36"
		 * @param   string    optional "\uFE0F" variant char, ignored by default
		 * @return  string    the image source to use
		 */
		function defaultImageSrcGenerator(icon, options) {
			return ''.concat(options.base, options.size, '/', icon, options.ext);
		}

		/**
		 * Given a generic DOM nodeType 1, walk through all children
		 * and store every nodeType 3 (#text) found in the tree.
		 * @param   Element a DOM Element with probably some text in it
		 * @param   Array the list of previously discovered text nodes
		 * @return  Array same list with new discovered nodes, if any
		 */
		function grabAllTextNodes(node, allText) {
			var
				childNodes = node.childNodes,
				length = childNodes.length,
				subnode,
				nodeType;
			while (length--) {
				subnode = childNodes[length];
				nodeType = subnode.nodeType;
				// parse emoji only in text nodes
				if (nodeType === 3) {
					// collect them to process emoji later
					allText.push(subnode);
				}
				// ignore all nodes that are not type 1 or that
				// should not be parsed as script, style, and others
				else if (nodeType === 1 && !shouldntBeParsed.test(subnode.nodeName)) {
					grabAllTextNodes(subnode, allText);
				}
			}
			return allText;
		}

		/**
		 * Used to both remove the possible variant
		 *  and to convert utf16 into code points
		 * @param   string    the emoji surrogate pair
		 * @param   string    the optional variant char, if any
		 */
		function grabTheRightIcon(icon, variant) {
			// if variant is present as \uFE0F
			return toCodePoint(
				variant === '\uFE0F' ?
					// the icon should not contain it
					icon.slice(0, -1) :
					// fix non standard OSX behavior
					(icon.length === 3 && icon.charAt(1) === '\uFE0F' ?
					icon.charAt(0) + icon.charAt(2) : icon)
			);
		}

		/**
		 * DOM version of the same logic / parser:
		 *  emojify all found sub-text nodes placing images node instead.
		 * @param   Element   generic DOM node with some text in some child node
		 * @param   Object    options  containing info about how to parse
		 *
		 *            .callback   Function  the callback to invoke per each found emoji.
		 *            .base       string    the base url, by default twemoji.base
		 *            .ext        string    the image extension, by default twemoji.ext
		 *            .size       string    the assets size, by default twemoji.size
		 *
		 * @return  Element same generic node with emoji in place, if any.
		 */
		function parseNode(node, options) {
			var
				allText = grabAllTextNodes(node, []),
				length = allText.length,
				attrib,
				attrname,
				modified,
				fragment,
				subnode,
				text,
				match,
				i,
				index,
				img,
				alt,
				icon,
				variant,
				src;
			while (length--) {
				modified = false;
				fragment = document.createDocumentFragment();
				subnode = allText[length];
				text = subnode.nodeValue;
				i = 0;
				while ((match = re.exec(text))) {
					index = match.index;
					if (index !== i) {
						fragment.appendChild(
							createText(text.slice(i, index))
						);
					}
					alt = match[0];
					icon = match[1];
					variant = match[2];
					i = index + alt.length;
					if (variant !== '\uFE0E') {
						src = options.callback(
							grabTheRightIcon(icon, variant),
							options,
							variant
						);
						if (src) {
							img = new Image();
							img.onerror = options.onerror;
							img.setAttribute('draggable', 'false');
							attrib = options.attributes(icon, variant);
							for (attrname in attrib) {
								if (
									attrib.hasOwnProperty(attrname) &&
										// don't allow any handlers to be set + don't allow overrides
									attrname.indexOf('on') !== 0 &&
									!img.hasAttribute(attrname)
								) {
									img.setAttribute(attrname, attrib[attrname]);
								}
							}
							img.className = options.className;
							img.alt = alt;
							img.src = src;
							modified = true;
							fragment.appendChild(img);
						}
					}
					if (!img) fragment.appendChild(createText(alt));
					img = null;
				}
				// is there actually anything to replace in here ?
				if (modified) {
					// any text left to be added ?
					if (i < text.length) {
						fragment.appendChild(
							createText(text.slice(i))
						);
					}
					// replace the text node only, leave intact
					// anything else surrounding such text
					subnode.parentNode.replaceChild(fragment, subnode);
				}
			}
			return node;
		}

		/**
		 * String/HTML version of the same logic / parser:
		 *  emojify a generic text placing images tags instead of surrogates pair.
		 * @param   string    generic string with possibly some emoji in it
		 * @param   Object    options  containing info about how to parse
		 *
		 *            .callback   Function  the callback to invoke per each found emoji.
		 *            .base       string    the base url, by default twemoji.base
		 *            .ext        string    the image extension, by default twemoji.ext
		 *            .size       string    the assets size, by default twemoji.size
		 *
		 * @return  the string with <img tags> replacing all found and parsed emoji
		 */
		function parseString(str, options) {
			return replace(str, function (match, icon, variant) {
				var
					ret = match,
					attrib,
					attrname,
					src;
				// verify the variant is not the FE0E one
				// this variant means "emoji as text" and should not
				// require any action/replacement
				// http://unicode.org/Public/UNIDATA/StandardizedVariants.html
				if (variant !== '\uFE0E') {
					src = options.callback(
						grabTheRightIcon(icon, variant),
						options,
						variant
					);
					if (src) {
						// recycle the match string replacing the emoji
						// with its image counter part
						ret = '<img '.concat(
							'class="', options.className, '" ',
							'draggable="false" ',
							// needs to preserve user original intent
							// when variants should be copied and pasted too
							'alt="',
							match,
							'"',
							' src="',
							src,
							'"'
						);
						attrib = options.attributes(icon, variant);
						for (attrname in attrib) {
							if (
								attrib.hasOwnProperty(attrname) &&
									// don't allow any handlers to be set + don't allow overrides
								attrname.indexOf('on') !== 0 &&
								ret.indexOf(' ' + attrname + '=') === -1
							) {
								ret = ret.concat(' ', attrname, '="', escapeHTML(attrib[attrname]), '"');
							}
						}
						ret = ret.concat('>');
					}
				}
				return ret;
			});
		}

		/**
		 * Function used to actually replace HTML special chars
		 * @param   string  HTML special char
		 * @return  string  encoded HTML special char
		 */
		function replacer(m) {
			return escaper[m];
		}

		/**
		 * Default options.attribute callback
		 * @return  null
		 */
		function returnNull() {
			return null;
		}

		/**
		 * Given a generic value, creates its squared counterpart if it's a number.
		 *  As example, number 36 will return '36x36'.
		 * @param   any     a generic value.
		 * @return  any     a string representing asset size, i.e. "36x36"
		 *                  only in case the value was a number.
		 *                  Returns initial value otherwise.
		 */
		function toSizeSquaredAsset(value) {
			return typeof value === 'number' ?
			value + 'x' + value :
				value;
		}


		/////////////////////////
		//  exported functions //
		//     declaration     //
		/////////////////////////

		function fromCodePoint(codepoint) {
			var code = typeof codepoint === 'string' ?
				parseInt(codepoint, 16) : codepoint;
			if (code < 0x10000) {
				return fromCharCode(code);
			}
			code -= 0x10000;
			return fromCharCode(
				0xD800 + (code >> 10),
				0xDC00 + (code & 0x3FF)
			);
		}

		function parse(what, how) {
			if (!how || typeof how === 'function') {
				how = {callback: how};
			}
			// if first argument is string, inject html <img> tags
			// otherwise use the DOM tree and parse text nodes only
			return (typeof what === 'string' ? parseString : parseNode)(what, {
				callback:   how.callback || defaultImageSrcGenerator,
				attributes: typeof how.attributes === 'function' ? how.attributes : returnNull,
				base:       typeof how.base === 'string' ? how.base : twemoji.base,
				ext:        how.ext || twemoji.ext,
				size:       how.folder || toSizeSquaredAsset(how.size || twemoji.size),
				className:  how.className || twemoji.className,
				onerror:    how.onerror || twemoji.onerror
			});
		}

		function replace(text, callback) {
			return String(text).replace(re, callback);
		}

		function test(text) {
			// IE6 needs a reset before too
			re.lastIndex = 0;
			var result = re.test(text);
			re.lastIndex = 0;
			return result;
		}

		function toCodePoint(unicodeSurrogates, sep) {
			var
				r = [],
				c = 0,
				p = 0,
				i = 0;
			while (i < unicodeSurrogates.length) {
				c = unicodeSurrogates.charCodeAt(i++);
				if (p) {
					r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
					p = 0;
				} else if (0xD800 <= c && c <= 0xDBFF) {
					p = c;
				} else {
					r.push(c.toString(16));
				}
			}
			return r.join(sep || '-');
		}

	}());

})(window);

window.StickersModule.Service = {};

(function(Module) {

	var API_VERSION = 1;

	Module.Api = {

		getApiVersion: function() {
			return API_VERSION;
		},

		getPacks: function(doneCallback) {
			var url = Module.Url.getPacksUrl();

			Module.Http.get(url, {
				success: doneCallback
			});
		},

		sendStatistic: function(statistic) {
			Module.Http.post(Module.Url.getStatisticUrl(), statistic);
		},

		updateUserData: function(userData) {
			return Module.Http.ajax({
				type: 'PUT',
				url: Module.Url.getUserDataUrl(),
				data: userData,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		},

		changeUserPackStatus: function(packName, status, pricePoint, doneCallback) {

			var url = Module.Url.getUserPackUrl(packName, pricePoint);

			Module.Http.post(url, {
				status: status
			}, {
				success: function() {
					doneCallback && doneCallback();
				},
				error: function() {
					if (status) {
						var pr = Module.Service.PendingRequest;
						pr.add(pr.tasks.activateUserPack, {
							packName: packName,
							pricePoint: pricePoint
						});
					}
				}
			}, {
				'Content-Type': 'application/json'
			});
		}

	};
})(window.StickersModule);

(function(Module) {

	Module.BaseService = {

		markNewPacks: function(newPacks) {
			var globalNew = false,
				oldPacks = Module.Storage.getPacks();

			if (oldPacks.length != 0){

				Module.Service.Helper.forEach(newPacks, function(newPack, key) {
					var isNewPack = true;

					Module.Service.Helper.forEach(oldPacks, function(oldPack) {


						if(newPack.pack_name == oldPack.pack_name) {
							isNewPack = oldPack.newPack;
						}

					});

					if(isNewPack)  globalNew = true;
					newPacks[key]['newPack'] = isNewPack;
				});


				// todo: to other function
				// todo: check & fix
				//if (globalNew) {

				if (globalNew == false && Module.Storage.getUsedStickers().length == 0) {
					globalNew = true;
				}
				Module.DOMEventService.changeContentHighlight(globalNew);
				//}


				// *****************************************************************************************************
				// todo: do in other function
				// update used stickers

				var used = Module.Storage.getUsedStickers();

				for (var i = 0; i < used.length; i++) {
					var sticker = this.parseStickerFromText('[[' + used[i].code + ']]');

					var pack = null;
					for (var j = 0; j < newPacks.length; j++) {
						if (newPacks[j].pack_name == sticker.pack) {
							pack = newPacks[j];
							break;
						}
					}

					if (pack == null) {
						used.splice(i, 1);
						continue;
					}

					var isset = false;
					for (var j = 0; j < pack.stickers.length; j++) {
						if (pack.stickers[j].name == sticker.name) {
							isset = true;
							break;
						}
					}

					if (!isset) {
						used.splice(i, 1);
						continue;
					}
				}

				Module.Storage.setUsedStickers(used);

				// *****************************************************************************************************
			} else {
				Module.DOMEventService.changeContentHighlight(true);
			}

			return newPacks;
		},

		parseStickerFromText: function(text) {
			var outData = {
					isSticker: false,
					url: ''
				},
				matchData = text.match(/\[\[(\S+)_(\S+)\]\]/);

			if (matchData) {
				outData.isSticker = true;
				outData.url = Module.Url.getStickerUrl(matchData[1], matchData[2]);


				outData.pack = matchData[1];
				outData.name = matchData[2];
			}

			return outData;
		},

		onUserMessageSent: function(isSticker) {
			var nowDate = new Date().getTime() / 1000 | 0,
				action = 'send',
				category = 'message',
				label = (isSticker) ? 'sticker' : 'text';


			Module.Api.sendStatistic([{
				action: action,
				category: category,
				label: label,
				time: nowDate
			}]);

			ga('stickerTracker.send', 'event', category, action, label);
		},

		updatePacks: function(successCallback) {

			Module.Api.getPacks(
				(function(response) {
					if(response.status != 'success') {
						return;
					}

					var packs = response.data;

					// show only active packs
					for (var i = 0; i < packs.length; i++) {
						if (packs[i].user_status != 'active') {
							packs.splice(i, 1);
						}
					}

					packs = this.markNewPacks(packs);

					Module.Storage.setPacks(packs);

					successCallback && successCallback(packs);
				}).bind(this)
			);
		},

		trackUserData: function() {
			if (!Module.Configs.userId || !Module.Configs.userData) {
				return;
			}

			var storedUserData = Module.Storage.getUserData() || {};

			if (!Module.Service.Helper.deepCompare(Module.Configs.userData, storedUserData)) {
				Module.Api.updateUserData(Module.Configs.userData);
				Module.Storage.setUserData(Module.Configs.userData);
			}
		}
	};

})(window.StickersModule);

(function(Module) {

	Module.DOMEventService = {

		events: {
			resize: 'resize',
			popoverShown: 'sp:popover:shown',
			popoverHidden: 'sp:popover:hidden',
			showContentHighlight: 'sp:content:highlight:show',
			hideContentHighlight: 'sp:content:highlight:hide'
		},

		dispatch: function(eventName, el) {
			if (!eventName) {
				return;
			}

			el = el || window;

			var event;
			if (document.createEvent) {
				event = document.createEvent('HTMLEvents');
				event.initEvent(eventName, true, true);
			} else if (document.createEventObject) { // IE < 9
				event = document.createEventObject();
				event.eventType = eventName;
			}

			event.eventName = eventName;

			if (el.dispatchEvent) {
				el.dispatchEvent(event);
			} else if (el.fireEvent) { // IE < 9
				el.fireEvent('on' + event.eventType, event);// can trigger only real event (e.g. 'click')
			} else if (el[eventName]) {
				el[eventName]();
			} else if (el['on' + eventName]) {
				el['on' + eventName]();
			}
		},

		popoverShown: function() {
			this.dispatch(this.events.popoverShown);
		},

		popoverHidden: function() {
			this.dispatch(this.events.popoverHidden);
		},

		changeContentHighlight: function(value) {
			this.dispatch((value) ? this.events.showContentHighlight : this.events.hideContentHighlight);
		},

		resize: function(el) {
			this.dispatch(this.events.resize, el);
		}
	};

})(window.StickersModule);

(function(Module) {

	Module.El = {

		css: function(el, property) {
			// todo: getComputedStyle add IE 8 supporting

			return (el.style && el.style[property])
				|| (el.currentStyle && el.currentStyle[property])
				|| (getComputedStyle(el)[property]);

		},

		outerWidth: function(el) {
			var width = el.offsetWidth;
			width += parseInt(this.css(el, 'marginLeft')) + parseInt(this.css(el, 'marginRight'));
			return width;
		},

		getParents: function (elem, selector) {

			var parents = [];
			if ( selector ) {
				var firstChar = selector.charAt(0);
			}

			// Get matches
			for ( ; elem && elem !== document; elem = elem.parentNode ) {
				if ( selector ) {

					// If selector is a class
					if ( firstChar === '.' ) {
						if ( elem.classList.contains( selector.substr(1) ) ) {
							parents.push( elem );
						}
					}

					// If selector is an ID
					if ( firstChar === '#' ) {
						if ( elem.id === selector.substr(1) ) {
							parents.push( elem );
						}
					}

					// If selector is a data attribute
					if ( firstChar === '[' ) {
						if ( elem.hasAttribute( selector.substr(1, selector.length - 1) )) {
							parents.push( elem );
						}
					}

					// If selector is a tag
					if ( elem.tagName.toLowerCase() === selector ) {
						parents.push( elem );
					}

				} else {
					parents.push( elem );
				}

			}

			// Return parents if any exist
			if ( parents.length === 0 ) {
				return null;
			} else {
				return parents;
			}

		}
	};
})(window.StickersModule);

(function(Module) {

	Module.EmojiService = Module.Class({

		emojiProvider: null,

		_constructor: function(emojiProvider) {
			this.emojiProvider = emojiProvider;
		},

		parseEmojiFromText: function(text) {
			return this.emojiProvider.parse(text, {
				size: (window.devicePixelRatio == 2) ? 72 : 36
			});
		},

		parseEmojiFromHtml: function(html) {
			var content = document.createElement('div');
			content.innerHTML = html;

			var emojisEls = content.getElementsByClassName('emoji');

			for (var i = emojisEls.length - 1; i >= 0; i--) {
				var emoji = emojisEls[i].getAttribute('alt');
				content.replaceChild(document.createTextNode(emoji), emojisEls[i]);
			}

			return content.innerHTML;
		}
	});

})(window.StickersModule);

(function(Module) {

	Module.Service.Helper = {
		forEach: function(data, callback) {
			for (var x in data) {
				callback(data[x], x);
			}
		},

		merge: function(obj1, obj2) {
			var obj3 = {};

			for(var attrname in obj1) {
				obj3[attrname] = obj1[attrname];
			}

			for(var attrname in obj2) {
				obj3[attrname] = obj2[attrname];
			}

			return obj3;
		},

		setConfig: function(config) {
			Module.Configs = this.merge(Module.Configs || {}, config);
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

		urlParamsSerialize: function(params) {
			var str = [];
			for(var p in params)
				if (params.hasOwnProperty(p)) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
				}
			return str.join('&');
		},

		isIE: function() {
			return ((navigator.appName == 'Microsoft Internet Explorer') ||
			(navigator.userAgent.match(/MSIE\s+\d+\.\d+/)) ||
			(navigator.userAgent.match(/Trident\/\d+\.\d+/)));
		},

		// todo: maybe remove
		deepCompare: function() {
			var i, l, leftChain, rightChain;

			function compare2Objects (x, y) {
				var p;

				// remember that NaN === NaN returns false
				// and isNaN(undefined) returns true
				if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
					return true;
				}

				// Compare primitives and functions.
				// Check if both arguments link to the same object.
				// Especially useful on step when comparing prototypes
				if (x === y) {
					return true;
				}

				// Works in case when functions are created in constructor.
				// Comparing dates is a common scenario. Another built-ins?
				// We can even handle functions passed across iframes
				if ((typeof x === 'function' && typeof y === 'function') ||
					(x instanceof Date && y instanceof Date) ||
					(x instanceof RegExp && y instanceof RegExp) ||
					(x instanceof String && y instanceof String) ||
					(x instanceof Number && y instanceof Number)) {
					return x.toString() === y.toString();
				}

				// At last checking prototypes as good a we can
				if (!(x instanceof Object && y instanceof Object)) {
					return false;
				}

				if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
					return false;
				}

				if (x.constructor !== y.constructor) {
					return false;
				}

				if (x.prototype !== y.prototype) {
					return false;
				}

				// Check for infinitive linking loops
				if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
					return false;
				}

				// Quick checking of one object beeing a subset of another.
				for (p in y) {
					if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
						return false;
					}
					else if (typeof y[p] !== typeof x[p]) {
						return false;
					}
				}

				for (p in x) {
					if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
						return false;
					}
					else if (typeof y[p] !== typeof x[p]) {
						return false;
					}

					switch (typeof (x[p])) {
						case 'object':
						case 'function':

							leftChain.push(x);
							rightChain.push(y);

							if (!compare2Objects (x[p], y[p])) {
								return false;
							}

							leftChain.pop();
							rightChain.pop();
							break;

						default:
							if (x[p] !== y[p]) {
								return false;
							}
							break;
					}
				}

				return true;
			}

			if (arguments.length < 1) {
				return true; //Die silently? Don't know how to handle such case, please help...
				// throw "Need two or more arguments to compare";
			}

			for (i = 1, l = arguments.length; i < l; i++) {

				leftChain = [];
				rightChain = [];

				if (!compare2Objects(arguments[0], arguments[i])) {
					return false;
				}
			}

			return true;
		},

		md5: function(string) {
			return Module.MD5(string);
		},

		getLocation: function(url) {
			var location = document.createElement('a');
			location.href = url;
			return location;
		},

		getDomain: function(url) {
			var location = this.getLocation(url);
			return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
		},

		getMobileOS: function() {
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;

			if(userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i )) {
				return 'ios';
			} else if(userAgent.match( /Android/i )) {
				return 'android';
			} else {
				return 'other';
			}
		}
	};

})(window.StickersModule);

(function(Module) {

	Module.Http = {

		// todo: refactor post(options) & get(options)

		get: function(url, callbacks, headers) {
			callbacks = callbacks || {};
			headers = headers || {};

			this.ajax({
				type: 'GET',
				url: url,
				headers: headers,
				success: callbacks.success,
				error: callbacks.error,
				complete: callbacks.complete
			});
		},

		post: function(url, data, callbacks, headers) {
			data = data || {};
			callbacks = callbacks || {};
			headers = headers || {};

			this.ajax({
				type: 'POST',
				url: url,
				data: data,
				headers: headers,
				success: callbacks.success,
				error: callbacks.error,
				complete: callbacks.complete
			});
		},

		ajax: function(options) {
			options = options || {};

			if (!options.url) {
				return;
			}

			options.type = (options.type && options.type.toUpperCase()) || 'GET';
			options.headers = options.headers || {};
			options.data = options.data || {};
			options.success = options.success || function() {};
			options.error = options.error || function() {};
			options.complete = options.complete || function() {};

			options.headers.Apikey = Module.Configs.apiKey;
			options.headers.Platform = 'JS';
			options.headers.Localization = Module.Configs.lang;

			if (Module.Configs.userId !== null) {
				options.headers.UserId = Module.Configs.userId;
			}

			if (options.type == 'POST' || options.type == 'PUT') {
				options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded';
				options.headers['DeviceId'] = Module.Storage.getUniqUserId();
			}


			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open(options.type, options.url, true);

			Module.Service.Helper.forEach(options.headers, function(value, name) {
				xmlhttp.setRequestHeader(name, value);
			});

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						options.success(JSON.parse(xmlhttp.responseText), xmlhttp);
					} else {
						var response = {};
						try {
							response = JSON.parse(xmlhttp.responseText);
						} catch (ex) {
							response = {}
						}
						options.error(response, xmlhttp);
					}

					options.complete(JSON.parse(xmlhttp.responseText), xmlhttp);
				}
			};

			xmlhttp.send(JSON.stringify(options.data));
		}
	};
})(window.StickersModule);

(function(Module) {

	var stickerpipe;

	Module.Service.Pack = {

		init: function(_stickerpipe) {
			stickerpipe = _stickerpipe;
		},

		activateUserPack: function(packName, pricePoint, doneCallback) {
			Module.Api.changeUserPackStatus(packName, true, pricePoint, function() {

				// todo: add event ~ "packs fetched" & remove "stickerpipe" variable
				stickerpipe.fetchPacks(function() {
					doneCallback && doneCallback();
				});

			});
		}
	};
})(window.StickersModule);

(function(Module) {

	function activateUserPack(taskData) {
		Module.Service.Pack.activateUserPack(taskData.packName, taskData.pricePoint);
	}

	Module.Service.PendingRequest = {

		tasks: {
			activateUserPack: 'activateUserPack'
		},

		add: function(taskName, taskData) {
			Module.Storage.addPendingRequestTask({
				name: taskName,
				data: taskData
			});
		},

		run: function() {
			var task = Module.Storage.popPendingRequestTask();

			while(task) {
				switch (task.name) {
					case this.tasks.activateUserPack:
						activateUserPack(task.data);
						break;
					default :
						break;
				}

				task = Module.Storage.popPendingRequestTask();
			}
		}

	};
})(window.StickersModule);

// todo: StatisticService

(function(Module) {

	Module.Storage = {

		lockr: Module.Lockr,

		setPrefix: function(storagePrefix) {
			this.lockr.prefix = storagePrefix;
		},


		getUsedStickers: function() {
			return this.lockr.get('sticker_latest_use') || [];
		},
		setUsedStickers: function(usedStickers) {
			return this.lockr.set('sticker_latest_use', usedStickers);
		},
		addUsedSticker: function(stickerCode) {

			var usedStickers = this.getUsedStickers(),
				newStorageDate = [];

			// todo: rewrite function as for & slice
			Module.Service.Helper.forEach(usedStickers, function(usedSticker) {

				if (usedSticker.code != stickerCode) {
					newStorageDate.push(usedSticker);
				}

			});

			usedStickers = newStorageDate;

			usedStickers.unshift({
				code : stickerCode
			});

			this.setUsedStickers(usedStickers);
		},


		getPacks: function() {
			var packs = this.lockr.get('sticker_packs');

			if (typeof packs == 'object' && packs.packs) {
				packs = packs.packs;
			} else if (Object.prototype.toString.call(packs) !== '[object Array]') {
				packs = [];
			}

			return packs;
		},
		setPacks: function(packs) {
			return this.lockr.set('sticker_packs', packs)
		},


		getUniqUserId: function() {
			var uniqUserId = this.lockr.get('uniqUserId');

			if (typeof uniqUserId == 'undefined') {
				uniqUserId = + new Date();
				this.lockr.set('uniqUserId', uniqUserId);
			}

			return uniqUserId;
		},


		getUserData: function() {
			return this.lockr.get('userData');
		},
		setUserData: function(userData) {
			return this.lockr.set('userData', userData);
		},


		getPendingRequestTasks: function() {
			return this.lockr.get('pending_request_tasks') || [];
		},
		setPendingRequestTasks: function(tasks) {
			return this.lockr.set('pending_request_tasks', tasks);
		},
		addPendingRequestTask: function(task) {

			var tasks = this.getPendingRequestTasks();

			tasks.push(task);

			this.setPendingRequestTasks(tasks);
		},
		popPendingRequestTask: function() {
			var tasks = this.getPendingRequestTasks(),
				task = tasks.pop();

			this.setPendingRequestTasks(tasks);

			return task;
		}
	};

})(window.StickersModule);

(function(Module) {

	function sendAPIMessage(action, attrs) {
		var iframe = Module.Service.Store.stickerpipe.storeView.iframe;

		iframe && iframe.contentWindow.postMessage(JSON.stringify({
			action: action,
			attrs: attrs
		}), Module.Service.Helper.getDomain(Module.Configs.storeUrl));
	}

	Module.Service.Store = {

		stickerpipe: null,

		onPurchaseCallback: null,

		init: function(stickerpipe) {
			this.stickerpipe = stickerpipe;
		},

		showCollections: function(packName) {
			this.stickerpipe.storeView.close();
			this.stickerpipe.open(packName);
		},

		downloadPack: function(packName, pricePoint) {
			Module.Service.Pack.activateUserPack(packName, pricePoint, function() {
				sendAPIMessage('reload');
				sendAPIMessage('onPackDownloaded', {
					packName: packName
				});
			});
		},

		purchaseSuccess: function(packName, pricePoint) {
			this.downloadPack(packName, pricePoint);
		},

		purchaseFail: function() {
			sendAPIMessage('hideActionProgress');
		},

		goBack: function() {
			sendAPIMessage('goBack');
		},

		api: {
			showCollections: function(data) {
				Module.Service.Store.showCollections(data.attrs.packName);
			},

			purchasePack: function(data) {
				var packName = data.attrs.packName,
					packTitle = data.attrs.packTitle,
					pricePoint = data.attrs.pricePoint;

				if (pricePoint == 'A' || (pricePoint == 'B' && Module.Configs.userPremium)) {
					Module.Service.Store.downloadPack(packName, pricePoint);
				} else {
					var onPurchaseCallback = Module.Service.Store.onPurchaseCallback;

					onPurchaseCallback && onPurchaseCallback(packName, packTitle, pricePoint);
				}
			},

			resizeStore: function(data) {
				Module.Service.Store.stickerpipe.storeView.resize(data.attrs.height);
			},

			showBackButton: function(data) {
				var modal = Module.Service.Store.stickerpipe.storeView.modal;

				if (data.attrs.show) {
					modal.backButton.style.display = 'block';
				} else {
					modal.backButton.style.display = 'none';
				}
			}
		}
	};

})(StickersModule);


(function(Module) {

	Module.Url = {

		buildStoreUrl: function(uri) {
			uri = uri || '';

			var params = {
				apiKey: Module.Configs.apiKey,
				platform: 'JS',
				userId: Module.Configs.userId,
				density: Module.Configs.stickerResolutionType,
				priceB: Module.Configs.priceB,
				priceC: Module.Configs.priceC,
				is_subscriber: (Module.Configs.userPremium ? 1 : 0),
				localization: Module.Configs.lang
			};

			return Module.Configs.storeUrl + ((Module.Configs.storeUrl.indexOf('?') == -1) ? '?' : '&')
				+ Module.Service.Helper.urlParamsSerialize(params) + '#/' + uri;
		},

		buildCdnUrl: function(uri) {
			uri = uri || '';

			return Module.Configs.cdnUrl + '/stk/' + uri;
		},

		buildApiUrl: function(uri) {
			uri = uri || '';

			return Module.Configs.apiUrl + '/api/v' + Module.Api.getApiVersion() + '/' + uri;
		},

		getStickerUrl: function(packName, stickerName) {
			return this.buildCdnUrl(
				packName + '/' + stickerName +
				'_' + Module.Configs.stickerResolutionType + '.png'
			);
		},

		getPackTabIconUrl: function(packName) {
			return this.buildCdnUrl(
				packName + '/' +
				'tab_icon_' + Module.Configs.tabResolutionType + '.png'
			);
		},

		getPacksUrl: function() {
			var url = this.buildApiUrl('client-packs');

			if (Module.Configs.userId !== null) {
				url = this.buildApiUrl('packs');

				if (Module.Configs.userPremium) {
					url += '?is_subscriber=1';
				}
			}

			return url;
		},

		getStatisticUrl: function() {
			return this.buildApiUrl('track-statistic');
		},

		getUserDataUrl: function() {
			return this.buildApiUrl('user');
		},

		getUserPackUrl: function(packName, pricePoint) {

			// detect purchase type
			var purchaseType = 'free';
			if (pricePoint == 'B') {
				purchaseType = 'oneoff';
				if (Module.Configs.userPremium) {
					purchaseType = 'subscription';
				}
			} else if (pricePoint == 'C') {
				purchaseType = 'oneoff';
			}

			// build url
			var url = this.buildApiUrl('user/pack/' + packName);
			url += '?' + Module.Service.Helper.urlParamsSerialize({
					purchase_type: purchaseType
				});

			return url;
		},

		getStoreUrl: function() {
			return this.buildStoreUrl('store/');
		},

		getStorePackUrl: function(packName) {
			return this.buildStoreUrl('packs/' + packName);
		}

	};
})(window.StickersModule);

window.StickersModule.Configs = {};

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

		apiKey: '', // example: 72921666b5ff8651f374747bfefaf7b2

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
		height: '350px',
		width: '320px',

		lang: document.documentElement.lang.substr(0, 2) || 'en'
	});

})(window.StickersModule);

(function(Module) {

	Module.Service.Helper.setConfig({
		emojiList: [
			// Emoticons		
			"😊",
			"😃",
			"😁",
			"😂",
			"😀",
			"😇",
			"😈",
			"😎",
			"😐",
			"😑",
			"😕",
			"😗",
			"😙",
			"😛",
			"😟",
			"😦",
			"😧",
			"😬",
			"😮",
			"😯",
			"😴",
			"😶",
			"😄",
			"😅",
			"😆",
			"😉",
			"😋",
			"😌",
			"😍",
			"😏",
			"😒",
			"😓",
			"😔",
			"😖",
			"😘",
			"😚",
			"😜",
			"😝",
			"😞",
			"😠",
			"😡",
			"😢",
			"😣",
			"😤",
			"😥",
			"😨",
			"😩",
			"😪",
			"😫",
			"😭",
			"😰",
			"😱",
			"😲",
			"😳",
			"😵",
			"😷",
			"😸",
			"😹",
			"😺",
			"😻",
			"😼",
			"😽",
			"😾",
			"😿",
			"🙀",
			"🙅",
			"🙆",
			"🙇",
			"🙈",
			"🙉",
			"🙊",
			"🙋",
			"🙌",
			"🙍",
			"🙎",
			"🙏",
// Dingbats		
			"✂",
			"✅",
			"✈",
			"✉",
			"✊",
			"✋",
			"✌",
			"✏",
			"✒",
			"✔",
			"✖",
			"✨",
			"✳",
			"✴",
			"❄",
			"❇",
			"❌",
			"❎",
			"❓",
			"❔",
			"❕",
			"❗",
			"❤",
			"➕",
			"➖",
			"➗",
			"➡",
			"➰",
// Transport and map symbols		
			"🚀",
			"🚃",
			"🚄",
			"🚅",
			"🚇",
			"🚉",
			"🚌",
			"🚏",
			"🚑",
			"🚒",
			"🚓",
			"🚕",
			"🚗",
			"🚙",
			"🚚",
			"🚢",
			"🚤",
			"🚥",
			"🚧",
			"🚨",
			"🚩",
			"🚪",
			"🚫",
			"🚬",
			"🚭",
			"🚲",
			"🚶",
			"🚹",
			"🚺",
			"🚻",
			"🚼",
			"🚽",
			"🚾",
			"🛀",
// Enclosed characters		
			"Ⓜ",
			"🅰",
			"🅱",
			"🅾",
			"🅿",
			"🆎",
			"🆑",
			"🆒",
			"🆓",
			"🆔",
			"🆕",
			"🆖",
			"🆗",
			"🆘",
			"🆙",
			"🆚",
			"🇩🇪",
			"🇬🇧",
			"🇨🇳",
			"🇯🇵",
			"🇰🇷",
			"🇫🇷",
			"🇪🇸",
			"🇮🇹",
			"🇺🇸",
			"🇷🇺",
			"🈁",
			"🈂",
			"🈚",
			"🈯",
			"🈲",
			"🈳",
			"🈴",
			"🈵",
			"🈶",
			"🈷",
			"🈸",
			"🈹",
			"🈺",
			"🉐",
			"🉑",
// Uncategorized		
			"©",
			"®",
			"‼",
			"⁉",
			"8⃣",
			"9⃣",
			"7⃣",
			"6⃣",
			"1⃣",
			"0⃣",
			"2⃣",
			"3⃣",
			"5⃣",
			"4⃣",
			"#⃣",
			"™",
			"ℹ",
			"↔",
			"↕",
			"↖",
			"↗",
			"↘",
			"↙",
			"↩",
			"↪",
			"⌚",
			"⌛",
			"⏩",
			"⏪",
			"⏫",
			"⏬",
			"⏰",
			"⏳",
			"▪",
			"▫",
			"▶",
			"◀",
			"◻",
			"◼",
			"◽",
			"◾",
			"☀",
			"☁",
			"☎",
			"☑",
			"☔",
			"☕",
			"☝",
			"☺",
			"♈",
			"♉",
			"♊",
			"♋",
			"♌",
			"♍",
			"♎",
			"♏",
			"♐",
			"♑",
			"♒",
			"♓",
			"♠",
			"♣",
			"♥",
			"♦",
			"♨",
			"♻",
			"♿",
			"⚓",
			"⚠",
			"⚡",
			"⚪",
			"⚫",
			"⚽",
			"⚾",
			"⛄",
			"⛅",
			"⛎",
			"⛔",
			"⛪",
			"⛲",
			"⛳",
			"⛵",
			"⛺",
			"⛽",
			"⤴",
			"⤵",
			"⬅",
			"⬆",
			"⬇",
			"⬛",
			"⬜",
			"⭐",
			"⭕",
			"〰",
			"〽",
			"㊗",
			"㊙",
			"🀄",
			"🃏",
			"🌀",
			"🌁",
			"🌂",
			"🌃",
			"🌄",
			"🌅",
			"🌆",
			"🌇",
			"🌈",
			"🌉",
			"🌊",
			"🌋",
			"🌌",
			"🌏",
			"🌑",
			"🌓",
			"🌔",
			"🌕",
			"🌙",
			"🌛",
			"🌟",
			"🌠",
			"🌰",
			"🌱",
			"🌴",
			"🌵",
			"🌷",
			"🌸",
			"🌹",
			"🌺",
			"🌻",
			"🌼",
			"🌽",
			"🌾",
			"🌿",
			"🍀",
			"🍁",
			"🍂",
			"🍃",
			"🍄",
			"🍅",
			"🍆",
			"🍇",
			"🍈",
			"🍉",
			"🍊",
			"🍌",
			"🍍",
			"🍎",
			"🍏",
			"🍑",
			"🍒",
			"🍓",
			"🍔",
			"🍕",
			"🍖",
			"🍗",
			"🍘",
			"🍙",
			"🍚",
			"🍛",
			"🍜",
			"🍝",
			"🍞",
			"🍟",
			"🍠",
			"🍡",
			"🍢",
			"🍣",
			"🍤",
			"🍥",
			"🍦",
			"🍧",
			"🍨",
			"🍩",
			"🍪",
			"🍫",
			"🍬",
			"🍭",
			"🍮",
			"🍯",
			"🍰",
			"🍱",
			"🍲",
			"🍳",
			"🍴",
			"🍵",
			"🍶",
			"🍷",
			"🍸",
			"🍹",
			"🍺",
			"🍻",
			"🎀",
			"🎁",
			"🎂",
			"🎃",
			"🎄",
			"🎅",
			"🎆",
			"🎇",
			"🎈",
			"🎉",
			"🎊",
			"🎋",
			"🎌",
			"🎍",
			"🎎",
			"🎏",
			"🎐",
			"🎑",
			"🎒",
			"🎓",
			"🎠",
			"🎡",
			"🎢",
			"🎣",
			"🎤",
			"🎥",
			"🎦",
			"🎧",
			"🎨",
			"🎩",
			"🎪",
			"🎫",
			"🎬",
			"🎭",
			"🎮",
			"🎯",
			"🎰",
			"🎱",
			"🎲",
			"🎳",
			"🎴",
			"🎵",
			"🎶",
			"🎷",
			"🎸",
			"🎹",
			"🎺",
			"🎻",
			"🎼",
			"🎽",
			"🎾",
			"🎿",
			"🏀",
			"🏁",
			"🏂",
			"🏃",
			"🏄",
			"🏆",
			"🏈",
			"🏊",
			"🏠",
			"🏡",
			"🏢",
			"🏣",
			"🏥",
			"🏦",
			"🏧",
			"🏨",
			"🏩",
			"🏪",
			"🏫",
			"🏬",
			"🏭",
			"🏮",
			"🏯",
			"🏰",
			"🐌",
			"🐍",
			"🐎",
			"🐑",
			"🐒",
			"🐔",
			"🐗",
			"🐘",
			"🐙",
			"🐚",
			"🐛",
			"🐜",
			"🐝",
			"🐞",
			"🐟",
			"🐠",
			"🐡",
			"🐢",
			"🐣",
			"🐤",
			"🐥",
			"🐦",
			"🐧",
			"🐨",
			"🐩",
			"🐫",
			"🐬",
			"🐭",
			"🐮",
			"🐯",
			"🐰",
			"🐱",
			"🐲",
			"🐳",
			"🐴",
			"🐵",
			"🐶",
			"🐷",
			"🐸",
			"🐹",
			"🐺",
			"🐻",
			"🐼",
			"🐽",
			"🐾",
			"👀",
			"👂",
			"👃",
			"👄",
			"👅",
			"👆",
			"👇",
			"👈",
			"👉",
			"👊",
			"👋",
			"👌",
			"👍",
			"👎",
			"👏",
			"👐",
			"👑",
			"👒",
			"👓",
			"👔",
			"👕",
			"👖",
			"👗",
			"👘",
			"👙",
			"👚",
			"👛",
			"👜",
			"👝",
			"👞",
			"👟",
			"👠",
			"👡",
			"👢",
			"👣",
			"👤",
			"👦",
			"👧",
			"👨",
			"👩",
			"👪",
			"👫",
			"👮",
			"👯",
			"👰",
			"👱",
			"👲",
			"👳",
			"👴",
			"👵",
			"👶",
			"👷",
			"👸",
			"👹",
			"👺",
			"👻",
			"👼",
			"👽",
			"👾",
			"👿",
			"💀",
			"💁",
			"💂",
			"💃",
			"💄",
			"💅",
			"💆",
			"💇",
			"💈",
			"💉",
			"💊",
			"💋",
			"💌",
			"💍",
			"💎",
			"💏",
			"💐",
			"💑",
			"💒",
			"💓",
			"💔",
			"💕",
			"💖",
			"💗",
			"💘",
			"💙",
			"💚",
			"💛",
			"💜",
			"💝",
			"💞",
			"💟",
			"💠",
			"💡",
			"💢",
			"💣",
			"💤",
			"💥",
			"💦",
			"💧",
			"💨",
			"💩",
			"💪",
			"💫",
			"💬",
			"💮",
			"💯",
			"💰",
			"💱",
			"💲",
			"💳",
			"💴",
			"💵",
			"💸",
			"💹",
			"💺",
			"💻",
			"💼",
			"💽",
			"💾",
			"💿",
			"📀",
			"📁",
			"📂",
			"📃",
			"📄",
			"📅",
			"📆",
			"📇",
			"📈",
			"📉",
			"📊",
			"📋",
			"📌",
			"📍",
			"📎",
			"📏",
			"📐",
			"📑",
			"📒",
			"📓",
			"📔",
			"📕",
			"📖",
			"📗",
			"📘",
			"📙",
			"📚",
			"📛",
			"📜",
			"📝",
			"📞",
			"📟",
			"📠",
			"📡",
			"📢",
			"📣",
			"📤",
			"📥",
			"📦",
			"📧",
			"📨",
			"📩",
			"📪",
			"📫",
			"📮",
			"📰",
			"📱",
			"📲",
			"📳",
			"📴",
			"📶",
			"📷",
			"📹",
			"📺",
			"📻",
			"📼",
			"🔃",
			"🔊",
			"🔋",
			"🔌",
			"🔍",
			"🔎",
			"🔏",
			"🔐",
			"🔑",
			"🔒",
			"🔓",
			"🔔",
			"🔖",
			"🔗",
			"🔘",
			"🔙",
			"🔚",
			"🔛",
			"🔜",
			"🔝",
			"🔞",
			"🔟",
			"🔠",
			"🔡",
			"🔢",
			"🔣",
			"🔤",
			"🔥",
			"🔦",
			"🔧",
			"🔨",
			"🔩",
			"🔪",
			"🔫",
			"🔮",
			"🔯",
			"🔰",
			"🔱",
			"🔲",
			"🔳",
			"🔴",
			"🔵",
			"🔶",
			"🔷",
			"🔸",
			"🔹",
			"🔺",
			"🔻",
			"🔼",
			"🔽",
			"🕐",
			"🕑",
			"🕒",
			"🕓",
			"🕔",
			"🕕",
			"🕖",
			"🕗",
			"🕘",
			"🕙",
			"🕚",
			"🕛",
			"🗻",
			"🗼",
			"🗽",
			"🗾",
			"🗿",
// Additional transport and map symbols		
			"🚁",
			"🚂",
			"🚆",
			"🚈",
			"🚊",
			"🚍",
			"🚎",
			"🚐",
			"🚔",
			"🚖",
			"🚘",
			"🚛",
			"🚜",
			"🚝",
			"🚞",
			"🚟",
			"🚠",
			"🚡",
			"🚣",
			"🚦",
			"🚮",
			"🚯",
			"🚰",
			"🚱",
			"🚳",
			"🚴",
			"🚵",
			"🚷",
			"🚸",
			"🚿",
			"🛁",
			"🛂",
			"🛃",
			"🛄",
			"🛅",
// Other additional symbols		
			"🌍",
			"🌎",
			"🌐",
			"🌒",
			"🌖",
			"🌗",
			"🌘",
			"🌚",
			"🌜",
			"🌝",
			"🌞",
			"🌲",
			"🌳",
			"🍋",
			"🍐",
			"🍼",
			"🏇",
			"🏉",
			"🏤",
			"🐀",
			"🐁",
			"🐂",
			"🐃",
			"🐄",
			"🐅",
			"🐆",
			"🐇",
			"🐈",
			"🐉",
			"🐊",
			"🐋",
			"🐏",
			"🐐",
			"🐓",
			"🐕",
			"🐖",
			"🐪",
			"👥",
			"👬",
			"👭",
			"💭",
			"💶",
			"💷",
			"📬",
			"📭",
			"📯",
			"📵",
			"🔀",
			"🔁",
			"🔂",
			"🔄",
			"🔅",
			"🔆",
			"🔇",
			"🔉",
			"🔕",
			"🔬",
			"🔭",
			"🕜",
			"🕝",
			"🕞",
			"🕟",
			"🕠",
			"🕡",
			"🕢",
			"🕣",
			"🕤",
			"🕥",
			"🕦",
			"🕧"
		]
	});

})(window.StickersModule);



window.StickersModule.View = {};

(function(Module) {

	Module.BlockView = Module.Class({

		emojisOffset: 0,
		emojisLimit: 100,

		// todo
		isRendered: false,

		emojiService: null,

		el: null,
		contentEl: null,

		tabsView: null,
		scrollView: null,

		_constructor: function(emojiService) {
			this.emojiService = emojiService;

			this.el = document.getElementById(Module.Configs.elId);
			this.contentEl = document.createElement('div');

			this.tabsView = new Module.TabsView();
			this.scrollView = new Module.ScrollView();

			this.scrollView.onScroll((function() {
				if (this.contentEl.classList.contains('sp-emojis') && this.scrollView.isAtEnd()) {
					this.renderEmojis(this.emojisOffset);
				}
			}).bind(this));

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},


		render: function(stickerPacks) {
			this.tabsView.render(stickerPacks);

			this.el.innerHTML = '';
			this.el.classList.add('sticker-pipe');
			this.el.style.width = Module.Configs.width;

			this.scrollView.el.setAttribute('class', 'sp-scroll-content');
			this.scrollView.getOverview().appendChild(this.contentEl);

			this.scrollView.viewportEl.style.height = parseInt(Module.Configs.height, 10) - 49 + 'px';

			this.contentEl.classList.add('sp-content');

			this.el.appendChild(this.tabsView.el);
			this.el.appendChild(this.scrollView.el);

			this.isRendered = true;

			this.tabsView.onWindowResize();
			this.onWindowResize();
		},
		renderUsedStickers: function() {

			var usedStickers = Module.Storage.getUsedStickers();

			this.contentEl.innerHTML = '';

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.remove('sp-emojis');

			if (usedStickers.length == 0) {
				this.contentEl.innerHTML += Module.Configs.htmlForEmptyRecent;
				this.scrollView.update();
				return false;
			}

			var stickers = [];
			Module.Service.Helper.forEach(usedStickers, function(sticker) {
				stickers.push(sticker.code);
			});

			this.renderStickers(stickers);
		},
		renderEmojiBlock: function() {

			this.contentEl.innerHTML = '';

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.add('sp-emojis');

			this.emojisOffset = 0;
			this.renderEmojis(this.emojisOffset);

			this.scrollView.update();
		},
		renderPack: function(pack) {

			this.contentEl.innerHTML = '';

			var stickers = [];
			Module.Service.Helper.forEach(pack.stickers, function(sticker) {
				stickers.push(pack.pack_name + '_' + sticker.name);
			});

			this.renderStickers(stickers);
		},
		renderStickers: function(stickers) {
			var self = this;

			this.contentEl.classList.remove('sp-emojis');
			this.contentEl.classList.add('sp-stickers');

			Module.Service.Helper.forEach(stickers, function(stickerCode) {

				var placeHolderClass = 'sp-sticker-placeholder';

				var stickerImgSrc = Module.BaseService.parseStickerFromText('[[' + stickerCode + ']]');

				var stickersSpanEl = document.createElement('span');
				stickersSpanEl.classList.add(placeHolderClass);

				var image = new Image();
				image.onload = function() {
					stickersSpanEl.classList.remove(placeHolderClass);
					stickersSpanEl.classList.add(Module.Configs.stickerItemClass);
					stickersSpanEl.setAttribute('data-sticker-string', stickerCode);
					stickersSpanEl.appendChild(image);

					self.scrollView.update('relative');
				};
				image.onerror = function() {};

				image.src = stickerImgSrc.url;

				self.contentEl.appendChild(stickersSpanEl);
			});

			self.scrollView.update();
		},
		renderEmojis: function(offset) {

			if (offset > Module.Configs.emojiList.length - 1) {
				return;
			}

			var limit = offset + this.emojisLimit;
			if (limit > Module.Configs.emojiList.length - 1) {
				limit = Module.Configs.emojiList.length;
			}

			for (var i = offset; i < limit; i++) {
				var emoji = Module.Configs.emojiList[i],
					emojiEl = document.createElement('span'),
					emojiImgHtml = this.emojiService.parseEmojiFromText(emoji);

				emojiEl.className = Module.Configs.emojiItemClass;
				emojiEl.innerHTML = emojiImgHtml;

				this.contentEl.appendChild(emojiEl);
			}

			this.emojisOffset = limit;

			this.scrollView.update('relative');
		},


		handleClickOnSticker: function(callback) {
			// todo: create static Module.Configs.stickerItemClass
			Module.Service.Helper.setEvent('click', this.contentEl, Module.Configs.stickerItemClass, callback);
		},
		handleClickOnEmoji: function(callback) {
			// todo: create static Module.Configs.emojiItemClass
			Module.Service.Helper.setEvent('click', this.contentEl, Module.Configs.emojiItemClass, callback);
		},

		open: function(tabName) {
			tabName = tabName || null;

			if (tabName) {
				this.tabsView.activeTab(tabName);
			}

			if (!this.tabsView.hasActiveTab) {
				this.tabsView.activeLastUsedStickersTab();
			}
		},
		close: function() {},


		onWindowResize: function() {}
	});

})(window.StickersModule);

(function(Module) {

	// todo: + bind & unbind methods for events (error on ESC two modals)

	var modalsStack = [],
		KEY_CODE_A = 65,
		KEY_CODE_TAB = 9,
		KEY_CODE_ESC = 27,

		oMargin = {},
		ieBodyTopMargin = 0,
		pluginNamespace = 'sp-modal',

		classes = {
			lock: 'sp-modal-lock',
			overlay: 'sp-modal-overlay',
			modal: 'sp-modal',
			modalDialog: 'sp-modal-dialog',
			dialogHeader: 'sp-modal-header',
			dialogBody: 'sp-modal-body',
			back: 'sp-modal-back',
			close: 'sp-modal-close'
		},

		defaultOptions = {
			closeOnEsc: true,
			closeOnOverlayClick: true,

			onBeforeClose: null,
			onClose: null,
			onOpen: null
		},

		isOpen = false,

		overlay = null;

	// todo: extend --> HelperModule
	function extend(out) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i])
				continue;

			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key))
					out[key] = arguments[i][key];
			}
		}

		return out;
	}

	function lockContainer() {
		if (overlay) {
			return;
		}

		overlay = document.createElement('div');
		overlay.className = classes.overlay;

		document.body.insertBefore(overlay, document.body.firstChild);

		var bodyOuterWidth = Module.El.outerWidth(document.body);
		document.body.classList.add(classes.lock);
		document.getElementsByTagName('html')[0].classList.add(classes.lock);

		var scrollbarWidth = Module.El.outerWidth(document.body) - bodyOuterWidth;

		if (Module.Service.Helper.isIE()) {
			ieBodyTopMargin = Module.El.css(document.body, 'marginTop');
			document.body.style.marginTop = 0;
		}

		if (scrollbarWidth != 0) {
			var tags = ['html', 'body'];
			for (var i = 0 ; i < tags.length; i++) {
				var tag = tags[i],
					tagEl = document.getElementsByTagName(tag)[0];

				oMargin[tag.toLowerCase()] = parseInt(Module.El.css(tagEl, 'marginRight'));
			}

			document.getElementsByTagName('html')[0].style.marginRight = oMargin['html'] + scrollbarWidth + 'px';

			overlay.style.left = 0 - scrollbarWidth + 'px';
		}
	}

	function unlockContainer() {
		overlay.parentNode.removeChild(overlay);
		overlay = null;

		if (Module.Service.Helper.isIE()) {
			document.body.style.marginTop = ieBodyTopMargin + 'px';
		}

		var bodyOuterWidth = Module.El.outerWidth(document.body);
		document.body.classList.remove(classes.lock);
		document.getElementsByTagName('html')[0].classList.remove(classes.lock);
		var scrollbarWidth = Module.El.outerWidth(document.body) - bodyOuterWidth;

		if (scrollbarWidth != 0) {
			var tags = ['html', 'body'];
			for (var i = 0 ; i < tags.length; i++) {
				var tag = tags[i],
					tagEl = document.getElementsByTagName(tag)[0];

				tagEl.style.marginRight = oMargin[tag.toLowerCase()] + 'px';
			}
		}
	}

	function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}


	Module.View = Module.View || {};

	Module.View.Modal = {

		init: function(contentEl, options) {

			options = extend({}, defaultOptions, (options || {}));

			var modalInstance = {};


			// ****************************************************************************

			// MODAL
			var modalEl = document.createElement('div');
			modalEl.style.display = 'none';
			modalEl.className = classes.modal;


			// DIALOG
			var dialogEl = document.createElement('div');
			dialogEl.className = classes.modalDialog;


			// HEADER
			var dialogHeader = document.createElement('div');
			dialogHeader.className = classes.dialogHeader;


			// BODY
			var dialogBody = document.createElement('div');
			dialogBody.className = classes.dialogBody;


			modalEl.appendChild(dialogEl);

			dialogEl.appendChild(dialogBody);
			dialogEl.appendChild(dialogHeader);

			var backButton = document.createElement('div');
			backButton.className = classes.back;
			backButton.innerHTML = '<div class="sp-icon-back"></div>';
			modalInstance.backButton = backButton;

			var closeButton = document.createElement('div');
			closeButton.className = classes.close;
			closeButton.innerHTML = '<div class="sp-icon-close"></div>';
			closeButton.addEventListener('click', (function() {
				this.close();
			}).bind(modalInstance));

			dialogHeader.appendChild(backButton);
			dialogHeader.appendChild(closeButton);

			modalInstance.modalEl = modalEl;

			// ****************************************************************************

			if (!contentEl || !contentEl.nodeType) {

				try {
					contentEl = document.querySelector(contentEl);
				} catch (e) {}

				if (!contentEl) {
					contentEl = document.createElement('div');
				}
			}

			dialogBody.appendChild(contentEl);

			document.body.appendChild(modalInstance.modalEl);

			// on Ctrl+A click fire `onSelectAll` event
			window.addEventListener('keydown', function(e) {
				// todo
				//if (!(e.ctrlKey && e.keyCode == KEY_CODE_A)) {
				//	return true;
				//}
				//
				//if ( $('input:focus, textarea:focus').length > 0 ) {
				//    return true;
				//}
				//
				//var selectAllEvent = new $.Event('onSelectAll');
				//selectAllEvent.parentEvent = e;
				//$(window).trigger(selectAllEvent);
				//return true;
			});

			// todo line 6
			//els.bind('keydown',function(e) {
			//	var modalFocusableElements = $(':focusable',$(this));
			//	if(modalFocusableElements.filter(':last').is(':focus') && (e.which || e.keyCode) == KEY_CODE_TAB){
			//		e.preventDefault();
			//		modalFocusableElements.filter(':first').focus();
			//	}
			//});

			return extend(modalInstance, {

				options: options,
				contentEl: contentEl,

				open: function() {

					if (modalsStack.length) {
						modalsStack[modalsStack.length - 1].modalEl.style.display = 'none';
					}

					modalsStack.push(this);

					// todo: close modal if opened
					//if (document.getElementsByClassName(classes.overlay).length) {
					//	this.close();
					//}

					lockContainer();


					//overlay.appendChild(this.modalEl); // openedModalElement
					insertAfter(this.modalEl, overlay);

					this.modalEl.style.display = 'block';

					if (this.options.closeOnEsc) {
						window.addEventListener('keyup', (function(e) {
							if(e.keyCode === KEY_CODE_ESC && isOpen) {
								this.close(this.options);
							}
						}).bind(this));

						// if iframe
						if (this.contentEl && this.contentEl.contentWindow) {
							this.contentEl.contentWindow.addEventListener('keyup', (function(e) {
								if(e.keyCode === KEY_CODE_ESC && isOpen) {
									this.close(this.options);
								}
							}).bind(this));
						}
					}

					if (this.options.closeOnOverlayClick) {
						for (var i = overlay.children.length; i--;) {
							if (overlay.children[i].nodeType != 8) {
								overlay.children[i].addEventListener('click', function(e) {
									e.stopPropagation();
								});
							}
						}

						document.getElementsByClassName(classes.overlay)[0]
							.addEventListener('click', (function() {
								this.close(this.options);
							}).bind(this));
					}

					//document.addEventListener('touchmove', (function(e) {
					//	//helper function (see below)
					//	function collectionHas(a, b) {
					//		for(var i = 0, len = a.length; i < len; i ++) {
					//			if(a[i] == b) return true;
					//		}
					//		return false;
					//	}
					//
					//	function findParentBySelector(elm, selector) {
					//		var all = document.querySelectorAll(selector),
					//			cur = elm.parentNode;
					//
					//		//keep going up until you find a match
					//		while (cur && !collectionHas(all, cur)) {
					//			cur = cur.parentNode; //go up
					//		}
					//
					//		//will return null if not found
					//		return cur;
					//	}
					//
					//	var selector = '.' + classes.overlay;
					//	var parent = findParentBySelector(e.target, selector);
					//
					//	if(!parent) {
					//		e.preventDefault();
					//	}
					//}).bind(this));

					//document.addEventListener('touchmove', (function(e) {
					//	e.preventDefault();
					//}).bind(this));

					document.addEventListener('touchmove', function(e) {

						//var q = Module.El.getParents(e.target, '.' + classes.overlay);
						//if (!q.length) {
						//	e.preventDefault();
						//}

						//if(!$(e).parents('.' + localOptions.overlayClass)) {
						//	e.preventDefault();
						//}
					});

					window.addEventListener('onSelectAll',function(e) {
						//e.parentEvent.preventDefault();

						// todo
						//var range = null,
						//	selection = null,
						//	selectionElement = openedModalElement.get(0);
						//
						//if (document.body.createTextRange) { //ms
						//	range = document.body.createTextRange();
						//	range.moveToElementText(selectionElement);
						//	range.select();
						//} else if (window.getSelection) { //all others
						//	selection = window.getSelection();
						//	range = document.createRange();
						//	range.selectNodeContents(selectionElement);
						//	selection.removeAllRanges();
						//	selection.addRange(range);
						//}
					});

					if (this.options.onOpen) {
						this.options.onOpen(this.contentEl, this.modalEl, overlay, this.options);
					}

					isOpen = true;
				},

				close: function() {

					// todo
					//if ($.isFunction(this.options.onBeforeClose)) {
					//	if (this.options.onBeforeClose(overlay, this.options) === false) {
					//		return;
					//	}
					//}

					// todo
					//if (!this.options.cloning) {
					//	if (!modalEl) {
					//		modalEl = overlay.data(pluginNamespace+'.modalEl');
					//	}
					//	$(modalEl).hide().appendTo($(modalEl).data(pluginNamespace+'.parent'));
					//}

					if (this.options.onClose) {
						this.options.onClose(this.contentEl, this.modalEl, overlay, this.options);
					}

					document.body.removeChild(this.modalEl);
					modalsStack.pop();

					if (!modalsStack.length) {
						unlockContainer();
					} else {
						modalsStack[modalsStack.length - 1].modalEl.style.display = 'block';
					}

					isOpen = false;
				}
			});
		},

		setDefaultOptions: function(options) {
			defaultOptions = extend({}, defaultOptions, options);
		}
	};

})(window.StickersModule);

(function(Module) {

	var parent = Module.BlockView;

	Module.PopoverView = parent.extend({

		popoverEl: null,
		triangleEl: null,
		toggleEl: null,

		active: false,

		_constructor: function() {
			parent.prototype._constructor.apply(this, arguments);

			this.toggleEl = document.getElementById(Module.Configs.elId);
			this.toggleEl.addEventListener('click', (function() {
				this.toggle();
			}).bind(this));

			this.popoverEl = document.createElement('div');
			this.popoverEl.classList.add('sp-popover');

			this.el = document.createElement('div');

			this.triangleEl = document.createElement('div');
			this.triangleEl.className = 'sp-arrow';

			this.popoverEl.appendChild(this.el);
			this.popoverEl.appendChild(this.triangleEl);

			this.handleClickOnSticker((function() {
				this.toggle();
			}).bind(this));

			document.getElementsByTagName('body')[0].addEventListener('click', (function(e) {
				function isDescendant(parent, child) {
					var node = child.parentNode;
					while (node != null) {
						if (node == parent) {
							return true;
						}
						node = node.parentNode;
					}
					return false;
				}

				if (!this.active) {
					return;
				}

				if (!isDescendant(this.popoverEl, e.target) && !isDescendant(this.toggleEl.parentElement, e.target)) {
					this.toggle();
				}
			}).bind(this));

			// todo: addEventListener --> DOMEventService
			if (window.addEventListener) {
				window.addEventListener(Module.DOMEventService.events.popoverShown, function() {
					Module.DOMEventService.resize();
				});
			} else {
				window.attachEvent('on' + Module.DOMEventService.events.popoverShown, function() {
					Module.DOMEventService.resize();
				});
			}
		},

		toggle: function() {
			if (!this.active) {
				this.open();
			} else {
				this.close();
			}
		},

		open: function() {
			if (!this.active) {

				this.active = true;

				this.toggleEl.parentElement.appendChild(this.popoverEl);
				this.positioned();
				Module.DOMEventService.popoverShown();
			}

			parent.prototype.open.apply(this, arguments);
		},

		close: function() {
			this.active = false;
			this.toggleEl.parentElement.removeChild(this.popoverEl);
			Module.DOMEventService.popoverHidden();
			// todo
			this.popoverEl.style.marginTop = 0;
		},

		positioned: function() {
			var arrowOffset = 0;

			// todo: check
			if (this.triangleEl) {
				var style = this.toggleEl.currentStyle || window.getComputedStyle(this.toggleEl);
				var marginLeft = parseInt(style.marginLeft, 10);

				this.popoverEl.style.marginLeft = marginLeft + 'px';

				//if (this.popoverEl.getBoundingClientRect().left + this.popoverEl.offsetWidth > window.innerWidth) {
				//	this.popoverEl.style.marginLeft = marginLeft - (this.popoverEl.offsetWidth / 2) + (this.toggleEl.clientWidth / 2) + 'px';
				//}

				this.triangleEl.style.marginLeft = this.toggleEl.getBoundingClientRect().left
					- this.popoverEl.getBoundingClientRect().left
					+ (this.toggleEl.clientWidth / 2) - (this.triangleEl.offsetWidth / 2)
					+ 'px';

				var arrowStyle = this.triangleEl.currentStyle || window.getComputedStyle(this.triangleEl);
				if (arrowStyle.display != 'none') {
					arrowOffset = 15;
				}

				var elOffset = this.toggleEl.getBoundingClientRect().top + this.toggleEl.offsetHeight - this.popoverEl.getBoundingClientRect().top;

				// todo 5px remove
				this.popoverEl.style.marginTop = -(this.popoverEl.offsetHeight + this.toggleEl.offsetHeight + arrowOffset - elOffset + 5) + 'px';
			} else {
				console && console.error('error: triangle not found');
			}
		}

	});

})(window.StickersModule);

(function(Module) {

	Module.ScrollView = Module.Class({

		el: null,

		scrollbarEl: null,
		trackEl: null,
		thumbEl: null,
		viewportEl: null,
		overviewEl: null,

		scrollbar: null,

		_constructor: function() {
			this.el = document.createElement('div');
			this.scrollbarEl = document.createElement('div');
			this.trackEl = document.createElement('div');
			this.thumbEl = document.createElement('div');
			this.viewportEl = document.createElement('div');
			this.overviewEl = document.createElement('div');

			this.scrollbarEl.className = 'scrollbar';
			this.trackEl.className = 'track';
			this.thumbEl.className = 'thumb';
			this.viewportEl.className = 'viewport';
			this.overviewEl.className = 'overview';

			this.trackEl.appendChild(this.thumbEl);
			this.scrollbarEl.appendChild(this.trackEl);

			this.viewportEl.appendChild(this.overviewEl);

			this.el.appendChild(this.scrollbarEl);
			this.el.appendChild(this.viewportEl);

			this.scrollbar = Module.Tinyscrollbar(this.el);

			window.addEventListener('resize', (function() {
				this.update();
			}).bind(this));
		},

		getOverview: function() {
			return this.overviewEl;
		},

		update: function(scrollTo) {
			this.scrollbar.update(scrollTo);
		},

		onScroll: function(callback) {
			this.el.addEventListener('move', (function() {
				callback && callback();
			}).bind(this));
		},

		isAtBegin: function() {
			return !this.scrollbar._isAtBegin();
		},

		isAtEnd: function() {
			return !this.scrollbar._isAtEnd();
		}
	});

})(window.StickersModule);

(function(Module) {


	var hasMessageListener = false;

	function setWindowMessageListener() {
		if (!hasMessageListener) {
			window.addEventListener('message', (function(e) {
				var data = JSON.parse(e.data);

				if (!data.action) {
					return;
				}

				var StoreService = Module.Service.Store;
				StoreService.api[data.action] && StoreService.api[data.action](data);

			}).bind(this));

			hasMessageListener = true;
		}
	}

	Module.StoreView = Module.Class({

		modal: null,
		iframe: null,
		overlay: null,

		_constructor: function() {

			this.iframe = document.createElement('iframe');

			this.iframe.style.width = '100%';
			this.iframe.style.height = '100%';
			this.iframe.style.border = '0';

			this.modal = Module.View.Modal.init(this.iframe, {
				onOpen: (function(contentEl, modalEl, overlay) {
					this.overlay = overlay;
					Module.DOMEventService.resize();
					setWindowMessageListener.bind(this)();

					if (Module.Service.Helper.getMobileOS() == 'ios') {
						modalEl.getElementsByClassName('sp-modal-body')[0].style.overflowY = 'scroll';
					}
				}).bind(this)
			});

			this.modal.backButton.addEventListener('click', (function() {
				Module.Service.Store.goBack();
			}).bind(this));


			window.addEventListener('resize', (function() {
				this.resize();
			}).bind(this));
		},

		renderStore: function() {
			this.iframe.src = Module.Url.getStoreUrl();
			this.modal.open();
		},

		renderPack: function(packName) {
			this.iframe.src = Module.Url.getStorePackUrl(packName);
			this.modal.open();
		},

		close: function() {
			this.modal.close();
		},

		resize: function(height) {
			var dialog = this.modal.modalEl.getElementsByClassName('sp-modal-dialog')[0];
			dialog.style.height = '';

			if (window.innerWidth > 700) {

				var marginTop = parseInt(Module.El.css(dialog, 'marginTop'), 10),
					marginBottom = parseInt(Module.El.css(dialog, 'marginBottom'), 10);

				var minHeight = window.innerHeight - marginTop - marginBottom;

				dialog.style.height = minHeight + 'px';
			}
		}
	});

})(window.StickersModule);

(function(Module) {


	Module.TabsView = Module.Class({

		el: null,
		scrollableContainerEl: null,
		scrollableContentEl: null,

		controls: null,
		packTabs: {},
		packTabsIndexes: {},

		hasActiveTab: false,

		classes: {
			scrollableContainer: 'sp-tabs-scrollable-container',
			scrollableContent: 'sp-tabs-scrollable-content',
			controlTab: 'sp-control-tab',
			controlButton: 'sp-control-button',
			newPack: 'sp-new-pack',
			packTab: 'sp-pack-tab',
			tabActive: 'sp-tab-active',
			tabs: 'sp-tabs'
		},

		_constructor: function() {

			this.el = document.createElement('div');

			this.controls = {
				emoji: {
					id: 'spTabEmoji',
					class: 'sp-tab-emoji',
					icon: 'sp-icon-face',
					el: null,
					isTab: true
				},
				history: {
					id: 'spTabHistory',
					class: 'sp-tab-history',
					icon: 'sp-icon-clock',
					el: null,
					isTab: true
				},
				settings: {
					id: 'spTabSettings',
					class: 'sp-tab-settings',
					icon: 'sp-icon-settings',
					el: null,
					isTab: false
				},
				store: {
					id: 'spTabStore',
					class: 'sp-tab-store',
					icon: 'sp-icon-plus',
					el: null,
					isTab: false
				},
				prevPacks: {
					id: 'spTabPrevPacks',
					class: 'sp-tab-prev-packs',
					icon: 'sp-icon-arrow-back',
					el: null,
					isTab: false
				},
				nextPacks: {
					id: 'spTabNextPacks',
					class: 'sp-tab-next-packs',
					icon: 'sp-icon-arrow-forward',
					el: null,
					isTab: false
				}
			};

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},


		render: function(stickerPacks) {

			this.el.classList.add(this.classes.tabs);
			this.el.innerHTML = '';

			this.renderPrevPacksTab();

			this.renderScrollableContainer();

			this.renderPacks(stickerPacks);

			this.renderNextPacksTab();

			this.renderStoreTab();
		},
		renderScrollableContainer: function() {

			this.scrollableContentEl = document.createElement('div');
			this.scrollableContentEl.className = this.classes.scrollableContent;

			this.scrollableContainerEl = document.createElement('div');
			this.scrollableContainerEl.className = this.classes.scrollableContainer;

			this.scrollableContainerEl.appendChild(this.scrollableContentEl);
			this.el.appendChild(this.scrollableContainerEl);
		},
		renderControlButton: function(controlButton) {
			controlButton.isTab = controlButton.isTab || false;

			var classes = [controlButton.class];
			classes.push((controlButton.isTab) ? this.classes.controlTab : this.classes.controlButton);

			var content = '<span class="' + controlButton.icon + '"></span>';

			controlButton.el = this.renderTab(controlButton.id, classes, content);
			return controlButton.el;
		},
		renderPackTab: function(pack) {
			var classes = [this.classes.packTab];

			if(pack.newPack) {
				classes.push(this.classes.newPack);
			}

			var iconSrc = Module.Url.getPackTabIconUrl(pack.pack_name);

			var content = '<img src=' + iconSrc + '>';

			var tabEl = this.renderTab(null, classes, content, {
				'data-pack-name': pack.pack_name
			});

			tabEl.addEventListener('click', (function() {
				tabEl.classList.remove(this.classes.newPack);
			}).bind(this));

			this.packTabs[pack.pack_name] = tabEl;

			return tabEl;
		},
		renderTab: function(id, classes, content, attrs) {
			classes = classes || [];
			attrs = attrs || {};

			var tabEl = document.createElement('span');

			if (id) {
				tabEl.id = id;
			}

			classes.push(Module.Configs.tabItemClass);

			tabEl.classList.add.apply(tabEl.classList, classes);

			Module.Service.Helper.forEach(attrs, function(value, name) {
				tabEl.setAttribute(name, value);
			});

			tabEl.innerHTML = content;

			tabEl.addEventListener('click', (function() {
				if (!tabEl.classList.contains(this.classes.controlTab) &&
					!tabEl.classList.contains(this.classes.packTab)) {
					return;
				}

				Module.Service.Helper.forEach(this.packTabs, (function(tabEl) {
					tabEl.classList.remove(this.classes.tabActive);
				}).bind(this));

				Module.Service.Helper.forEach(this.controls, (function(controlTab) {
					if (controlTab && controlTab.el) {
						controlTab.el.classList.remove(this.classes.tabActive);
					}
				}).bind(this));

				tabEl.classList.add(this.classes.tabActive);
			}).bind(this));

			return tabEl;
		},


		renderPacks: function(stickerPacks) {
			this.scrollableContentEl.innerHTML = '';

			this.renderEmojiTab();
			this.renderHistoryTab();

			for (var i = 0; i < stickerPacks.length; i++) {
				var pack = stickerPacks[i];
				this.scrollableContentEl.appendChild(this.renderPackTab(pack));
				this.packTabsIndexes[pack.pack_name] = i;
			}

			this.renderSettingsTab();
		},
		renderEmojiTab: function() {
			if (Module.Configs.enableEmojiTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.emoji));
			}
		},
		renderHistoryTab: function() {
			if (Module.Configs.enableHistoryTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.history));
			}
		},
		renderSettingsTab: function() {
			if (Module.Configs.enableSettingsTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.settings));
			}
		},
		renderStoreTab: function() {
			if (Module.Configs.enableStoreTab) {
				this.el.appendChild(this.renderControlButton(this.controls.store));
			}
		},
		renderPrevPacksTab: function() {
			this.el.appendChild(this.renderControlButton(this.controls.prevPacks));
			Module.Service.Helper.setEvent('click', this.el, this.controls.prevPacks.class, this.onClickPrevPacksButton.bind(this));
		},
		renderNextPacksTab: function() {
			this.el.appendChild(this.renderControlButton(this.controls.nextPacks));
			Module.Service.Helper.setEvent('click', this.el, this.controls.nextPacks.class, this.onClickNextPacksButton.bind(this));
		},


		onClickPrevPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName(this.classes.packTab)[0].offsetWidth;
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = contentOffset + (tabWidth * countFullShownTabs);
			offset = (offset > 0) ? 0 : offset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},
		onClickNextPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName(this.classes.packTab)[0].offsetWidth;
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = -(tabWidth * countFullShownTabs) + contentOffset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},


		activeTab: function(tabName) {
			var i = this.packTabsIndexes[tabName];

			if (Module.Configs.enableEmojiTab) {
				i++;
			}
			if (Module.Configs.enableHistoryTab) {
				i++;
			}

			this.packTabs[tabName].click();
			this.hasActiveTab = true;

			var tabWidth = this.scrollableContentEl.getElementsByClassName(this.classes.packTab)[0].offsetWidth;
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = -(parseInt((i / countFullShownTabs), 10) * containerWidth);
			offset = (offset > 0) ? 0 : offset - 1;
			this.scrollableContentEl.style.left = offset + 'px';

			this.onWindowResize();
		},
		activeLastUsedStickersTab: function() {
			this.controls.history.el.click();
			this.hasActiveTab = true;
		},


		handleClickOnEmojiTab: function(callback) {
			Module.Service.Helper.setEvent('click', this.el, this.controls.emoji.class, callback);
		},
		handleClickOnLastUsedPacksTab: function(callback) {
			Module.Service.Helper.setEvent('click', this.el, this.controls.history.class, callback);
		},
		handleClickOnPackTab: function(callback) {
			Module.Service.Helper.setEvent('click', this.el, this.classes.packTab, callback);
		},
		handleClickOnStoreTab: function(callback) {
			Module.Service.Helper.setEvent('click', this.el, this.controls.store.class, callback);
		},


		onWindowResize: function() {

			if (!this.el.parentElement) {
				return;
			}

			if (this.controls.prevPacks.el) {
				if (parseInt(this.scrollableContentEl.style.left, 10) < 0) {
					this.controls.prevPacks.el.style.display = 'block';
				} else {
					this.controls.prevPacks.el.style.display = 'none';
				}
			}


			if (this.controls.nextPacks.el) {
				var contentWidth = this.scrollableContentEl.scrollWidth;
				var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;

				if (contentWidth + contentOffset > this.scrollableContainerEl.offsetWidth) {
					this.controls.nextPacks.el.style.display = 'block';
				} else {
					this.controls.nextPacks.el.style.display = 'none';
				}
			}
		}
	});

})(window.StickersModule);

(function(Plugin, Module) {

	// todo: rename Stickers --> StickerPipe
	Plugin.Stickers = Module.Class({

		emojiService: null,
		stickersModel: {},
		view: null,
		storeView: null,

		_constructor: function(config) {

			var mobileOS = Module.Service.Helper.getMobileOS();
			if (mobileOS == 'ios' || mobileOS == 'android') {
				config.enableEmojiTab = false;
			}

			Module.Service.Helper.setConfig(config);

			if (Module.Configs.userId) {
				Module.Configs.userId = Module.Service.Helper.md5(Module.Configs.userId + Module.Configs.apiKey);
			}

			Module.Storage.setPrefix(Module.Configs.storagePrefix);

			Module.BaseService.trackUserData();

			Module.Service.Store.init(this);
			Module.Service.Pack.init(this);

			this.emojiService = new Module.EmojiService(Module.Twemoji);

			Module.Service.PendingRequest.run();
		},

		////////////////////
		//   Functions
		////////////////////

		render: function(onload, elId) {
			Module.Configs.elId = elId || Module.Configs.elId;

			this.view = new Module.PopoverView(this.emojiService);
			this.storeView = new Module.StoreView();

			this.delegateEvents();

			// todo
			//// ***** START *******************************************************************************************

			var callback = onload || null;

			this.fetchPacks((function() {
				this.view.render(this.stickersModel);

				callback && callback();
			}).bind(this));

			setInterval((function() {
				this.fetchPacks();
			}).bind(this), 1000 * 60 * 60); // hour
		},

		delegateEvents: function() {

			this.view.tabsView.handleClickOnEmojiTab((function() {
				this.view.renderEmojiBlock();
			}).bind(this));

			this.view.tabsView.handleClickOnLastUsedPacksTab((function() {
				this.view.renderUsedStickers();
			}).bind(this));

			this.view.tabsView.handleClickOnStoreTab((function() {
				this.storeView.renderStore();
			}).bind(this));

			this.view.tabsView.handleClickOnPackTab((function(el) {
				var pack = null,
					packName = el.getAttribute('data-pack-name');

				// todo rename
				var changed = false,
					hasNewContent = false;

				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].pack_name == packName) {

						// set newPack - false
						changed = true;
						this.stickersModel[i].newPack = false;
						Module.Storage.setPacks(this.stickersModel);

						pack = this.stickersModel[i];
					}

					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
					}
				}

				if (changed == true && Module.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Module.DOMEventService.changeContentHighlight(false);
				}

				pack && this.view.renderPack(pack);
			}).bind(this));

			this.view.handleClickOnSticker((function(el) {

				var stickerAttribute = el.getAttribute('data-sticker-string'),
					nowDate = new Date().getTime() / 1000|0;

				Module.Api.sendStatistic([{
					action: 'use',
					category: 'sticker',
					label: '[[' + stickerAttribute + ']]',
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split('_')[0], stickerAttribute.split('_')[1], 1);

				Module.Storage.addUsedSticker(stickerAttribute);

				// todo: rewrite
				// new content mark

				var hasNewContent = false;
				for (var i = 0; i < this.stickersModel.length; i++) {
					if (this.stickersModel[i].newPack == true) {
						hasNewContent = true;
						break;
					}
				}

				if (Module.Storage.getUsedStickers().length != 0 && hasNewContent == false) {
					Module.DOMEventService.changeContentHighlight(false);
				}
			}).bind(this));

			this.view.handleClickOnEmoji((function(el) {
				var nowDate = new Date().getTime() / 1000| 0,
					emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				Module.Api.sendStatistic([{
					action: 'use',
					category: 'emoji',
					label: emoji,
					time: nowDate
				}]);

				ga('stickerTracker.send', 'event', 'emoji', 'use', emoji);
			}).bind(this));
		},

		fetchPacks: function(callback) {
			Module.BaseService.updatePacks((function(stickerPacks) {
				this.stickersModel = stickerPacks;

				if (this.view.isRendered) {
					this.view.tabsView.renderPacks(this.stickersModel);
				}

				callback && callback.apply();
			}).bind(this));
		},

		parseStickerFromText: function(text) {
			return Module.BaseService.parseStickerFromText(text);
		},

		parseEmojiFromText: function(text) {
			return this.emojiService.parseEmojiFromText(text);
		},

		parseEmojiFromHtml: function(html) {
			return this.emojiService.parseEmojiFromHtml(html);
		},

		onUserMessageSent: function(isSticker) {
			return Module.BaseService.onUserMessageSent(isSticker);
		},

		purchaseSuccess: function(packName, pricePoint) {
			Module.Service.Store.purchaseSuccess(packName, pricePoint);
		},

		purchaseFail: function() {
			Module.Service.Store.purchaseFail();
		},

		open: function(tabName) {
			this.view.open(tabName);
		},

		close: function() {
			this.view.close();
		},

		////////////////////
		//  Callbacks
		////////////////////

		onClickSticker: function(callback, context) {
			this.view.handleClickOnSticker(function(el) {
				callback.call(context, '[[' + el.getAttribute('data-sticker-string') + ']]');
			});
		},

		onClickEmoji: function(callback, context) {
			this.view.handleClickOnEmoji((function(el) {
				var emoji = this.emojiService.parseEmojiFromHtml(el.innerHTML);

				callback.call(context, emoji);
			}).bind(this));
		},

		onPurchase: function(callback) {
			Module.Service.Store.onPurchaseCallback = callback;
		}
	});

})(window, window.StickersModule);
