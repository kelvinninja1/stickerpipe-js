
var appStickerPipeStore = angular.module('appStickerPipeStore', [
	'ngRoute',
	'partials',
	'environment'
]);

appStickerPipeStore.run(function($rootScope, PlatformAPI, JsInterface, Config) {

	Config.primaryColor = Config.primaryColor || '9c27b0';
	Config.primaryColor = '#' + Config.primaryColor;

	PlatformAPI.init();
	JsInterface.init();

	$rootScope.$on('$routeChangeStart', function() {
		PlatformAPI.showPagePreloader(true);
		PlatformAPI.showBackButton(false);
	});

	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.error = false;
	});

	$rootScope.$on('$routeChangeError', function() {
		PlatformAPI.showPagePreloader(false);
		$rootScope.error = true;
	});

});

appStickerPipeStore.controller('AppController', function(Config, envService, Helper, Css) {

	document.body.addEventListener('touchstart',function() {},false);

	switch (Config.style.toLowerCase()) {
		case 'android':
		case 'js':
			Css.createAndroidPrimaryButton();
			break;
		case 'ios':
			Css.createIOSPrimaryButton();
			break;
		default:
			break;
	}
});
angular.module('environment',[]).provider('envService',function(){this.environment='development';this.data={};this.config=function(config){this.data=config;};this.set=function(environment){this.environment=environment;};this.get=function(){return this.environment;};this.read=function(variable){if(variable!=='all'){return this.data.vars[this.get()][variable];}
	return this.data.vars[this.get()];};this.is=function(environment){return(environment===this.environment);};this.check=function(){var	location=window.location.href,self=this;angular.forEach(this.data.domains,function(v,k){angular.forEach(v,function(v){if(location.match('//'+v)){self.environment=k;}});});};this.$get=function(){return this;};});
/*
 AngularJS v1.4.2
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
 */
(function(p,c,C){'use strict';function v(r,h,g){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,f,b,d,y){function z(){k&&(g.cancel(k),k=null);l&&(l.$destroy(),l=null);m&&(k=g.leave(m),k.then(function(){k=null}),m=null)}function x(){var b=r.current&&r.current.locals;if(c.isDefined(b&&b.$template)){var b=a.$new(),d=r.current;m=y(b,function(b){g.enter(b,null,m||f).then(function(){!c.isDefined(t)||t&&!a.$eval(t)||h()});z()});l=d.scope=b;l.$emit("$viewContentLoaded");
	l.$eval(w)}else z()}var l,m,k,t=b.autoscroll,w=b.onload||"";a.$on("$routeChangeSuccess",x);x()}}}function A(c,h,g){return{restrict:"ECA",priority:-400,link:function(a,f){var b=g.current,d=b.locals;f.html(d.$template);var y=c(f.contents());b.controller&&(d.$scope=a,d=h(b.controller,d),b.controllerAs&&(a[b.controllerAs]=d),f.data("$ngControllerController",d),f.children().data("$ngControllerController",d));y(a)}}}p=c.module("ngRoute",["ng"]).provider("$route",function(){function r(a,f){return c.extend(Object.create(a),
	f)}function h(a,c){var b=c.caseInsensitiveMatch,d={originalPath:a,regexp:a},g=d.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,c,b,d){a="?"===d?d:null;d="*"===d?d:null;g.push({name:b,optional:!!a});c=c||"";return""+(a?"":c)+"(?:"+(a?c:"")+(d&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");d.regexp=new RegExp("^"+a+"$",b?"i":"");return d}var g={};this.when=function(a,f){var b=c.copy(f);c.isUndefined(b.reloadOnSearch)&&(b.reloadOnSearch=!0);
	c.isUndefined(b.caseInsensitiveMatch)&&(b.caseInsensitiveMatch=this.caseInsensitiveMatch);g[a]=c.extend(b,a&&h(a,b));if(a){var d="/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";g[d]=c.extend({redirectTo:a},h(d,b))}return this};this.caseInsensitiveMatch=!1;this.otherwise=function(a){"string"===typeof a&&(a={redirectTo:a});this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$templateRequest","$sce",function(a,f,b,d,h,p,x){function l(b){var e=s.current;
	(v=(n=k())&&e&&n.$$route===e.$$route&&c.equals(n.pathParams,e.pathParams)&&!n.reloadOnSearch&&!w)||!e&&!n||a.$broadcast("$routeChangeStart",n,e).defaultPrevented&&b&&b.preventDefault()}function m(){var u=s.current,e=n;if(v)u.params=e.params,c.copy(u.params,b),a.$broadcast("$routeUpdate",u);else if(e||u)w=!1,(s.current=e)&&e.redirectTo&&(c.isString(e.redirectTo)?f.path(t(e.redirectTo,e.params)).search(e.params).replace():f.url(e.redirectTo(e.pathParams,f.path(),f.search())).replace()),d.when(e).then(function(){if(e){var a=
	c.extend({},e.resolve),b,f;c.forEach(a,function(b,e){a[e]=c.isString(b)?h.get(b):h.invoke(b,null,null,e)});c.isDefined(b=e.template)?c.isFunction(b)&&(b=b(e.params)):c.isDefined(f=e.templateUrl)&&(c.isFunction(f)&&(f=f(e.params)),c.isDefined(f)&&(e.loadedTemplateUrl=x.valueOf(f),b=p(f)));c.isDefined(b)&&(a.$template=b);return d.all(a)}}).then(function(f){e==s.current&&(e&&(e.locals=f,c.copy(e.params,b)),a.$broadcast("$routeChangeSuccess",e,u))},function(b){e==s.current&&a.$broadcast("$routeChangeError",
	e,u,b)})}function k(){var a,b;c.forEach(g,function(d,g){var q;if(q=!b){var h=f.path();q=d.keys;var l={};if(d.regexp)if(h=d.regexp.exec(h)){for(var k=1,m=h.length;k<m;++k){var n=q[k-1],p=h[k];n&&p&&(l[n.name]=p)}q=l}else q=null;else q=null;q=a=q}q&&(b=r(d,{params:c.extend({},f.search(),a),pathParams:a}),b.$$route=d)});return b||g[null]&&r(g[null],{params:{},pathParams:{}})}function t(a,b){var d=[];c.forEach((a||"").split(":"),function(a,c){if(0===c)d.push(a);else{var f=a.match(/(\w+)(?:[?*])?(.*)/),
	g=f[1];d.push(b[g]);d.push(f[2]||"");delete b[g]}});return d.join("")}var w=!1,n,v,s={routes:g,reload:function(){w=!0;a.$evalAsync(function(){l();m()})},updateParams:function(a){if(this.current&&this.current.$$route)a=c.extend({},this.current.params,a),f.path(t(this.current.$$route.originalPath,a)),f.search(a);else throw B("norout");}};a.$on("$locationChangeStart",l);a.$on("$locationChangeSuccess",m);return s}]});var B=c.$$minErr("ngRoute");p.provider("$routeParams",function(){this.$get=function(){return{}}});
	p.directive("ngView",v);p.directive("ngView",A);v.$inject=["$route","$anchorScroll","$animate"];A.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map
appStickerPipeStore.config(function(envServiceProvider) {

	// default development(work)

	envServiceProvider.config({
		domains: {
			local: ['localhost', '192.168.56.1'],
			development: ['work.stk.908.vc'],
			production: ['api.stickerpipe.com']
		},

		vars: {
			local: {
				// todo: remove css variable
				cssUrl: 'css/',
				notAvailableImgUrl: 'http://work.stk.908.vc/static/img/notavailable.png',
				apiUrl: 'http://work.stk.908.vc'
			},
			development: {
				cssUrl: 'http://demo.stickerpipe.com/work/libs/store/css/',
				notAvailableImgUrl: 'http://work.stk.908.vc/static/img/notavailable.png',
				apiUrl: 'http://work.stk.908.vc'
			},
			production: {
				cssUrl: 'http://demo.stickerpipe.com/libs/store/current/css/',
				notAvailableImgUrl: 'http://stickerpipe.com/static/img/notavailable.png',
				apiUrl: 'http://api.stickerpipe.com'
			}
		}
	});

	envServiceProvider.check();
});
(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/directives/sp-button/view.tpl',
    '<button data-ng-show="!btnInProgress"\n' +
    '		data-ng-click="btnClick()"\n' +
    '        class="{{ btnClass }}"\n' +
    '        data-ng-transclude>\n' +
    '</button>\n' +
    '\n' +
    '<div data-ng-show="btnInProgress" style="display: inline-table;">\n' +
    '	<div class="progress">\n' +
    '		<div class="bounce1"></div>\n' +
    '		<div class="bounce2"></div>\n' +
    '		<div class="bounce3"></div>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/modules/base-page/view.tpl',
    '<!--<div class="version">0.0.10</div>-->\n' +
    '<div class="store" data-sp-auto-scroll>\n' +
    '	<div data-ng-show="!error && showContent" data-ng-view></div>\n' +
    '	<div data-ng-show="error" data-error></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/modules/pack/PackView.tpl',
    '<div data-ng-show="showPage">\n' +
    '	<div ng-class="{\'screen-header\': isJSPlatform }" data-ng-show="isJSPlatform"></div>\n' +
    '	<div class="pack-header">\n' +
    '\n' +
    '		<div class="pack-info">\n' +
    '			<div class="main-sticker">\n' +
    '				<img data-ng-src="{{ packService.getMainSticker(pack) }}" alt="Main sticker">\n' +
    '			</div>\n' +
    '\n' +
    '			<div class="pack-info-details">\n' +
    '				<div class="pack-title">{{ pack.title }}</div>\n' +
    '				<div class="pack-owner">{{ pack.artist }}</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '\n' +
    '		<div class="clearfix"></div>\n' +
    '\n' +
    '		<div class="pack-controls">\n' +
    '\n' +
    '			<span data-ng-show="packService.isActive(pack)">\n' +
    '				<!-- REMOVE -->\n' +
    '				<button data-ng-show="canRemovePack"\n' +
    '				        class="btn btn-primary"\n' +
    '				        data-ng-click="removePack()"\n' +
    '				>{{ i18n.remove.toUpperCase() }}</button>\n' +
    '\n' +
    '				<!-- OPEN -->\n' +
    '				<div data-sp-button\n' +
    '				     data-ng-show="canShowPack"\n' +
    '				     data-btn-class="btn btn-primary"\n' +
    '				     data-btn-click="showPack()"\n' +
    '				>{{ i18n.sendSticker.toUpperCase() }}</div>\n' +
    '			</span>\n' +
    '\n' +
    '			<!-- DOWNLOAD -->\n' +
    '			<div data-sp-button\n' +
    '			     data-ng-show="packService.isHidden(pack) || (packService.isDisable(pack) && (pack.pricepoint == \'A\') || (packService.isDisable(pack) && pack.pricepoint == \'B\' && isSubscriber))"\n' +
    '			     data-btn-class="btn btn-primary"\n' +
    '			     data-btn-click="purchasePack()"\n' +
    '			     data-btn-in-progress="inProgress"\n' +
    '			>{{ i18n.download.toUpperCase() }}</div>\n' +
    '\n' +
    '			<!-- PURCHASE PriceB -->\n' +
    '			<div data-sp-button\n' +
    '			     data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'B\' && !isSubscriber && priceB"\n' +
    '			     data-btn-class="btn btn-primary"\n' +
    '			     data-btn-click="purchasePack()"\n' +
    '			     data-btn-in-progress="inProgress"\n' +
    '			>{{ priceB }}</div>\n' +
    '\n' +
    '			<!-- PURCHASE PriceC -->\n' +
    '			<div data-sp-button\n' +
    '			     data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'C\' && priceC"\n' +
    '			     data-btn-class="btn btn-primary"\n' +
    '			     data-btn-click="purchasePack()"\n' +
    '			     data-btn-in-progress="inProgress"\n' +
    '			>{{ priceC }}</div>\n' +
    '\n' +
    '		</div>\n' +
    '\n' +
    '		<p class="pack-description" data-ng-show="pack.description">{{ pack.description || \'\' }}</p>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="clearfix"></div>\n' +
    '\n' +
    '	<div class="pack-stickers-preview {{ orientation() }}" data-ng-show="!!getStickersPreview()">\n' +
    '		<div class="pack-stickers-preview-image">\n' +
    '			<img\n' +
    '				 data-ng-src="{{ getStickersPreview() }}"\n' +
    '			     data-sp-load="hidePagePreloader()"\n' +
    '			     alt="" />\n' +
    '		</div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div data-ng-show="!getStickersPreview()">\n' +
    '		<p class="pack-preview-undefined">{{ i18n.previewIsUndefined }}</p>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/modules/store/StoreView.tpl',
    '<div data-ng-class="{\'screen-header\': isJSPlatform }" data-ng-show="isJSPlatform"></div>\n' +
    '<div class="packs">\n' +
    '	<div class="col" data-ng-repeat="pack in packs">\n' +
    '		<div data-pack-preview data-pack="pack"></div>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/modules/base-page/error/view.tpl',
    '<div class="error">\n' +
    '	<div class="error-content">\n' +
    '		<div class="error-image">\n' +
    '			<img ng-src="{{ imgUrl }}" alt="">\n' +
    '		</div>\n' +
    '		<h5>{{ i18n.unavailableContent }}</h5>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/modules/store/pack-preview/view.tpl',
    '<div class="pack-preview center-block">\n' +
    '	<a href="#/packs/{{ pack.pack_name }}">\n' +
    '\n' +
    '		<div data-sp-sticker\n' +
    '		     data-url="{{ getMainStickerUrl() }}"\n' +
    '		     data-complete-class="main-sticker">\n' +
    '		</div>\n' +
    '\n' +
    '		<h5 class="pack-preview-name">{{ getPackTitle(pack) }}</h5>\n' +
    '		<h5 class="pack-preview-price">\n' +
    '			&nbsp;\n' +
    '			<span data-ng-show="packService.isActive(pack)">{{ i18n.free }}</span>\n' +
    '			<span data-ng-show="packService.isHidden(pack)">{{ i18n.free }}</span>\n' +
    '			<span data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'A\'">{{ i18n.free }}</span>\n' +
    '			<span data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'B\' && priceB">{{ priceB }}</span>\n' +
    '			<span data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'C\' && priceC">{{ priceC }}</span>\n' +
    '			&nbsp;\n' +
    '		</h5>\n' +
    '	</a>\n' +
    '</div>');
}]);
})();


appStickerPipeStore.config(function($routeProvider) {

	$routeProvider
		.when('/store', {
			controller: 'StoreController as storeController',
			templateUrl: '/modules/store/StoreView.tpl',
			resolve: {
				packs: function(Api) {
					return Api.getPacks();
				}
			}
		})
		.when('/packs/:packName', {
			controller: 'PackController as packController',
			templateUrl: '/modules/pack/PackView.tpl',
			resolve: {
				pack: function($route, Api) {
					return Api.getPack($route.current.params.packName);
				}
			}
		})
		.otherwise({
			redirectTo:'/store'
		});
});

appStickerPipeStore.directive('spAutoScroll', function ($document, $timeout, $location, $window, $rootScope, PlatformAPI) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {

			$rootScope.showContent = true;
			scope.okSaveScroll = true;
			scope.history = [];

			// --------------------------------------------------------------

			$document.bind('scroll', function () {
				if (scope.okSaveScroll && scope.history.length > 0) {
					scope.history[scope.history.length - 1].y = $window.scrollY;
				}
			});

			$rootScope.$on('sp-auto-scroll:scrollContent', function(e, yPosition) {
				if (scope.okSaveScroll && scope.history.length > 0) {
					scope.history[scope.history.length - 1].y = yPosition;
				}
			});

			// --------------------------------------------------------------

			scope.$on('$locationChangeStart', function () {
				scope.okSaveScroll = false;
				$rootScope.showContent = false;
			});

			// --------------------------------------------------------------

			function onContentLoad() {
				$rootScope.showContent = true;

				$timeout(function() {
					scope.okSaveScroll = true;

					var y = scope.history[scope.history.length - 1].y;

					PlatformAPI.setYScroll(y);
				}, 100);
			}

			$rootScope.$on('$routeChangeSuccess', function() {
				onContentLoad();
			});

			$rootScope.$on('$routeChangeError', function() {
				onContentLoad();
			});

			// --------------------------------------------------------------

			$rootScope.$watch(function () { return $location.path() }, function (newLocation, oldLocation) {

				function forward() {
					scope.history[scope.history.length] = {
						url: newLocation,
						y: 0
					};
				}

				function back() {
					scope.history.splice(scope.history.length - 1, 1);
				}

				if (scope.history.length > 1) {
					if (newLocation == scope.history[scope.history.length - 2].url ||
						newLocation + '/' == scope.history[scope.history.length - 2].url) {
						back();
					} else {
						forward();
					}
				} else {
					forward();
				}
			});
		}
	};
});
appStickerPipeStore.directive('spLoad', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {
			var fn = $parse(attrs.spLoad);
			elem.on('load', function (event) {
				scope.$apply(function() {
					fn(scope, { $event: event });
				});
			});
		}
	};
});
appStickerPipeStore.directive('spSticker', function (Config) {
	return {
		restrict: 'AE',
		template: '',
		scope: {
			url: '@'
		},
		link: function (scope, elem, attrs) {

			elem.addClass('sticker-placeholder');
			elem[0].style.background = Config.primaryColor;

			var image = new Image();
			image.onload = function() {
				elem.removeClass('sticker-placeholder');
				elem[0].style.background = '';
				elem.addClass(attrs.completeClass);

				elem[0].appendChild(image);
			};
			image.onerror = function() {};

			scope.$watch('url', function (value) {
				image.src = value;
			});
		}
	};
});

appStickerPipeStore.value('En', {
	download: 'Download',
	sendSticker: 'Send sticker',
	buyPack: 'Buy pack',
	unavailableContent: 'This content is currently unavailable',
	get: 'Get',
	free: 'Free',
	previewIsUndefined: 'Pack preview is undefined',
	remove: 'Remove'
});

appStickerPipeStore.value('Ru', {
	download: 'Скачать',
	sendSticker: 'Отправить стикер',
	buyPack: 'Купить',
	unavailableContent: 'В данный момент этот контент недоступен',
	get: 'Скачать',
	free: 'Бесплатно',
	previewIsUndefined: 'Превью пака недоступно',
	remove: 'Удалить'
});
appStickerPipeStore.factory('Api', function(Http, EnvConfig, Config) {

    var apiVersion = 2,
        getUrl = function(uri) {
            return EnvConfig.apiUrl + '/api/v' + apiVersion + '/' + uri;
        };


    return {

        getPacks: function() {
			return Http.get(getUrl('shop')).then(function(response) {
				return response.data || response;
			});
        },

		getPack: function(packName) {
			var url = getUrl('packs/' + packName);

			if (Config.isSubscriber) {
				url += '?is_subscriber=1';
			}
			return Http.get(url).then(function(response) {
				return response.data || response;
			});
		}
    };
});

appStickerPipeStore.factory('Css', function(Config) {

	function ColorLuminance(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}

	function hexToRgb(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	function blackOrWhite(hex) {

		var rgb = hexToRgb(hex),

			red = rgb.r,
			green = rgb.g,
			blue = rgb.b;

		var brightness = (red * 299) + (green * 587) + (blue * 114);
		brightness = brightness / 255000;

		// values range from 0 to 1
		// anything greater than 0.5 should be bright enough for dark text
		return (brightness >= 0.7) ? 'black' : 'white';
	}

	function createStyle(stylesString) {
		var style = document.createElement('style');
		style.type = 'text/css';

		style.innerHTML = stylesString;

		document.getElementsByTagName('head')[0].appendChild(style);
	}

	return {
		createAndroidPrimaryButton: function() {

			var colorDefault = Config.primaryColor,
				colorHover = Config.primaryColor,
				colorActive = Config.primaryColor;

			createStyle(
				'.btn-primary, ' +
				'.btn-primary:focus { ' +
					'background: ' + colorDefault + ';' +
					'color: ' + blackOrWhite(colorDefault) + '; ' +
				'}' +
				'.btn-primary:hover { ' +
					'background: ' + colorHover + ';' +
					'color: ' + blackOrWhite(colorHover) + '; ' +
					'opacity: 0.7;' +
				'}' +
				'.btn-primary:active { ' +
					'background: ' + colorActive + ';' +
					'color: ' + blackOrWhite(colorActive) + '; ' +
					'opacity: 0.8;' +
				'}'
			);
		},

		createIOSPrimaryButton: function() {

			var colorDefault = Config.primaryColor,
				colorHover = Config.primaryColor,
				colorActive = Config.primaryColor;

			createStyle(
				'.btn-primary, ' +
				'.btn-primary:focus { ' +
					'background: transparent;' +
					'border-color: ' + colorDefault + ';' +
					'color: ' + colorDefault + ';' +
				'}' +
				'.btn-primary:hover { ' +
					'background: transparent;' +
					'border-color: ' + colorHover + ';' +
					'color: ' + colorHover + ';' +
					'opacity: 0.7;' +
				'}' +
				'.btn-primary:active { ' +
					'background: ' + colorActive + ';' +
					'border-color: ' + colorActive + ';' +
					'color: ' +	blackOrWhite(colorActive) + '; ' +
					'opacity: 1;' +
				'}'
			);
		}
	};
});
appStickerPipeStore.factory('EnvConfig', ['envService', function(envService) {
	return envService.read('all');
}]);
appStickerPipeStore.factory('$exceptionHandler', function ($injector) {

    return function (exception, cause) {
        var $log = $injector.get('$log');

        exception = exception || {};

        exception.message += ' (caused by "' + cause + '")';

        var eMsg = exception.message || '',
            eType = typeof exception,
            eStack = exception.stack || '';


        if (!navigator.userAgent.match('Opera Mini')) {
            //_gaq.push(['_trackEvent', 'JSError: AngularJS', eType + ': ' + eMsg, navigator.userAgent + ' -> ' + window.location.href + ' -:- ' + eStack + " --|-- " + cause]);
        }


        $log.error(exception);
    };
});


appStickerPipeStore.factory('Helper', function(Config) {

	return {
		isAndroid: function() {
			return Config.platform.toLowerCase() == 'android';
		},

		isJS: function() {
			return Config.platform.toLowerCase() == 'js';
		},

		isIOS: function() {
			return Config.platform.toLowerCase() == 'ios';
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

});
appStickerPipeStore.factory('Http', function($http, $q, Config) {

    $http.defaults.headers.post['Accept'] = '*/*';
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    $http.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    $http.defaults.headers.common['Apikey'] = Config.apiKey;
    $http.defaults.headers.common['Platform'] = Config.platform;
    $http.defaults.headers.common['UserId'] = Config.userId;

	return {

		post: function(url, data) {
			var deffered = $q.defer();

			data = Object.keys(data).map(function(k) {
				return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
			}).join('&');

			$http({
				method: 'POST',
				url: url,
				data: data
			}).success(function (response) {
				deffered.resolve(response);
			}).error(function(response, status) {
				deffered.reject(response);
			});

			return deffered.promise;
		},

		put: function(url, data) {
			var deffered = $q.defer();

			data = $.param(data);

			$http({
				method: 'PUT',
				url: url,
				data: data
			}).success(function (response) {
				deffered.resolve(response);
			}).error(function(response, status) {
				deffered.reject(response);
			});

			return deffered.promise;
		},

		get: function(url, dataObj) {
			var deffered = $q.defer();

			dataObj = dataObj || {};

			url += '?';

			angular.forEach(dataObj, function(value, key) {
				url += (key + '=' + value + '&');
			});

			if (url[url.length - 1] === '&' || url[url.length - 1] === '?') {
				url = url.slice(0, -1);
			}

			$http.get(url, {
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).success(function (data) {
				deffered.resolve(data);
			}).error(function(data, status) {
				deffered.reject(data);
			});

			return deffered.promise;
		}
	};

});

appStickerPipeStore.factory('i18n', function(Config, $injector) {

	function ucfirst(str) {
		var f = str.charAt(0).toUpperCase();
		return f + str.substr(1, str.length-1);
	}

	try {
		return $injector.get(ucfirst(Config.lang));
	} catch(e) {
		return $injector.get(ucfirst('en'));
	}

});



appStickerPipeStore.factory('JsInterface', function($rootScope, $route, PlatformAPI) {

	var JsInterface = {
		configure: function() {
			PlatformAPI.configure.apply(PlatformAPI, arguments);
		},

		onPackDownloaded: function(arrts) {
			var packName = (arrts && arrts.packName) || null;

			this.hideActionProgress();
			PlatformAPI.showCollections(packName);
		},

		reload: function() {
			$route.reload();
		},

		showActionProgress: function() {
			$rootScope.$emit('showActionProgress');
		},

		hideActionProgress: function() {
			$rootScope.$emit('hideActionProgress');
		},

		goBack: function() {
			if ($rootScope.goBackUrl) {
				window.location.href = $rootScope.goBackUrl;
			}
		},

		onScrollContent: function(attrs) {
			$rootScope.$emit('sp-auto-scroll:scrollContent', attrs.yPosition);
		}
	};

	return {
		init: function() {
			window.JsInterface = JsInterface;
		}
	};

});

appStickerPipeStore.factory('PackService', function(Config) {

	return {
		isActive: function(pack) {
			return pack.user_status == 'active';
		},

		isHidden: function(pack) {
			return pack.user_status == 'hidden';
		},

		isDisable: function(pack) {
			return pack.user_status == 'none';
		},

		getMainSticker: function(pack) {
			return pack.main_icon[Config.resolutionType];
		}
	};

});

appStickerPipeStore.factory('PlatformAPI', function(Config, $injector, $rootScope, $window, Helper) {

	var provider = {};

	return {
		init: function() {
			switch(true) {
				case Helper.isAndroid():
					provider = window.AndroidJsInterface || {};
					break;
				case Helper.isIOS():
					provider = window.IosJsInterface || {};
					break;
				case Helper.isJS():
					provider = $injector.get('JsPlatformProvider');
					break;
			}

			provider.init && provider.init();
		},

		configure: function() {
			provider.configure && provider.configure.apply(provider, arguments);
		},

		////////////////////////////////////////////////////////////
		// Functions
		////////////////////////////////////////////////////////////

		showCollections: function(packName) {
			var result = null;
			switch(true) {
				case Helper.isAndroid():
				case Helper.isIOS():
					result = provider.showCollections();
					break;
				case Helper.isJS():
					result = provider.showPack(packName);
					break;
			}

			return result;
		},

		showPack: function(packName) {
			return provider.showPack(packName);
		},

		purchasePack: function(packTitle, packName, packPrice) {
			return provider.purchasePack(packTitle, packName, packPrice);
		},

		showPagePreloader: function(show) {
			return provider.setInProgress(show);
		},

		removePack: function(packName) {
			return provider.removePack(packName);
		},

		showBackButton: function(url) {
			$rootScope.goBackUrl = url;
			provider.showBackButton && provider.showBackButton(!!(url));
		},

		canShowPack: function() {
			if (Helper.isJS()) {
				return !!provider.configs.canShowPack;
			} else {
				return (typeof provider.showPack == 'function');
			}
		},

		canRemovePack: function() {
			if (Helper.isJS()) {
				return !!provider.configs.canRemovePack;
			} else {
				return (typeof provider.removePack == 'function');
			}
		},

		setYScroll: function(yPosition) {
			if (Helper.isJS() && Helper.getMobileOS() == 'ios') {
				provider.setYScroll && provider.setYScroll(yPosition);
			} else {
				$window.scrollTo(0, yPosition);
			}
		}
	};

});
appStickerPipeStore.directive('spButton', function () {
	return {
		restrict: 'AE',
		transclude: true,
		templateUrl: '/directives/sp-button/view.tpl',
		scope: {
			btnClick: '&',
			btnClass: '@',
			btnInProgress: '='
		},
		link: function (scope, el, attrs) {
			var border = 2,
				progressEl = el[0].getElementsByClassName('progress')[0];
			var buttonEl = el[0].getElementsByTagName('button')[0];


			scope.$watch('btnInProgress', function() {
				if (progressEl.clientWidth < buttonEl.clientWidth) {
					progressEl.style.width = buttonEl.clientWidth + border + 'px';
				}
			});
		}
	};
});

appStickerPipeStore.directive('basePage', function() {

	return {
		restrict: 'AE',
		templateUrl: '/modules/base-page/view.tpl',
		link: function($scope, $el, attrs) {}
	};
});

appStickerPipeStore.controller('PackController', function($scope, Config, PlatformAPI, i18n, $rootScope, PackService, pack, $window, Helper) {

	PlatformAPI.showBackButton('#/store');

	function isLandscape() {
		return ($window.innerWidth > $window.innerHeight || $window.innerWidth > 544);
	}

	angular.extend($scope, {
		i18n: i18n,
		pack: pack,
		packService: PackService,

		isJSPlatform: Helper.isJS(),
		showPage: false,

		isSubscriber: Config.isSubscriber,
		priceB: Config.priceB,
		priceC: Config.priceC,

		inProgress: false,

		canShowPack: PlatformAPI.canShowPack(),
		canRemovePack: PlatformAPI.canRemovePack(),

		showPack: function() {
			PlatformAPI.showPack(pack.pack_name);
		},

		removePack: function() {
			PlatformAPI.removePack(pack.pack_name);
		},

		orientation: function() {
			return isLandscape() ? 'landscape' : 'portrait';
		},

		purchasePack: function() {
			$scope.inProgress = true;
			PlatformAPI.purchasePack(pack.title, pack.pack_name, pack.pricepoint);
		},

		getStickersPreview: function() {
			if (!this.pack) {
				return false;
			}

			var image = this.pack[isLandscape() ? 'preview_landscape' : 'preview'] || {},
				url = image[Config.resolutionType] || false;

			if (!url) {
				this.hidePagePreloader();
			}
			return url;
		},

		hidePagePreloader: function() {
			PlatformAPI.showPagePreloader(false);
			this.showPage = true;
		}
	});

	$rootScope.$on('showActionProgress', function() {
		$scope.inProgress = true;
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	});

	$rootScope.$on('hideActionProgress', function() {
		$scope.inProgress  = false;
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	});

	angular.element($window).bind('resize', function () {
		$scope.$apply();
	});
});

appStickerPipeStore.controller('StoreController', function($scope, packs, PlatformAPI, Helper, i18n) {

	PlatformAPI.showPagePreloader(false);

	angular.extend($scope, {
		i18n: i18n,
		isJSPlatform: Helper.isJS(),
		packs: packs
	});
});

appStickerPipeStore.factory('JsPlatformProvider', function($rootScope, $window, $timeout, Config) {

	function callSDKMethod(action, attrs) {
		window.parent.postMessage(JSON.stringify({
			action: action,
			attrs: attrs
		}), 'http://' + Config.clientDomain);
	}

	function runApiListener() {
		$window.addEventListener('message', (function(e) {

			var data = JSON.parse(e.data);

			data.attrs = data.attrs || {};

			if (!data.action) {
				return;
			}

			var JsInterface = window.JsInterface;
			if (JsInterface) {
				JsInterface[data.action] && JsInterface[data.action](data.attrs);
			}
		}).bind(this));
	}

	return {

		configs: {
			canShowPack: false,
			canRemovePack: false
		},

		init: function() {
			runApiListener();

			$window.addEventListener('keyup', (function(e) {
				this.keyUp(e.keyCode);
			}).bind(this));
		},

		configure: function(attrs) {
			this.configs.canShowPack = !!attrs.canShowPack;
			this.configs.canRemovePack = !!attrs.canRemovePack;
		},

		showBackButton: function(show) {
			callSDKMethod('showBackButton', {
				show: show
			});
		},

		setYScroll: function(yPosition) {
			callSDKMethod('setYScroll', {
				yPosition: yPosition
			});
		},

		keyUp: function(keyCode) {
			callSDKMethod('keyUp', {
				keyCode: keyCode
			});
		},

		///////////////////////////////////////////////////////////////
		// Common methods
		///////////////////////////////////////////////////////////////


		showCollections: function(packName) {
			callSDKMethod('showCollections', {
				packName: packName
			});
		},

		showPack: function(packName) {
			callSDKMethod('showPack', {
				packName: packName
			});
		},

		purchasePack: function(packTitle, packName, packPrice) {
			callSDKMethod('purchasePack', {
				packTitle: packTitle,
				packName: packName,
				pricePoint: packPrice
			});
		},

		setInProgress: function(show) {
			callSDKMethod('showPagePreloader', {
				show: show
			});
		},

		removePack: function(packName) {
			callSDKMethod('removePack', {
				packName: packName
			});
		}
	};
});

appStickerPipeStore.directive('error', function(Config,  $window, $timeout, i18n, EnvConfig) {
	
	return {
		restrict: 'AE',
		templateUrl: '/modules/base-page/error/view.tpl',
		link: function($scope, $el, attrs) {

			$scope.imgUrl = EnvConfig.notAvailableImgUrl;
			$scope.i18n = i18n;
		}

	};
});
appStickerPipeStore.directive('packPreview', function(PackService, Config) {

	return {
		restrict: 'AE',
		templateUrl: '/modules/store/pack-preview/view.tpl',
		scope: {
			pack: '='
		},
		link: function($scope, $el, attrs) {

			var $packPreview = angular.element($el[0].getElementsByClassName('pack-preview')[0]);

			$el.bind('mouseover', function() {
				$packPreview.addClass('active');
			});

			$el.bind('mouseleave', function() {
				$packPreview.removeClass('active');
			});

			angular.extend($scope, {
				priceB: Config.priceB,
				priceC: Config.priceC,

				getMainStickerUrl: function() {
					return PackService.getMainSticker($scope.pack);
				},

				getPackTitle: function(pack) {
					var title = pack.title;
					if (title.length > 15) {
						title = title.substr(0, 15);
						title += '...';
					}

					return title;
				}
			});
		}
	};
});