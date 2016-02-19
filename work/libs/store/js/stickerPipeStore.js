angular.module('environment',[]).provider('envService',function(){this.environment='development';this.data={};this.config=function(config){this.data=config;};this.set=function(environment){this.environment=environment;};this.get=function(){return this.environment;};this.read=function(variable){if(variable!=='all'){return this.data.vars[this.get()][variable];}
	return this.data.vars[this.get()];};this.is=function(environment){return(environment===this.environment);};this.check=function(){var	location=window.location.href,self=this;angular.forEach(this.data.domains,function(v,k){angular.forEach(v,function(v){if(location.match('//'+v)){self.environment=k;}});});};this.$get=function(){return this;};});
/**
 * An Angular module that gives you access to the browsers local storage
 * @version v0.2.3 - 2015-10-11
 * @link https://github.com/grevory/angular-local-storage
 * @author grevory <greg@gregpike.ca>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */!function(a,b){"use strict";var c=b.isDefined,d=b.isUndefined,e=b.isNumber,f=b.isObject,g=b.isArray,h=b.extend,i=b.toJson,j=b.module("LocalStorageModule",[]);j.provider("localStorageService",function(){this.prefix="ls",this.storageType="localStorage",this.cookie={expiry:30,path:"/"},this.notify={setItem:!0,removeItem:!1},this.setPrefix=function(a){return this.prefix=a,this},this.setStorageType=function(a){return this.storageType=a,this},this.setStorageCookie=function(a,b){return this.cookie.expiry=a,this.cookie.path=b,this},this.setStorageCookieDomain=function(a){return this.cookie.domain=a,this},this.setNotify=function(a,b){return this.notify={setItem:a,removeItem:b},this},this.$get=["$rootScope","$window","$document","$parse",function(a,b,j,k){var l,m=this,n=m.prefix,o=m.cookie,p=m.notify,q=m.storageType;j?j[0]&&(j=j[0]):j=document,"."!==n.substr(-1)&&(n=n?n+".":"");var r=function(a){return n+a},s=function(){try{var c=q in b&&null!==b[q],d=r("__"+Math.round(1e7*Math.random()));return c&&(l=b[q],l.setItem(d,""),l.removeItem(d)),c}catch(e){return q="cookie",a.$broadcast("LocalStorageModule.notification.error",e.message),!1}}(),t=function(b,c){if(c=d(c)?null:i(c),!s||"cookie"===m.storageType)return s||a.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),p.setItem&&a.$broadcast("LocalStorageModule.notification.setitem",{key:b,newvalue:c,storageType:"cookie"}),z(b,c);try{l&&l.setItem(r(b),c),p.setItem&&a.$broadcast("LocalStorageModule.notification.setitem",{key:b,newvalue:c,storageType:m.storageType})}catch(e){return a.$broadcast("LocalStorageModule.notification.error",e.message),z(b,c)}return!0},u=function(b){if(!s||"cookie"===m.storageType)return s||a.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),A(b);var c=l?l.getItem(r(b)):null;if(!c||"null"===c)return null;try{return JSON.parse(c)}catch(d){return c}},v=function(){var b,c;for(b=0;b<arguments.length;b++)if(c=arguments[b],s&&"cookie"!==m.storageType)try{l.removeItem(r(c)),p.removeItem&&a.$broadcast("LocalStorageModule.notification.removeitem",{key:c,storageType:m.storageType})}catch(d){a.$broadcast("LocalStorageModule.notification.error",d.message),B(c)}else s||a.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),p.removeItem&&a.$broadcast("LocalStorageModule.notification.removeitem",{key:c,storageType:"cookie"}),B(c)},w=function(){if(!s)return a.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),!1;var b=n.length,c=[];for(var d in l)if(d.substr(0,b)===n)try{c.push(d.substr(b))}catch(e){return a.$broadcast("LocalStorageModule.notification.error",e.Description),[]}return c},x=function(b){var c=n?new RegExp("^"+n):new RegExp,d=b?new RegExp(b):new RegExp;if(!s||"cookie"===m.storageType)return s||a.$broadcast("LocalStorageModule.notification.warning","LOCAL_STORAGE_NOT_SUPPORTED"),C();var e=n.length;for(var f in l)if(c.test(f)&&d.test(f.substr(e)))try{v(f.substr(e))}catch(g){return a.$broadcast("LocalStorageModule.notification.error",g.message),C()}return!0},y=function(){try{return b.navigator.cookieEnabled||"cookie"in j&&(j.cookie.length>0||(j.cookie="test").indexOf.call(j.cookie,"test")>-1)}catch(c){return a.$broadcast("LocalStorageModule.notification.error",c.message),!1}}(),z=function(b,c,h){if(d(c))return!1;if((g(c)||f(c))&&(c=i(c)),!y)return a.$broadcast("LocalStorageModule.notification.error","COOKIES_NOT_SUPPORTED"),!1;try{var k="",l=new Date,m="";if(null===c?(l.setTime(l.getTime()+-864e5),k="; expires="+l.toGMTString(),c=""):e(h)&&0!==h?(l.setTime(l.getTime()+24*h*60*60*1e3),k="; expires="+l.toGMTString()):0!==o.expiry&&(l.setTime(l.getTime()+24*o.expiry*60*60*1e3),k="; expires="+l.toGMTString()),b){var n="; path="+o.path;o.domain&&(m="; domain="+o.domain),j.cookie=r(b)+"="+encodeURIComponent(c)+k+n+m}}catch(p){return a.$broadcast("LocalStorageModule.notification.error",p.message),!1}return!0},A=function(b){if(!y)return a.$broadcast("LocalStorageModule.notification.error","COOKIES_NOT_SUPPORTED"),!1;for(var c=j.cookie&&j.cookie.split(";")||[],d=0;d<c.length;d++){for(var e=c[d];" "===e.charAt(0);)e=e.substring(1,e.length);if(0===e.indexOf(r(b)+"=")){var f=decodeURIComponent(e.substring(n.length+b.length+1,e.length));try{return JSON.parse(f)}catch(g){return f}}}return null},B=function(a){z(a,null)},C=function(){for(var a=null,b=n.length,c=j.cookie.split(";"),d=0;d<c.length;d++){for(a=c[d];" "===a.charAt(0);)a=a.substring(1,a.length);var e=a.substring(b,a.indexOf("="));B(e)}},D=function(){return q},E=function(a,b,d,e){e=e||b;var g=u(e);return null===g&&c(d)?g=d:f(g)&&f(d)&&(g=h(d,g)),k(b).assign(a,g),a.$watch(b,function(a){t(e,a)},f(a[b]))},F=function(){for(var a=0,c=b[q],d=0;d<c.length;d++)0===c.key(d).indexOf(n)&&a++;return a};return{isSupported:s,getStorageType:D,set:t,add:t,get:u,keys:w,remove:v,clearAll:x,bind:E,deriveKey:r,length:F,cookie:{isSupported:y,set:z,add:z,get:A,remove:B,clearAll:C}}}]})}(window,window.angular);
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

var appStickerPipeStore = angular.module('appStickerPipeStore', [
	'ngRoute',
	'partials',
	'environment',
	'LocalStorageModule'
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
    '<div class="version">0.0.9</div>\n' +
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
  $templateCache.put('/modules/store/StoreView.tpl',
    '<div data-ng-class="{\'screen-header\': isJSPlatform }" data-ng-show="isJSPlatform"></div>\n' +
    '<div class="packs">\n' +
    '	<div class="col" data-ng-repeat="pack in packs">\n' +
    '		<div class="pack-preview center-block">\n' +
    '			<a href="#/packs/{{ pack.pack_name }}">\n' +
    '\n' +
    '				<div data-sp-sticker\n' +
    '				     data-url="{{ packService.getMainSticker(pack) }}"\n' +
    '				     data-complete-class="main-sticker">\n' +
    '				</div>\n' +
    '\n' +
    '				<h5 class="pack-preview-name">{{ getPackTitle(pack) }}</h5>\n' +
    '				<h5 class="pack-preview-price">\n' +
    '					&nbsp;\n' +
    '					<span data-ng-show="packService.isActive(pack)">{{ i18n.free }}</span>\n' +
    '					<span data-ng-show="packService.isHidden(pack)">{{ i18n.free }}</span>\n' +
    '					<span data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'A\'">{{ i18n.free }}</span>\n' +
    '					<span data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'B\' && priceB">{{ priceB }}</span>\n' +
    '					<span data-ng-show="packService.isDisable(pack) && pack.pricepoint == \'C\' && priceC">{{ priceC }}</span>\n' +
    '					&nbsp;\n' +
    '				</h5>\n' +
    '			</a>\n' +
    '		</div>\n' +
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
    '			     data-ng-show="packService.isHidden(pack) || (packService.isDisable(pack) && (pack.pricepoint == \'A\') || (pack.pricepoint == \'B\' && isSubscriber))"\n' +
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
appStickerPipeStore.directive('spSticker', function (Config, $rootScope, localStorageService) {
	return {
		restrict: 'AE',
		template: '',
		link: function (scope, elem, attrs) {

			var image = new Image();
			image.onerror = function() {};

			function onload() {
				elem.removeClass('sticker-placeholder');
				elem[0].style.background = '';
				elem.addClass(attrs.completeClass);

				elem[0].appendChild(image);

				var imgCache = localStorageService.get('imgCache') || {};
				imgCache[attrs.url] = attrs.url;
				localStorageService.set('imgCache', imgCache);

				image.onload = function() {};
			}

			image.src = attrs.url;


			var imgCache = localStorageService.get('imgCache') || {};
			if (!imgCache[attrs.url]) {
				elem.addClass('sticker-placeholder');
				elem[0].style.background = Config.primaryColor;

				image.onload = function() {
					onload();
				};
			} else {
				//onload();
			}
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

appStickerPipeStore.controller('StoreController', function($scope, packs, Config, PlatformAPI, Helper, PackService, i18n) {

	PlatformAPI.showPagePreloader(false);

	angular.extend($scope, {
		i18n: i18n,
		isJSPlatform: Helper.isJS(),
		packService: PackService,
		packs: packs,
		priceB: Config.priceB,
		priceC: Config.priceC,

		getPackTitle: function(pack) {
			var title = pack.title;
			if (title.length > 15) {
				title = title.substr(0, 15);
				title += '...';
			}

			return title;
		}
	});
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