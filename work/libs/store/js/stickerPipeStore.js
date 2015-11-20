
var appStickerPipeStore = angular.module('appStickerPipeStore', [
	'ngRoute',
	'angular-google-analytics',
	'partials',
	'angularSpinner',
	'environment'
]);
angular.module('environment',[]).provider('envService',function(){this.environment='development';this.data={};this.config=function(config){this.data=config;};this.set=function(environment){this.environment=environment;};this.get=function(){return this.environment;};this.read=function(variable){if(variable!=='all'){return this.data.vars[this.get()][variable];}
	return this.data.vars[this.get()];};this.is=function(environment){return(environment===this.environment);};this.check=function(){var	location=window.location.href,self=this;angular.forEach(this.data.domains,function(v,k){angular.forEach(v,function(v){if(location.match('//'+v)){self.environment=k;}});});};this.$get=function(){return this;};});
/**
 * Angular Google Analytics - Easy tracking for your AngularJS application
 * @version v1.1.2 - 2015-10-13
 * @link http://github.com/revolunet/angular-google-analytics
 * @author Julien Bouquillon <julien@revolunet.com> (https://github.com/revolunet)
 * @contributors Julien Bouquillon (https://github.com/revolunet),Justin Saunders (https://github.com/justinsa),Chris Esplin (https://github.com/deltaepsilon),Adam Misiorny (https://github.com/adam187)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(a,b,c,d){"use strict";c.module("angular-google-analytics",[]).provider("Analytics",function(){var e,f,g,h,i,j=!0,k="auto",l=!1,m=!1,n="USD",o=!1,p=!1,q=!1,r=!1,s=!1,t=!1,u=!1,v=!1,w=!1,x="$routeChangeSuccess",y=!1,z="",A=!0,B=!1;this.log=[],this.offlineQueue=[],this.setAccount=function(a){return e=c.isUndefined(a)||a===!1?d:c.isArray(a)?a:c.isObject(a)?[a]:[{tracker:a,trackEvent:!0}],this},this.trackPages=function(a){return A=a,this},this.trackPrefix=function(a){return z=a,this},this.setDomainName=function(a){return g=a,this},this.useDisplayFeatures=function(a){return p=!!a,this},this.useAnalytics=function(a){return j=!!a,this},this.useEnhancedLinkAttribution=function(a){return s=!!a,this},this.useCrossDomainLinker=function(a){return m=!!a,this},this.setCrossLinkDomains=function(a){return f=a,this},this.setPageEvent=function(a){return x=a,this},this.setCookieConfig=function(a){return k=a,this},this.useECommerce=function(a,b){return q=!!a,r=!!b,this},this.setCurrency=function(a){return n=a,this},this.setRemoveRegExp=function(a){return a instanceof RegExp&&(i=a),this},this.setExperimentId=function(a){return h=a,this},this.ignoreFirstPageLoad=function(a){return t=!!a,this},this.trackUrlParams=function(a){return B=!!a,this},this.setHybridMobileSupport=function(a){return v=!!a,this},this.startOffline=function(a){return w=!!a,w===!0&&this.delayScriptTag(!0),this},this.delayScriptTag=function(a){return o=!!a,this},this.logAllCalls=function(a){return u=!!a,this},this.enterTestMode=function(){return y=!0,this},this.$get=["$document","$location","$log","$rootScope","$window",function(C,D,E,F,G){var H=this,I=function(a,b){return c.isString(b)?b+"."+a:J("name",b)?b.name+"."+a:a},J=function(a,b){return c.isObject(b)&&c.isDefined(b[a])},K=function(a,b,c){return J(a,b)&&b[a]===c},L=function(){var a=B?D.url():D.path();return i?a.replace(i,""):a},M=function(){var a={utm_source:"campaignSource",utm_medium:"campaignMedium",utm_term:"campaignTerm",utm_content:"campaignContent",utm_campaign:"campaignName"},b={};return c.forEach(D.search(),function(d,e){var f=a[e];c.isDefined(f)&&(b[f]=d)}),b},N=function(a,b,c,d,e,f,g,h,i){var j={};return a&&(j.id=a),b&&(j.affiliation=b),c&&(j.revenue=c),d&&(j.tax=d),e&&(j.shipping=e),f&&(j.coupon=f),g&&(j.list=g),h&&(j.step=h),i&&(j.option=i),j},O=function(a){!j&&G._gaq&&"function"==typeof a&&a()},P=function(){var a=Array.prototype.slice.call(arguments);return w===!0?void H.offlineQueue.push([P,a]):(G._gaq||(G._gaq=[]),u===!0&&H._log.apply(H,a),void G._gaq.push(a))},Q=function(a){j&&G.ga&&"function"==typeof a&&a()},R=function(){var a=Array.prototype.slice.call(arguments);return w===!0?void H.offlineQueue.push([R,a]):"function"!=typeof G.ga?void H._log("warn","ga function not set on window"):(u===!0&&H._log.apply(H,a),void G.ga.apply(null,a))},S=function(a){var b=Array.prototype.slice.call(arguments,1),c=b[0],d=[];return"function"==typeof a?e.forEach(function(b){a(b)&&d.push(b)}):d=e,0===d.length?void R.apply(H,b):void d.forEach(function(a){b[0]=I(c,a),R.apply(H,b)})};return this._log=function(){var a=Array.prototype.slice.call(arguments);if(a.length>0){if(a.length>1)switch(a[0]){case"debug":case"error":case"info":case"log":case"warn":E[a[0]](a.slice(1))}H.log.push(a)}},this._createScriptTag=function(){if(!e||e.length<1)return void H._log("warn","No account id set to create script tag");if(e.length>1&&(H._log("warn","Multiple trackers are not supported with ga.js. Using first tracker only"),e=e.slice(0,1)),l===!0)return void H._log("warn","ga.js or analytics.js script tag already created");P("_setAccount",e[0].tracker),g&&P("_setDomainName",g),s&&P("_require","inpage_linkid","//www.google-analytics.com/plugins/ga/inpage_linkid.js"),A&&!t&&(i?P("_trackPageview",L()):P("_trackPageview"));var a;return a=p===!0?("https:"===b.location.protocol?"https://":"http://")+"stats.g.doubleclick.net/dc.js":("https:"===b.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js",y!==!0?!function(){var b=C[0],c=b.createElement("script");c.type="text/javascript",c.async=!0,c.src=a;var d=b.getElementsByTagName("script")[0];d.parentNode.insertBefore(c,d)}():H._log("inject",a),l=!0,!0},this._createAnalyticsScriptTag=function(){if(!e)return void H._log("warn","No account id set to create analytics script tag");if(l===!0)return void H._log("warn","ga.js or analytics.js script tag already created");var d=v===!0?"https:":"",g=d+"//www.google-analytics.com/analytics.js";if(y!==!0?!function(a,b,c,d,e,f,g){a.GoogleAnalyticsObject=e,a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)},a[e].l=1*new Date,f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=1,f.src=d,g.parentNode.insertBefore(f,g)}(a,b,"script",g,"ga"):("function"!=typeof G.ga&&(G.ga=function(){}),H._log("inject",g)),e.forEach(function(a){a.crossDomainLinker=J("crossDomainLinker",a)?a.crossDomainLinker:m,a.crossLinkDomains=J("crossLinkDomains",a)?a.crossLinkDomains:f,a.displayFeatures=J("displayFeatures",a)?a.displayFeatures:p,a.enhancedLinkAttribution=J("enhancedLinkAttribution",a)?a.enhancedLinkAttribution:s,a.trackEcommerce=J("trackEcommerce",a)?a.trackEcommerce:q,a.trackEvent=J("trackEvent",a)?a.trackEvent:!1;var b={};J("fields",a)?b=a.fields:J("cookieConfig",a)?c.isString(a.cookieConfig)?b.cookieDomain=a.cookieConfig:b=a.cookieConfig:c.isString(k)?b.cookieDomain=k:k&&(b=k),a.crossDomainLinker===!0&&(b.allowLinker=!0),J("name",a)&&(b.name=a.name),a.fields=b,R("create",a.tracker,a.fields),v===!0&&R(I("set",a),"checkProtocolTask",null),a.crossDomainLinker===!0&&(R(I("require",a),"linker"),c.isDefined(a.crossLinkDomains)&&R(I("linker:autoLink",a),a.crossLinkDomains)),a.displayFeatures&&R(I("require",a),"displayfeatures"),a.trackEcommerce&&(r?(R(I("require",a),"ec"),R(I("set",a),"&cu",n)):R(I("require",a),"ecommerce")),a.enhancedLinkAttribution&&R(I("require",a),"linkid"),A&&!t&&R(I("send",a),"pageview",L())}),h){var i=b.createElement("script"),j=b.getElementsByTagName("script")[0];i.src=d+"//www.google-analytics.com/cx/api.js?experiment="+h,j.parentNode.insertBefore(i,j)}return l=!0,!0},this._ecommerceEnabled=function(a,b){var c=q&&!r;return a===!0&&c===!1&&(q&&r?H._log("warn",b+" is not available when Enhanced Ecommerce is enabled with analytics.js"):H._log("warn","Ecommerce must be enabled to use "+b+" with analytics.js")),c},this._enhancedEcommerceEnabled=function(a,b){var c=q&&r;return a===!0&&c===!1&&H._log("warn","Enhanced Ecommerce must be enabled to use "+b+" with analytics.js"),c},this._trackPage=function(a,b,e){a=a?a:L(),b=b?b:C[0].title,O(function(){P("_set","title",b),P("_trackPageview",z+a)}),Q(function(){var f={page:z+a,title:b};c.extend(f,M()),c.isObject(e)&&c.extend(f,e),S(d,"send","pageview",f)})},this._trackEvent=function(a,b,d,e,f,g){O(function(){P("_trackEvent",a,b,d,e,!!f)}),Q(function(){var h={},i=function(a){return K("trackEvent",a,!0)};c.isDefined(f)&&(h.nonInteraction=!!f),c.isObject(g)&&c.extend(h,g),S(i,"send","event",a,b,d,e,h)})},this._addTrans=function(a,b,c,d,e,f,g,h,i){O(function(){P("_addTrans",a,b,c,d,e,f,g,h)}),Q(function(){if(H._ecommerceEnabled(!0,"addTrans")){var f=function(a){return K("trackEcommerce",a,!0)};S(f,"ecommerce:addTransaction",{id:a,affiliation:b,revenue:c,tax:d,shipping:e,currency:i||"USD"})}})},this._addItem=function(a,b,c,d,e,f){O(function(){P("_addItem",a,b,c,d,e,f)}),Q(function(){if(H._ecommerceEnabled(!0,"addItem")){var g=function(a){return K("trackEcommerce",a,!0)};S(g,"ecommerce:addItem",{id:a,name:c,sku:b,category:d,price:e,quantity:f})}})},this._trackTrans=function(){O(function(){P("_trackTrans")}),Q(function(){if(H._ecommerceEnabled(!0,"trackTrans")){var a=function(a){return K("trackEcommerce",a,!0)};S(a,"ecommerce:send")}})},this._clearTrans=function(){Q(function(){if(H._ecommerceEnabled(!0,"clearTrans")){var a=function(a){return K("trackEcommerce",a,!0)};S(a,"ecommerce:clear")}})},this._addProduct=function(a,b,d,e,f,g,h,i,j,k){O(function(){P("_addProduct",a,b,d,e,f,g,h,i,j)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"addProduct")){var l=function(a){return K("trackEcommerce",a,!0)},m={id:a,name:b,category:d,brand:e,variant:f,price:g,quantity:h,coupon:i,position:j};c.isObject(k)&&c.extend(m,k),S(l,"ec:addProduct",m)}})},this._addImpression=function(a,b,c,d,e,f,g,h){O(function(){P("_addImpression",a,b,c,d,e,f,g,h)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"addImpression")){var i=function(a){return K("trackEcommerce",a,!0)};S(i,"ec:addImpression",{id:a,name:b,category:e,brand:d,variant:f,list:c,position:g,price:h})}})},this._addPromo=function(a,b,c,d){O(function(){P("_addPromo",a,b,c,d)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"addPromo")){var e=function(a){return K("trackEcommerce",a,!0)};S(e,"ec:addPromo",{id:a,name:b,creative:c,position:d})}})},this._setAction=function(a,b){O(function(){P("_setAction",a,b)}),Q(function(){if(H._enhancedEcommerceEnabled(!0,"setAction")){var c=function(a){return K("trackEcommerce",a,!0)};S(c,"ec:setAction",a,b)}})},this._trackTransaction=function(a,b,c,d,e,f,g,h,i){this._setAction("purchase",N(a,b,c,d,e,f,g,h,i))},this._trackRefund=function(a){this._setAction("refund",N(a))},this._trackCheckOut=function(a,b){this._setAction("checkout",N(null,null,null,null,null,null,null,a,b))},this._trackDetail=function(){this._setAction("detail"),this._pageView()},this._trackCart=function(a){-1!==["add","remove"].indexOf(a)&&(this._setAction(a),this._trackEvent("UX","click",a+("add"===a?" to cart":" from cart")))},this._promoClick=function(a){this._setAction("promo_click"),this._trackEvent("Internal Promotions","click",a)},this._productClick=function(a){this._setAction("click",N(null,null,null,null,null,null,a,null,null)),this._trackEvent("UX","click",a)},this._pageView=function(a){Q(function(){R(I("send",a),"pageview")})},this._send=function(){var a=Array.prototype.slice.call(arguments);a.unshift("send"),Q(function(){R.apply(H,a)})},this._set=function(a,b,c){Q(function(){R(I("set",c),a,b)})},this._trackTimings=function(a,b,c,d){this._send("timing",a,b,c,d)},o||(j?this._createAnalyticsScriptTag():this._createScriptTag()),A&&F.$on(x,function(){H._trackPage()}),{log:H.log,offlineQueue:H.offlineQueue,configuration:{accounts:e,universalAnalytics:j,crossDomainLinker:m,crossLinkDomains:f,currency:n,delayScriptTag:o,displayFeatures:p,domainName:g,ecommerce:H._ecommerceEnabled(),enhancedEcommerce:H._enhancedEcommerceEnabled(),enhancedLinkAttribution:s,experimentId:h,hybridMobileSupport:v,ignoreFirstPageLoad:t,logAllCalls:u,pageEvent:x,removeRegExp:i,testMode:y,trackPrefix:z,trackRoutes:A,trackUrlParams:B},getUrl:L,setCookieConfig:H._setCookieConfig,getCookieConfig:function(){return k},createAnalyticsScriptTag:function(a){return a&&(k=a),H._createAnalyticsScriptTag()},createScriptTag:function(){return H._createScriptTag()},offline:function(a){if(a===!0&&w===!1&&(w=!0),a===!1&&w===!0)for(w=!1;H.offlineQueue.length>0;){var b=H.offlineQueue.shift();b[0].apply(H,b[1])}return w},trackPage:function(a,b,c){H._trackPage.apply(H,arguments)},trackEvent:function(a,b,c,d,e,f){H._trackEvent.apply(H,arguments)},addTrans:function(a,b,c,d,e,f,g,h,i){H._addTrans.apply(H,arguments)},addItem:function(a,b,c,d,e,f){H._addItem.apply(H,arguments)},trackTrans:function(){H._trackTrans.apply(H,arguments)},clearTrans:function(){H._clearTrans.apply(H,arguments)},addProduct:function(a,b,c,d,e,f,g,h,i,j){H._addProduct.apply(H,arguments)},addPromo:function(a,b,c,d){H._addPromo.apply(H,arguments)},addImpression:function(a,b,c,d,e,f,g,h){H._addImpression.apply(H,arguments)},productClick:function(a){H._productClick.apply(H,arguments)},promoClick:function(a){H._promoClick.apply(H,arguments)},trackDetail:function(){H._trackDetail.apply(H,arguments)},trackCart:function(a){H._trackCart.apply(H,arguments)},trackCheckout:function(a,b){H._trackCheckOut.apply(H,arguments)},trackTimings:function(a,b,c,d){H._trackTimings.apply(H,arguments)},trackTransaction:function(a,b,c,d,e,f,g,h,i){H._trackTransaction.apply(H,arguments)},setAction:function(a,b){H._setAction.apply(H,arguments)},pageView:function(){H._pageView.apply(H,arguments)},send:function(a){H._send.apply(H,arguments)},set:function(a,b,c){H._set.apply(H,arguments)}}}]}).directive("gaTrackEvent",["Analytics","$parse",function(a,b){return{restrict:"A",link:function(c,d,e){var f=b(e.gaTrackEvent);d.bind("click",function(){(!e.gaTrackEventIf||c.$eval(e.gaTrackEventIf))&&f.length>1&&a.trackEvent.apply(a,f(c))})}}}])}(window,document,window.angular);
/*
 AngularJS v1.4.7
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
/**
 * angular-spinner version 0.5.0
 * License: MIT.
 * Copyright (C) 2013, 2014, Uri Shaked and contributors.
 */

(function (root) {
	'use strict';

	function factory(angular, Spinner) {

		angular
			.module('angularSpinner', [])

			.factory('usSpinnerService', ['$rootScope', function ($rootScope) {
				var config = {};

				config.spin = function (key) {
					$rootScope.$broadcast('us-spinner:spin', key);
				};

				config.stop = function (key) {
					$rootScope.$broadcast('us-spinner:stop', key);
				};

				return config;
			}])

			.directive('usSpinner', ['$window', function ($window) {
				return {
					scope: true,
					link: function (scope, element, attr) {
						var SpinnerConstructor = Spinner || $window.Spinner;

						scope.spinner = null;

						scope.key = angular.isDefined(attr.spinnerKey) ? attr.spinnerKey : false;

						scope.startActive = angular.isDefined(attr.spinnerStartActive) ?
							attr.spinnerStartActive : scope.key ?
							false : true;

						scope.spin = function () {
							if (scope.spinner) {
								scope.spinner.spin(element[0]);
							}
						};

						scope.stop = function () {
							if (scope.spinner) {
								scope.spinner.stop();
							}
						};

						scope.$watch(attr.usSpinner, function (options) {
							scope.stop();
							scope.spinner = new SpinnerConstructor(options);
							if (!scope.key || scope.startActive) {
								scope.spinner.spin(element[0]);
							}
						}, true);

						scope.$on('us-spinner:spin', function (event, key) {
							if (key === scope.key) {
								scope.spin();
							}
						});

						scope.$on('us-spinner:stop', function (event, key) {
							if (key === scope.key) {
								scope.stop();
							}
						});

						scope.$on('$destroy', function () {
							scope.stop();
							scope.spinner = null;
						});
					}
				};
			}]);
	}

	if (typeof define === 'function' && define.amd) {
		/* AMD module */
		define(['angular', 'spin'], factory);
	} else {
		/* Browser global */
		factory(root.angular);
	}
}(window));
// http://spin.js.org/#v2.3.2
!function(a,b){"object"==typeof module&&module.exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(k.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",k.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;if(b=b.charAt(0).toUpperCase()+b.slice(1),void 0!==e[b])return b;for(d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}k.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.scale*d.width,left:d.scale*d.radius,top:-d.scale*d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.scale*(d.length+d.width),k=2*d.scale*j,l=-(d.width+d.length)*d.scale*2+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k,l=["webkit","Moz","ms","O"],m={},n={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};if(h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=a(null,{className:d.className});if(e(f,{position:d.position,width:0,zIndex:d.zIndex,left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.scale*(f.length+f.width)+"px",height:f.scale*f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.scale*f.radius+"px,0)",borderRadius:(f.corners*f.scale*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.scale*f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),"undefined"!=typeof document){k=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}();var o=e(a("group"),{behavior:"url(#default#VML)"});!d(o,"transform")&&o.adj?i():j=d(o,"animation")}return h});
appStickerPipeStore.config(function(envServiceProvider) {

	// default development(work)

	envServiceProvider.config({
		domains: {
			local: ['localhost', '192.168.56.1'],
			development: ['work.stk.908.vc'],
			production: ['stickerpipe.com']
		},
		vars: {
			local: {
				cssUrl: 'css/',
				notAvailableImgUrl: 'http://work.stk.908.vc/static/img/notavailable.png',
				coinImgUrl: 'http://work.stk.908.vc/libs/store/current/coins/',
				stickersStorageUrl: 'http://work.stk.908.vc/stk/',
				apiUrl: 'http://work.stk.908.vc/api/'
			},
			development: {
				notAvailableImgUrl: 'http://work.stk.908.vc/static/img/notavailable.png',
				coinImgUrl: 'http://work.stk.908.vc/libs/store/current/coins/',
				stickersStorageUrl: 'http://work.stk.908.vc/stk/',
				apiUrl: 'http://work.stk.908.vc/api/'
			},
			production: {
				notAvailableImgUrl: 'http://stickerpipe.com/static/img/notavailable.png',
				coinImgUrl: 'http://stickerpipe.com/libs/store/current/coins/',
				stickersStorageUrl: 'http://api.stickerpipe.com/stk/',
				apiUrl: 'http://api.stickerpipe.com/api/'
			}
		}
	});

	envServiceProvider.check();
});

appStickerPipeStore.config(function (AnalyticsProvider) {

	AnalyticsProvider.setAccount({
		tracker: 'UA-1113296-81',
		name: 'stickerTracker'
	});

});
(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/modules/basePage/BasePageView.tpl',
    '<div data-page-spinner></div>\n' +
    '\n' +
    '<div class="store">\n' +
    '	<div data-ng-view=""></div>\n' +
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
  $templateCache.put('/modules/error/ErrorView.tpl',
    '<div class="error-page">\n' +
    '	<div class="container">\n' +
    '		<div class="row">\n' +
    '			<div class="col-xs-6 col-xs-offset-3">\n' +
    '				<img src="{{ imgUrl }}" alt="" class="img-responsive"><br>\n' +
    '				<p>{{ i18n.unavailableContent }}</p>\n' +
    '			</div>\n' +
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
    '<div class="pack-screen {{ hasTappedSticker() ? \'hasTappedSticker\' : \'\' }}"\n' +
    '	 ng-click="resetTappedSticker()">\n' +
    '\n' +
    '	<div class="pack-header">\n' +
    '		<div data-pack-header pack="pack" sticker-url="getStickerUrl"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="pack-content">\n' +
    '		<div class="container">\n' +
    '			<div class="row">\n' +
    '				<div class="col-xs-12">\n' +
    '					<p class="description">{{ pack.get(\'description\') || \'\' }}</p>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '\n' +
    '			<div class="row">\n' +
    '				<div class="stickers">\n' +
    '					<div class="sticker-container" ng-repeat="sticker in pack.get(\'stickers\')">\n' +
    '						<div class="sticker {{ isTappedSticker(sticker) ? \'tapped\' : \'\' }}"\n' +
    '						     ng-click="tapSticker(sticker); $event.stopPropagation();">\n' +
    '\n' +
    '							<img ng-src="{{ getStickerUrl(sticker.name) }}"\n' +
    '							     alt="{{ sticker.name }}"\n' +
    '							     class="img-responsive"/>\n' +
    '						</div>\n' +
    '					</div>\n' +
    '				</div>\n' +
    '			</div>\n' +
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
  $templateCache.put('/modules/store/StoreView.tpl',
    '<div>StoreView</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('partials');
} catch (e) {
  module = angular.module('partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/modules/pack/actionButton/ActionButtonView.tpl',
    '<div data-ng-show="show">\n' +
    '	<a href="javascript: void(0);" ng-click="buttonOnClick(pack); $event.stopPropagation();">{{ buttonText }}</a>\n' +
    '	<img ng-src="{{ getCoinUrl() }}" alt="" ng-if="showCoin">\n' +
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
  $templateCache.put('/modules/pack/header/HeaderView.tpl',
    '<div data-pack-banner\n' +
    '     ng-if="!!getPackBanner()"\n' +
    '     class="pack-banner"\n' +
    '     style="background: url(\'{{ getPackBanner() }}\');">\n' +
    '</div>\n' +
    '\n' +
    '<div class="pack-details-info">\n' +
    '	<div class="container">\n' +
    '		<div class="row">\n' +
    '			<div class="col-xs-12">\n' +
    '				<div class="pack-details-info-content">\n' +
    '					<div class="pack-main-sticker">\n' +
    '						<img ng-src="{{ getMainStickerUrl() }}"\n' +
    '						     alt="{{ pack.get(\'title\') }}"\n' +
    '						     class="img-responsive">\n' +
    '					</div>\n' +
    '\n' +
    '					<div class="pack-info-box">\n' +
    '						<h3>{{ pack.get(\'artist\') }}</h3>\n' +
    '						<h1>{{ pack.get(\'title\') }}</h1>\n' +
    '\n' +
    '						<div pack-action-button pack="pack"></div>\n' +
    '					</div>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();


appStickerPipeStore.config(function($routeProvider) {

	$routeProvider
		.when('/', {
			controller: 'StoreController as storeController',
			templateUrl: '/modules/store/StoreView.tpl'
		})
		.when('/packs/:packName', {
			controller: 'PackController as packController',
			template: '<div pack-page pack="packController.pack"></div>',
			resolve: {
				pack: function($route, PacksCollection) {
					return PacksCollection.findOne($route.current.params.packName);
				}
			}
		})
		.when('/error', {
			template: '<div error-page></div>'
		})
		.otherwise({
			redirectTo: '/'
		});
});

appStickerPipeStore.run(function($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function(e, c, p, error) {
		$location.path('/error');
		$location.replace();
	});
});

appStickerPipeStore.controller('AppController', function(Config, envService) {

	if (envService.is('local')) {
		document.getElementById('css').setAttribute('href', envService.read('cssUrl') + Config.platform.toLocaleLowerCase() + '.css?v='+(+(new Date())));
	}

	this.getResolutionType = function() {
		return Config.resolutionType;
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

appStickerPipeStore.factory('Http', ['$http', '$q', 'Config', function($http, $q, Config) {

    var Http = {};

    $http.defaults.headers.post['Accept'] = '*/*';
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    $http.defaults.headers.common['Apikey'] = Config.apiKey;
    $http.defaults.headers.common['Platform'] = Config.platform;
    $http.defaults.headers.common['UserId'] = Config.userId;


    Http.post = function(url, data) {
        var deffered = $q.defer();

        data = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&');

        $http({
            method: 'POST',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (response) {
            deffered.resolve(response);
        }).error(function(response, status) {
            deffered.reject(response);
        });

        return deffered.promise;
    };

    Http.put = function(url, data) {
        var deffered = $q.defer();

        data = $.param(data);

        $http({
            method: 'PUT',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (response) {
            deffered.resolve(response);
        }).error(function(response, status) {
            deffered.reject(response);
        });

        return deffered.promise;
    };

    Http.get = function(url, dataObj) {
        var deffered = $q.defer();

        dataObj = dataObj || {};

        url += '?';

        angular.forEach(dataObj, function(value, key) {
            url += (key + '=' + value + '&');
        });

        if(url[url.length-1] === '&' || url[url.length-1] === '?') {
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
    };

    return Http;

}]);
appStickerPipeStore.factory('HttpApi', function(Http, EnvConfig) {

    var apiVersion = 1,
        getUrl = function(uri) {
            return EnvConfig.apiUrl + 'v' + apiVersion + '/' + uri;
        };


    return angular.extend({}, {
        getPack: function(packName) {
            return Http.get(getUrl('pack/' + packName)).then(function(responce) {
                return responce.data || responce;
            });
        },

        changeUserPackStatus: function(packName, status) {
            return Http.post(getUrl('user/pack/' + packName), {
                status: status
            });
        }
    });
});

appStickerPipeStore.factory('i18n', ['Config', '$injector',
	function(Config, $injector) {

		function ucfirst(str) {
			var f = str.charAt(0).toUpperCase();
			return f + str.substr(1, str.length-1);
		}

		try {
			return $injector.get(ucfirst(Config.lang));
		} catch(e) {
			return $injector.get(ucfirst('en'));
		}
	}]);



appStickerPipeStore.factory('PlatformAPI', [
	'Config',
	'$injector',
	'HttpApi',
	'$q',
	function(Config, $injector, HttpApi, $q) {

		var PlatformInstance = {},
			PlatformAPI = {
				isAndroid: function() {
					return Config.platform.toLowerCase() == 'android';
				},

				isJS: function() {
					return Config.platform.toLowerCase() == 'js';
				},

				isIOS: function() {
					return Config.platform.toLowerCase() == 'ios';
				}
			};

		switch(true) {
			case PlatformAPI.isAndroid():
				PlatformInstance = $injector.get('AndroidPlatform');
				break;
			case PlatformAPI.isJS():
				PlatformInstance = $injector.get('JSPlatform');
				break;
		}

		return angular.extend(PlatformAPI, {

			showPackCollections: function(pack) {
				return PlatformInstance.showPackCollections(pack.get('pack_name'));
			},

			downloadPack: function(pack) {

				if (Config.userId != null && Config.userId != 'null') {
					return HttpApi.changeUserPackStatus(pack.get('pack_name'), 1).then(function() {
						PlatformInstance.downloadPack(pack.get('pack_name'));
					});
				}

				var deferred = $q.defer();
				PlatformInstance.downloadPack(pack.get('pack_name'));
				deferred.resolve();
				return deferred.promise;

			},

			purchasePackInStore: function(pack) {
				return PlatformInstance.purchasePackInStore(pack.get('title'), pack.get('product_id'), pack.get('price'), pack.get('pack_name'));
			},

			purchasePackInPlatformStore: function(pack) {
				return PlatformInstance.purchasePackInPlatformStore(pack.get('product_id'));
			},

			isPackActive: function(pack) {
				return PlatformInstance.isPackActive(pack.get('pack_name'));
			},

			getProductPrice: function(pack) {
				return PlatformInstance.getProductPrice(pack.get('product_id'));
			},

			isPackExistsAtUserLibrary: function(pack) {
				return PlatformInstance.isPackExistsAtUserLibrary(pack.get('pack_name'));
			}

		});

	}]);

appStickerPipeStore.directive('basePage', function() {

	return {
		restrict: 'AE',
		templateUrl: '/modules/basePage/BasePageView.tpl',
		link: function($scope, $el, attrs) {
		}

	};
});

appStickerPipeStore.directive('pageSpinner', function($rootScope, usSpinnerService) {

	return {
		restrict: 'AE',
		template: '<div class="page-spinner" ng-if="showSpinner"><span us-spinner="{radius: 15, width: 4, length: 15, color: \'white\'}" spinner-key="spinner-1"></span></div>',
		link: function($scope, $el, attrs) {
			var bodyEl = document.getElementsByTagName('body')[0];

			$rootScope.$on('$routeChangeStart', function() {
				showSpinner();
			});

			$rootScope.$on('$routeChangeSuccess', function() {
				hideSpinner();
			});

			$rootScope.$on('$routeChangeError', function(e, c, p, error) {
				hideSpinner();
			});

			function showSpinner() {
				$scope.showSpinner = true;
				bodyEl.style.overflow = 'hidden';

				setTimeout(function() {
					usSpinnerService.spin('spinner-1');
				}, 50);
			}

			function hideSpinner() {
				$scope.showSpinner = false;
				bodyEl.style.overflow = 'auto';

				usSpinnerService.stop('spinner-1');
			}

			$scope.$on('showSpinner', function () {
				showSpinner();
			});

			$scope.$on('hideSpinner', function () {
				hideSpinner();
			});

		}

	};
});

appStickerPipeStore.controller('PackController', function(pack) {
	this.pack = pack;
});

appStickerPipeStore.directive('packPage', function(Config,  $window, $timeout, EnvConfig) {

	return {
		restrict: 'AE',
		scope: {
			pack: '=pack'
		},
		templateUrl: '/modules/pack/PackView.tpl',
		link: function($scope, $el, attrs) {

			$scope.tappedSticker = null;

			$scope.getStickerUrl = function(name) {
				return EnvConfig.stickersStorageUrl + $scope.pack.get('pack_name') + '/' + name + '_' + Config.resolutionType + '.png';
			};

			$scope.isTappedSticker = function(sticker) {
				return $scope.tappedSticker == sticker;
			};

			$scope.tapSticker = function(sticker) {
				$scope.tappedSticker = (sticker != $scope.tappedSticker) ? sticker : null;
			};

			$scope.resetTappedSticker = function() {
				$scope.tapSticker(null);
			};

			$scope.hasTappedSticker = function() {
				return !$scope.isTappedSticker(null);
			};

			angular.element($window).bind('scroll', function() {
				$scope.resetTappedSticker();
				$scope.$apply();
			});

			// ************************************************************

			var $windowEl = angular.element($window);

			$scope.stickerColSpan = 2;

			$scope.onWindowResize = function() {
				var windowWidth = $windowEl[0].innerWidth,
					countStickersInRow = 6;

				if (windowWidth < 330) {
					countStickersInRow = 2;
				} else if (windowWidth < 720) {
					countStickersInRow = 3;
				} else if (windowWidth < 980) {
					countStickersInRow = 4;
				}

				$scope.stickerColSpan = 12 / countStickersInRow;

				$scope.$apply();
			};

			$windowEl.on('resize', function() {
				$scope.onWindowResize();
			});

			$timeout(function () {
				$windowEl.triggerHandler('resize');
			});
		}

	};
});

appStickerPipeStore.factory('PackModel', function(PlatformAPI) {

	var PackModel = function(data) {
		if (data) {
			this.setData(data);
		}
	};

	angular.extend(PackModel.prototype, {
		platformPrice: null,

		setData: function(data) {
			this.data = this.data || {};
			angular.extend(this.data, data);
		},

		get: function(field) {
			this.data = this.data || {};
			return this.data[field];
		},

		getPlatformPrice: function(fetch) {
			fetch = fetch || false;

			if (fetch || this.platformPrice === null) {
				this.platformPrice = PlatformAPI.getProductPrice(this);
			}

			return this.platformPrice;
		}
	});

	return PackModel;
});



appStickerPipeStore.factory('PacksCollection', function(HttpApi, PackModel) {
	return {
		findOne: function (name) {
			return HttpApi.getPack(name).then(function(data) {
				return new PackModel(data);
			});
		}

	};
});

appStickerPipeStore.directive('errorPage', function(Config,  $window, $timeout, i18n, EnvConfig) {
	
	return {
		restrict: 'AE',
		templateUrl: '/modules/error/ErrorView.tpl',
		link: function($scope, $el, attrs) {

			$scope.imgUrl = EnvConfig.notAvailableImgUrl;

			var $errorPage = angular.element($el[0].getElementsByClassName('error-page')[0]);

			var $mainDivBlock = angular.element(
				$errorPage[0].getElementsByTagName('div')[0]
			);

			$mainDivBlock.find('img').bind('load', function() {
				$scope.onWindowResize();
			});

			$scope.i18n = i18n;

			$scope.onWindowResize = function() {

				$errorPage.css({
					paddingTop: (($window.innerHeight - $mainDivBlock.prop('offsetHeight')) / 2) + 'px'
				});

			};

			angular.element($window).on('resize', function() {
				$scope.onWindowResize();
			});

			// on render
			$timeout(function () {
				angular.element($window).triggerHandler('resize');
			});
		}

	};
});

appStickerPipeStore.controller('StoreController', function() {

});

appStickerPipeStore.factory('AndroidPlatform', [
	'BasePlatform',
	function(BasePlatform) {

		var platformJSProvider = window.AndroidJsInterface || {};

		return angular.extend(BasePlatform, {

			showPackCollections: function() {
				return platformJSProvider.showCollections();
			},

			downloadPack: function(packName) {
				return platformJSProvider.onPackDownloaded(packName);
			},

			purchasePackInStore: function(packTitle, packProductId, packPrice) {
				return platformJSProvider.onPurchase(packTitle, packProductId, packPrice);
			},

			purchasePackInPlatformStore: function(packProductId) {
				return platformJSProvider.onPurchase(packProductId);
			},

			isPackActive: function(packName) {
				return platformJSProvider.isPackActive(packName);
			},

			getProductPrice: function(packProductId) {
				return platformJSProvider.getProductPrice(packProductId);
			},

			isPackExistsAtUserLibrary: function(packName) {
				return platformJSProvider.isPackExistsAtUserLibrary(packName);
			}
		});
	}]);

appStickerPipeStore.factory('BasePlatform', [function() {

	return angular.extend({}, {

		showPackCollections: function(packName) {
			return false;
		},

		downloadPack: function(packName) {
			return false;
		},

		purchasePackInStore: function(packTitle, packProductId, packPrice) {
			return false;
		},

		purchasePackInPlatformStore: function(packProductId) {
			return false;
		},

		isPackActive: function(packName) {
			return false;
		},

		getProductPrice: function(productId) {
			return false;
		},

		isPackExistsAtUserLibrary: function(packName) {
			return false;
		}
	});

}]);

appStickerPipeStore.factory('JSPlatform', [
	'BasePlatform',
	function(BasePlatform) {

		window.parent.postMessage('testmess', 'http://localhost');
		console.log('run');

		return angular.extend(BasePlatform, {
			showPackCollections: function() { return 1; },
			downloadPack: function() { return 1; },
			purchasePackInStore: function() { return 1; },
			isPackActive: function() { return 1; },
			isPackExistsAtUserLibrary: function() { return 1; }
		});

		var platformJSProvider = window.JsApiInterface || window.parent.JsApiInterface ||  {};

		return angular.extend(BasePlatform, {

			showPackCollections: function(packName) {
				return platformJSProvider.showPackCollections(packName);
			},

			downloadPack: function(packName) {
				return platformJSProvider.downloadPack(packName);
			},

			purchasePackInStore: function(packTitle, packProductId, packPrice, packName) {
				return platformJSProvider.purchasePackInStore(packTitle, packProductId, packPrice, packName);
			},

			isPackActive: function(packName) {
				return platformJSProvider.isPackActive(packName);
			},

			isPackExistsAtUserLibrary: function(packName) {
				return platformJSProvider.isPackExistsAtUserLibrary(packName);
			}
		});
	}]);

appStickerPipeStore.value('En', {
	download: 'Download',
	openStickers: 'Open stickers',
	buyPack: 'Buy pack',
	unavailableContent: 'This content is currently unavailable'
});

appStickerPipeStore.value('Ru', {
	download: 'Скачать',
	openStickers: 'Открыть стикеры',
	buyPack: 'Купить',
	unavailableContent: 'В данный момент этот контент недоступен'
});

appStickerPipeStore.directive('packActionButton', function(PlatformAPI, Config, i18n, EnvConfig) {

	return {
		restrict: 'AE',
		scope: {
			pack: '=pack'
		},
		templateUrl: '/modules/pack/actionButton/ActionButtonView.tpl',
		link: function($scope, $el, attrs) {

			$scope.getCoinUrl = function() {
				return EnvConfig.coinImgUrl + 'coin_' + Config.resolutionType + '.png';
			};


			function renderActionButton($scope) {
				var pack = $scope.pack;

				$scope.buttonText = i18n.download;
				$scope.buttonOnClick = function(pack) {};
				$scope.showCoin = false;
				$scope.show = true;

				if (PlatformAPI.isPackActive(pack)) {
					$scope.buttonText = i18n.openStickers;
					$scope.buttonOnClick = PlatformAPI.showPackCollections;
				} else {
					if (PlatformAPI.isPackExistsAtUserLibrary(pack) || (pack.get('product_id') === undefined && !pack.get('price'))) {
						$scope.buttonText = i18n.download;
						$scope.buttonOnClick = function(pack) {
							$scope.$emit('showSpinner');
							PlatformAPI.downloadPack(pack).then(function() {
								$scope.$emit('hideSpinner');
							});
						};
					} else {
						if (pack.get('product_id') !== undefined && !pack.get('price')) {

							var price = pack.getPlatformPrice();
							$scope.show = !!price;

							$scope.buttonText = i18n.buyPack + ' ' + price;
							$scope.buttonOnClick = PlatformAPI.purchasePackInPlatformStore;
							$scope.showCoin = true;

						} else { // if (pack.get('product_id') && pack.get('price'))

							$scope.buttonText = i18n.buyPack + ' ' + pack.get('price');
							$scope.buttonOnClick = PlatformAPI.purchasePackInStore;
							$scope.showCoin = true;
						}
					}
				}
			}

			renderActionButton($scope);
		}

	};
});

appStickerPipeStore.directive('packHeader', function(Config,  $window, $timeout, PlatformAPI) {

	var bannerSizes = {};

	bannerSizes.mdpi = {
		width: 360,
		height: 168
	};

	bannerSizes.hdpi = {
		width: bannerSizes.mdpi.width * 1.5,
		height: bannerSizes.mdpi.height * 1.5
	};

	bannerSizes.xhdpi = {
		width: bannerSizes.mdpi.width * 2,
		height: bannerSizes.mdpi.height * 2
	};

	bannerSizes.xxhdpi = {
		width: bannerSizes.mdpi.width * 3,
		height: bannerSizes.mdpi.height * 3
	};

	return {
		restrict: 'AE',
		scope: {
			pack: '=pack',
			stickerUrl: '=stickerUrl'
		},
		templateUrl: '/modules/pack/header/HeaderView.tpl',
		link: function($scope, $el, attrs) {

			var pack = $scope.pack;
			var bannerSize = bannerSizes[Config.resolutionType];

			$scope.getPackBanner = function() {
				var banners = pack.get('banners');
				return banners && banners[Config.resolutionType];
			};

			$scope.getMainStickerUrl = function() {
				return $scope.stickerUrl('main_icon');
			};

			$scope.onWindowResize = function() {
				var $packBanner = angular.element($el[0].getElementsByClassName('pack-banner')[0]),
					$packDetailsInfo = angular.element($el[0].getElementsByClassName('pack-details-info')[0]),
					$packMainStickerImg = angular.element($packDetailsInfo[0].getElementsByClassName('pack-main-sticker')[0]).find('img'),
					bannerImgHeight = ($window.innerWidth / bannerSize.width) * bannerSize.height;

				if ($packBanner[0]) {

					// *** *** *** CUSTOMIZE IF EXIST BANNER *** *** ***

					if (PlatformAPI.isAndroid() || PlatformAPI.isIOS()) {

						var $packInfoBox = angular.element($packDetailsInfo[0].getElementsByClassName('pack-info-box')[0]),
							packInfoHeight = $packDetailsInfo.prop('offsetHeight');

						$packDetailsInfo.css({
							marginTop: -(packInfoHeight / 2) + 'px'
						});

						$packBanner.css({
							width: $window.innerWidth + 'px',
							height: bannerImgHeight + 'px'
						});

						$packInfoBox.css({
							marginTop: ((packInfoHeight - $packInfoBox.prop('offsetHeight')) / 2) + 'px'
						});
					}
				}


				// *** *** *** CUSTOMIZE COMMON *** *** ***

				if (PlatformAPI.isAndroid() || PlatformAPI.isIOS()) {
					if ($packMainStickerImg.prop('naturalHeight') > bannerImgHeight) {
						$packMainStickerImg.css({
							height: ((bannerImgHeight / 4) * 3) + 'px'
						});
					}
				}

				$packMainStickerImg.bind('load', function() {
					$scope.onWindowResize();
				});

				$scope.$apply();
			};

			angular.element($window).on('resize', function() {
				$scope.onWindowResize();
			});

			// on render
			$timeout(function () {
				angular.element($window).triggerHandler('resize');
			});
		}
	};
});