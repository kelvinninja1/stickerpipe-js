
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