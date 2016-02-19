
var appStickerPipeStore = angular.module('appStickerPipeStore', [
	'ngRoute',
	'partials',
	'environment',
	//'ui.router',
	'ngLocationUpdate'
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
!function(angular, undefined) { 'use strict';

	angular.module('ngLocationUpdate', [])
		.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
			// todo: would be proper to change this to decorators of $location and $route
			$location.update_path = function (path, keep_previous_path_in_history) {
				if ($location.path() == path) return;

				var routeToKeep = $route.current;
				$rootScope.$on('$locationChangeSuccess', function () {
					if (routeToKeep) {
						$route.current = routeToKeep;
						routeToKeep = null;
					}
				});

				$location.path(path);
				if (!keep_previous_path_in_history) $location.replace();
			};
		}]);

}(window.angular);
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
/**
 * State-based routing for AngularJS
 * @version v0.2.15
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="ui.router"),function(a,b,c){"use strict";function d(a,b){return N(new(N(function(){},{prototype:a})),b)}function e(a){return M(arguments,function(b){b!==a&&M(b,function(b,c){a.hasOwnProperty(c)||(a[c]=b)})}),a}function f(a,b){var c=[];for(var d in a.path){if(a.path[d]!==b.path[d])break;c.push(a.path[d])}return c}function g(a){if(Object.keys)return Object.keys(a);var b=[];return M(a,function(a,c){b.push(c)}),b}function h(a,b){if(Array.prototype.indexOf)return a.indexOf(b,Number(arguments[2])||0);var c=a.length>>>0,d=Number(arguments[2])||0;for(d=0>d?Math.ceil(d):Math.floor(d),0>d&&(d+=c);c>d;d++)if(d in a&&a[d]===b)return d;return-1}function i(a,b,c,d){var e,i=f(c,d),j={},k=[];for(var l in i)if(i[l].params&&(e=g(i[l].params),e.length))for(var m in e)h(k,e[m])>=0||(k.push(e[m]),j[e[m]]=a[e[m]]);return N({},j,b)}function j(a,b,c){if(!c){c=[];for(var d in a)c.push(d)}for(var e=0;e<c.length;e++){var f=c[e];if(a[f]!=b[f])return!1}return!0}function k(a,b){var c={};return M(a,function(a){c[a]=b[a]}),c}function l(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));return M(c,function(c){c in a&&(b[c]=a[c])}),b}function m(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));for(var d in a)-1==h(c,d)&&(b[d]=a[d]);return b}function n(a,b){var c=L(a),d=c?[]:{};return M(a,function(a,e){b(a,e)&&(d[c?d.length:e]=a)}),d}function o(a,b){var c=L(a)?[]:{};return M(a,function(a,d){c[d]=b(a,d)}),c}function p(a,b){var d=1,f=2,i={},j=[],k=i,l=N(a.when(i),{$$promises:i,$$values:i});this.study=function(i){function n(a,c){if(s[c]!==f){if(r.push(c),s[c]===d)throw r.splice(0,h(r,c)),new Error("Cyclic dependency: "+r.join(" -> "));if(s[c]=d,J(a))q.push(c,[function(){return b.get(a)}],j);else{var e=b.annotate(a);M(e,function(a){a!==c&&i.hasOwnProperty(a)&&n(i[a],a)}),q.push(c,a,e)}r.pop(),s[c]=f}}function o(a){return K(a)&&a.then&&a.$$promises}if(!K(i))throw new Error("'invocables' must be an object");var p=g(i||{}),q=[],r=[],s={};return M(i,n),i=r=s=null,function(d,f,g){function h(){--u||(v||e(t,f.$$values),r.$$values=t,r.$$promises=r.$$promises||!0,delete r.$$inheritedValues,n.resolve(t))}function i(a){r.$$failure=a,n.reject(a)}function j(c,e,f){function j(a){l.reject(a),i(a)}function k(){if(!H(r.$$failure))try{l.resolve(b.invoke(e,g,t)),l.promise.then(function(a){t[c]=a,h()},j)}catch(a){j(a)}}var l=a.defer(),m=0;M(f,function(a){s.hasOwnProperty(a)&&!d.hasOwnProperty(a)&&(m++,s[a].then(function(b){t[a]=b,--m||k()},j))}),m||k(),s[c]=l.promise}if(o(d)&&g===c&&(g=f,f=d,d=null),d){if(!K(d))throw new Error("'locals' must be an object")}else d=k;if(f){if(!o(f))throw new Error("'parent' must be a promise returned by $resolve.resolve()")}else f=l;var n=a.defer(),r=n.promise,s=r.$$promises={},t=N({},d),u=1+q.length/3,v=!1;if(H(f.$$failure))return i(f.$$failure),r;f.$$inheritedValues&&e(t,m(f.$$inheritedValues,p)),N(s,f.$$promises),f.$$values?(v=e(t,m(f.$$values,p)),r.$$inheritedValues=m(f.$$values,p),h()):(f.$$inheritedValues&&(r.$$inheritedValues=m(f.$$inheritedValues,p)),f.then(h,i));for(var w=0,x=q.length;x>w;w+=3)d.hasOwnProperty(q[w])?h():j(q[w],q[w+1],q[w+2]);return r}},this.resolve=function(a,b,c,d){return this.study(a)(b,c,d)}}function q(a,b,c){this.fromConfig=function(a,b,c){return H(a.template)?this.fromString(a.template,b):H(a.templateUrl)?this.fromUrl(a.templateUrl,b):H(a.templateProvider)?this.fromProvider(a.templateProvider,b,c):null},this.fromString=function(a,b){return I(a)?a(b):a},this.fromUrl=function(c,d){return I(c)&&(c=c(d)),null==c?null:a.get(c,{cache:b,headers:{Accept:"text/html"}}).then(function(a){return a.data})},this.fromProvider=function(a,b,d){return c.invoke(a,null,d||{params:b})}}function r(a,b,e){function f(b,c,d,e){if(q.push(b),o[b])return o[b];if(!/^\w+(-+\w+)*(?:\[\])?$/.test(b))throw new Error("Invalid parameter name '"+b+"' in pattern '"+a+"'");if(p[b])throw new Error("Duplicate parameter name '"+b+"' in pattern '"+a+"'");return p[b]=new P.Param(b,c,d,e),p[b]}function g(a,b,c,d){var e=["",""],f=a.replace(/[\\\[\]\^$*+?.()|{}]/g,"\\$&");if(!b)return f;switch(c){case!1:e=["(",")"+(d?"?":"")];break;case!0:e=["?(",")?"];break;default:e=["("+c+"|",")?"]}return f+e[0]+b+e[1]}function h(e,f){var g,h,i,j,k;return g=e[2]||e[3],k=b.params[g],i=a.substring(m,e.index),h=f?e[4]:e[4]||("*"==e[1]?".*":null),j=P.type(h||"string")||d(P.type("string"),{pattern:new RegExp(h,b.caseInsensitive?"i":c)}),{id:g,regexp:h,segment:i,type:j,cfg:k}}b=N({params:{}},K(b)?b:{});var i,j=/([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,k=/([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,l="^",m=0,n=this.segments=[],o=e?e.params:{},p=this.params=e?e.params.$$new():new P.ParamSet,q=[];this.source=a;for(var r,s,t;(i=j.exec(a))&&(r=h(i,!1),!(r.segment.indexOf("?")>=0));)s=f(r.id,r.type,r.cfg,"path"),l+=g(r.segment,s.type.pattern.source,s.squash,s.isOptional),n.push(r.segment),m=j.lastIndex;t=a.substring(m);var u=t.indexOf("?");if(u>=0){var v=this.sourceSearch=t.substring(u);if(t=t.substring(0,u),this.sourcePath=a.substring(0,m+u),v.length>0)for(m=0;i=k.exec(v);)r=h(i,!0),s=f(r.id,r.type,r.cfg,"search"),m=j.lastIndex}else this.sourcePath=a,this.sourceSearch="";l+=g(t)+(b.strict===!1?"/?":"")+"$",n.push(t),this.regexp=new RegExp(l,b.caseInsensitive?"i":c),this.prefix=n[0],this.$$paramNames=q}function s(a){N(this,a)}function t(){function a(a){return null!=a?a.toString().replace(/\//g,"%2F"):a}function e(a){return null!=a?a.toString().replace(/%2F/g,"/"):a}function f(){return{strict:p,caseInsensitive:m}}function i(a){return I(a)||L(a)&&I(a[a.length-1])}function j(){for(;w.length;){var a=w.shift();if(a.pattern)throw new Error("You cannot override a type's .pattern at runtime.");b.extend(u[a.name],l.invoke(a.def))}}function k(a){N(this,a||{})}P=this;var l,m=!1,p=!0,q=!1,u={},v=!0,w=[],x={string:{encode:a,decode:e,is:function(a){return null==a||!H(a)||"string"==typeof a},pattern:/[^/]*/},"int":{encode:a,decode:function(a){return parseInt(a,10)},is:function(a){return H(a)&&this.decode(a.toString())===a},pattern:/\d+/},bool:{encode:function(a){return a?1:0},decode:function(a){return 0!==parseInt(a,10)},is:function(a){return a===!0||a===!1},pattern:/0|1/},date:{encode:function(a){return this.is(a)?[a.getFullYear(),("0"+(a.getMonth()+1)).slice(-2),("0"+a.getDate()).slice(-2)].join("-"):c},decode:function(a){if(this.is(a))return a;var b=this.capture.exec(a);return b?new Date(b[1],b[2]-1,b[3]):c},is:function(a){return a instanceof Date&&!isNaN(a.valueOf())},equals:function(a,b){return this.is(a)&&this.is(b)&&a.toISOString()===b.toISOString()},pattern:/[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,capture:/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/},json:{encode:b.toJson,decode:b.fromJson,is:b.isObject,equals:b.equals,pattern:/[^/]*/},any:{encode:b.identity,decode:b.identity,equals:b.equals,pattern:/.*/}};t.$$getDefaultValue=function(a){if(!i(a.value))return a.value;if(!l)throw new Error("Injectable functions cannot be called at configuration time");return l.invoke(a.value)},this.caseInsensitive=function(a){return H(a)&&(m=a),m},this.strictMode=function(a){return H(a)&&(p=a),p},this.defaultSquashPolicy=function(a){if(!H(a))return q;if(a!==!0&&a!==!1&&!J(a))throw new Error("Invalid squash policy: "+a+". Valid policies: false, true, arbitrary-string");return q=a,a},this.compile=function(a,b){return new r(a,N(f(),b))},this.isMatcher=function(a){if(!K(a))return!1;var b=!0;return M(r.prototype,function(c,d){I(c)&&(b=b&&H(a[d])&&I(a[d]))}),b},this.type=function(a,b,c){if(!H(b))return u[a];if(u.hasOwnProperty(a))throw new Error("A type named '"+a+"' has already been defined.");return u[a]=new s(N({name:a},b)),c&&(w.push({name:a,def:c}),v||j()),this},M(x,function(a,b){u[b]=new s(N({name:b},a))}),u=d(u,{}),this.$get=["$injector",function(a){return l=a,v=!1,j(),M(x,function(a,b){u[b]||(u[b]=new s(a))}),this}],this.Param=function(a,b,d,e){function f(a){var b=K(a)?g(a):[],c=-1===h(b,"value")&&-1===h(b,"type")&&-1===h(b,"squash")&&-1===h(b,"array");return c&&(a={value:a}),a.$$fn=i(a.value)?a.value:function(){return a.value},a}function j(b,c,d){if(b.type&&c)throw new Error("Param '"+a+"' has two type configurations.");return c?c:b.type?b.type instanceof s?b.type:new s(b.type):"config"===d?u.any:u.string}function k(){var b={array:"search"===e?"auto":!1},c=a.match(/\[\]$/)?{array:!0}:{};return N(b,c,d).array}function m(a,b){var c=a.squash;if(!b||c===!1)return!1;if(!H(c)||null==c)return q;if(c===!0||J(c))return c;throw new Error("Invalid squash policy: '"+c+"'. Valid policies: false, true, or arbitrary string")}function p(a,b,d,e){var f,g,i=[{from:"",to:d||b?c:""},{from:null,to:d||b?c:""}];return f=L(a.replace)?a.replace:[],J(e)&&f.push({from:e,to:c}),g=o(f,function(a){return a.from}),n(i,function(a){return-1===h(g,a.from)}).concat(f)}function r(){if(!l)throw new Error("Injectable functions cannot be called at configuration time");var a=l.invoke(d.$$fn);if(null!==a&&a!==c&&!w.type.is(a))throw new Error("Default value ("+a+") for parameter '"+w.id+"' is not an instance of Type ("+w.type.name+")");return a}function t(a){function b(a){return function(b){return b.from===a}}function c(a){var c=o(n(w.replace,b(a)),function(a){return a.to});return c.length?c[0]:a}return a=c(a),H(a)?w.type.$normalize(a):r()}function v(){return"{Param:"+a+" "+b+" squash: '"+z+"' optional: "+y+"}"}var w=this;d=f(d),b=j(d,b,e);var x=k();b=x?b.$asArray(x,"search"===e):b,"string"!==b.name||x||"path"!==e||d.value!==c||(d.value="");var y=d.value!==c,z=m(d,y),A=p(d,x,y,z);N(this,{id:a,type:b,location:e,array:x,squash:z,replace:A,isOptional:y,value:t,dynamic:c,config:d,toString:v})},k.prototype={$$new:function(){return d(this,N(new k,{$$parent:this}))},$$keys:function(){for(var a=[],b=[],c=this,d=g(k.prototype);c;)b.push(c),c=c.$$parent;return b.reverse(),M(b,function(b){M(g(b),function(b){-1===h(a,b)&&-1===h(d,b)&&a.push(b)})}),a},$$values:function(a){var b={},c=this;return M(c.$$keys(),function(d){b[d]=c[d].value(a&&a[d])}),b},$$equals:function(a,b){var c=!0,d=this;return M(d.$$keys(),function(e){var f=a&&a[e],g=b&&b[e];d[e].type.equals(f,g)||(c=!1)}),c},$$validates:function(a){var d,e,f,g,h,i=this.$$keys();for(d=0;d<i.length&&(e=this[i[d]],f=a[i[d]],f!==c&&null!==f||!e.isOptional);d++){if(g=e.type.$normalize(f),!e.type.is(g))return!1;if(h=e.type.encode(g),b.isString(h)&&!e.type.pattern.exec(h))return!1}return!0},$$parent:c},this.ParamSet=k}function u(a,d){function e(a){var b=/^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(a.source);return null!=b?b[1].replace(/\\(.)/g,"$1"):""}function f(a,b){return a.replace(/\$(\$|\d{1,2})/,function(a,c){return b["$"===c?0:Number(c)]})}function g(a,b,c){if(!c)return!1;var d=a.invoke(b,b,{$match:c});return H(d)?d:!0}function h(d,e,f,g){function h(a,b,c){return"/"===p?a:b?p.slice(0,-1)+a:c?p.slice(1)+a:a}function m(a){function b(a){var b=a(f,d);return b?(J(b)&&d.replace().url(b),!0):!1}if(!a||!a.defaultPrevented){o&&d.url()===o;o=c;var e,g=j.length;for(e=0;g>e;e++)if(b(j[e]))return;k&&b(k)}}function n(){return i=i||e.$on("$locationChangeSuccess",m)}var o,p=g.baseHref(),q=d.url();return l||n(),{sync:function(){m()},listen:function(){return n()},update:function(a){return a?void(q=d.url()):void(d.url()!==q&&(d.url(q),d.replace()))},push:function(a,b,e){var f=a.format(b||{});null!==f&&b&&b["#"]&&(f+="#"+b["#"]),d.url(f),o=e&&e.$$avoidResync?d.url():c,e&&e.replace&&d.replace()},href:function(c,e,f){if(!c.validates(e))return null;var g=a.html5Mode();b.isObject(g)&&(g=g.enabled);var i=c.format(e);if(f=f||{},g||null===i||(i="#"+a.hashPrefix()+i),null!==i&&e&&e["#"]&&(i+="#"+e["#"]),i=h(i,g,f.absolute),!f.absolute||!i)return i;var j=!g&&i?"/":"",k=d.port();return k=80===k||443===k?"":":"+k,[d.protocol(),"://",d.host(),k,j,i].join("")}}}var i,j=[],k=null,l=!1;this.rule=function(a){if(!I(a))throw new Error("'rule' must be a function");return j.push(a),this},this.otherwise=function(a){if(J(a)){var b=a;a=function(){return b}}else if(!I(a))throw new Error("'rule' must be a function");return k=a,this},this.when=function(a,b){var c,h=J(b);if(J(a)&&(a=d.compile(a)),!h&&!I(b)&&!L(b))throw new Error("invalid 'handler' in when()");var i={matcher:function(a,b){return h&&(c=d.compile(b),b=["$match",function(a){return c.format(a)}]),N(function(c,d){return g(c,b,a.exec(d.path(),d.search()))},{prefix:J(a.prefix)?a.prefix:""})},regex:function(a,b){if(a.global||a.sticky)throw new Error("when() RegExp must not be global or sticky");return h&&(c=b,b=["$match",function(a){return f(c,a)}]),N(function(c,d){return g(c,b,a.exec(d.path()))},{prefix:e(a)})}},j={matcher:d.isMatcher(a),regex:a instanceof RegExp};for(var k in j)if(j[k])return this.rule(i[k](a,b));throw new Error("invalid 'what' in when()")},this.deferIntercept=function(a){a===c&&(a=!0),l=a},this.$get=h,h.$inject=["$location","$rootScope","$injector","$browser"]}function v(a,e){function f(a){return 0===a.indexOf(".")||0===a.indexOf("^")}function m(a,b){if(!a)return c;var d=J(a),e=d?a:a.name,g=f(e);if(g){if(!b)throw new Error("No reference point given for path '"+e+"'");b=m(b);for(var h=e.split("."),i=0,j=h.length,k=b;j>i;i++)if(""!==h[i]||0!==i){if("^"!==h[i])break;if(!k.parent)throw new Error("Path '"+e+"' not valid for state '"+b.name+"'");k=k.parent}else k=b;h=h.slice(i).join("."),e=k.name+(k.name&&h?".":"")+h}var l=z[e];return!l||!d&&(d||l!==a&&l.self!==a)?c:l}function n(a,b){A[a]||(A[a]=[]),A[a].push(b)}function p(a){for(var b=A[a]||[];b.length;)q(b.shift())}function q(b){b=d(b,{self:b,resolve:b.resolve||{},toString:function(){return this.name}});var c=b.name;if(!J(c)||c.indexOf("@")>=0)throw new Error("State must have a valid name");if(z.hasOwnProperty(c))throw new Error("State '"+c+"'' is already defined");var e=-1!==c.indexOf(".")?c.substring(0,c.lastIndexOf(".")):J(b.parent)?b.parent:K(b.parent)&&J(b.parent.name)?b.parent.name:"";if(e&&!z[e])return n(e,b.self);for(var f in C)I(C[f])&&(b[f]=C[f](b,C.$delegates[f]));return z[c]=b,!b[B]&&b.url&&a.when(b.url,["$match","$stateParams",function(a,c){y.$current.navigable==b&&j(a,c)||y.transitionTo(b,a,{inherit:!0,location:!1})}]),p(c),b}function r(a){return a.indexOf("*")>-1}function s(a){for(var b=a.split("."),c=y.$current.name.split("."),d=0,e=b.length;e>d;d++)"*"===b[d]&&(c[d]="*");return"**"===b[0]&&(c=c.slice(h(c,b[1])),c.unshift("**")),"**"===b[b.length-1]&&(c.splice(h(c,b[b.length-2])+1,Number.MAX_VALUE),c.push("**")),b.length!=c.length?!1:c.join("")===b.join("")}function t(a,b){return J(a)&&!H(b)?C[a]:I(b)&&J(a)?(C[a]&&!C.$delegates[a]&&(C.$delegates[a]=C[a]),C[a]=b,this):this}function u(a,b){return K(a)?b=a:b.name=a,q(b),this}function v(a,e,f,h,l,n,p,q,t){function u(b,c,d,f){var g=a.$broadcast("$stateNotFound",b,c,d);if(g.defaultPrevented)return p.update(),D;if(!g.retry)return null;if(f.$retry)return p.update(),E;var h=y.transition=e.when(g.retry);return h.then(function(){return h!==y.transition?A:(b.options.$retry=!0,y.transitionTo(b.to,b.toParams,b.options))},function(){return D}),p.update(),h}function v(a,c,d,g,i,j){function m(){var c=[];return M(a.views,function(d,e){var g=d.resolve&&d.resolve!==a.resolve?d.resolve:{};g.$template=[function(){return f.load(e,{view:d,locals:i.globals,params:n,notify:j.notify})||""}],c.push(l.resolve(g,i.globals,i.resolve,a).then(function(c){if(I(d.controllerProvider)||L(d.controllerProvider)){var f=b.extend({},g,i.globals);c.$$controller=h.invoke(d.controllerProvider,null,f)}else c.$$controller=d.controller;c.$$state=a,c.$$controllerAs=d.controllerAs,i[e]=c}))}),e.all(c).then(function(){return i.globals})}var n=d?c:k(a.params.$$keys(),c),o={$stateParams:n};i.resolve=l.resolve(a.resolve,o,i.resolve,a);var p=[i.resolve.then(function(a){i.globals=a})];return g&&p.push(g),e.all(p).then(m).then(function(a){return i})}var A=e.reject(new Error("transition superseded")),C=e.reject(new Error("transition prevented")),D=e.reject(new Error("transition aborted")),E=e.reject(new Error("transition failed"));return x.locals={resolve:null,globals:{$stateParams:{}}},y={params:{},current:x.self,$current:x,transition:null},y.reload=function(a){return y.transitionTo(y.current,n,{reload:a||!0,inherit:!1,notify:!0})},y.go=function(a,b,c){return y.transitionTo(a,b,N({inherit:!0,relative:y.$current},c))},y.transitionTo=function(b,c,f){c=c||{},f=N({location:!0,inherit:!1,relative:null,notify:!0,reload:!1,$retry:!1},f||{});var g,j=y.$current,l=y.params,o=j.path,q=m(b,f.relative),r=c["#"];if(!H(q)){var s={to:b,toParams:c,options:f},t=u(s,j.self,l,f);if(t)return t;if(b=s.to,c=s.toParams,f=s.options,q=m(b,f.relative),!H(q)){if(!f.relative)throw new Error("No such state '"+b+"'");throw new Error("Could not resolve '"+b+"' from state '"+f.relative+"'")}}if(q[B])throw new Error("Cannot transition to abstract state '"+b+"'");if(f.inherit&&(c=i(n,c||{},y.$current,q)),!q.params.$$validates(c))return E;c=q.params.$$values(c),b=q;var z=b.path,D=0,F=z[D],G=x.locals,I=[];if(f.reload){if(J(f.reload)||K(f.reload)){if(K(f.reload)&&!f.reload.name)throw new Error("Invalid reload state object");var L=f.reload===!0?o[0]:m(f.reload);if(f.reload&&!L)throw new Error("No such reload state '"+(J(f.reload)?f.reload:f.reload.name)+"'");for(;F&&F===o[D]&&F!==L;)G=I[D]=F.locals,D++,F=z[D]}}else for(;F&&F===o[D]&&F.ownParams.$$equals(c,l);)G=I[D]=F.locals,D++,F=z[D];if(w(b,c,j,l,G,f))return r&&(c["#"]=r),y.params=c,O(y.params,n),f.location&&b.navigable&&b.navigable.url&&(p.push(b.navigable.url,c,{$$avoidResync:!0,replace:"replace"===f.location}),p.update(!0)),y.transition=null,e.when(y.current);if(c=k(b.params.$$keys(),c||{}),f.notify&&a.$broadcast("$stateChangeStart",b.self,c,j.self,l).defaultPrevented)return a.$broadcast("$stateChangeCancel",b.self,c,j.self,l),p.update(),C;for(var M=e.when(G),P=D;P<z.length;P++,F=z[P])G=I[P]=d(G),M=v(F,c,F===b,M,G,f);var Q=y.transition=M.then(function(){var d,e,g;if(y.transition!==Q)return A;for(d=o.length-1;d>=D;d--)g=o[d],g.self.onExit&&h.invoke(g.self.onExit,g.self,g.locals.globals),g.locals=null;for(d=D;d<z.length;d++)e=z[d],e.locals=I[d],e.self.onEnter&&h.invoke(e.self.onEnter,e.self,e.locals.globals);return r&&(c["#"]=r),y.transition!==Q?A:(y.$current=b,y.current=b.self,y.params=c,O(y.params,n),y.transition=null,f.location&&b.navigable&&p.push(b.navigable.url,b.navigable.locals.globals.$stateParams,{$$avoidResync:!0,replace:"replace"===f.location}),f.notify&&a.$broadcast("$stateChangeSuccess",b.self,c,j.self,l),p.update(!0),y.current)},function(d){return y.transition!==Q?A:(y.transition=null,g=a.$broadcast("$stateChangeError",b.self,c,j.self,l,d),g.defaultPrevented||p.update(),e.reject(d))});return Q},y.is=function(a,b,d){d=N({relative:y.$current},d||{});var e=m(a,d.relative);return H(e)?y.$current!==e?!1:b?j(e.params.$$values(b),n):!0:c},y.includes=function(a,b,d){if(d=N({relative:y.$current},d||{}),J(a)&&r(a)){if(!s(a))return!1;a=y.$current.name}var e=m(a,d.relative);return H(e)?H(y.$current.includes[e.name])?b?j(e.params.$$values(b),n,g(b)):!0:!1:c},y.href=function(a,b,d){d=N({lossy:!0,inherit:!0,absolute:!1,relative:y.$current},d||{});var e=m(a,d.relative);if(!H(e))return null;d.inherit&&(b=i(n,b||{},y.$current,e));var f=e&&d.lossy?e.navigable:e;return f&&f.url!==c&&null!==f.url?p.href(f.url,k(e.params.$$keys().concat("#"),b||{}),{absolute:d.absolute}):null},y.get=function(a,b){if(0===arguments.length)return o(g(z),function(a){return z[a].self});var c=m(a,b||y.$current);return c&&c.self?c.self:null},y}function w(a,b,c,d,e,f){function g(a,b,c){function d(b){return"search"!=a.params[b].location}var e=a.params.$$keys().filter(d),f=l.apply({},[a.params].concat(e)),g=new P.ParamSet(f);return g.$$equals(b,c)}return!f.reload&&a===c&&(e===c.locals||a.self.reloadOnSearch===!1&&g(c,d,b))?!0:void 0}var x,y,z={},A={},B="abstract",C={parent:function(a){if(H(a.parent)&&a.parent)return m(a.parent);var b=/^(.+)\.[^.]+$/.exec(a.name);return b?m(b[1]):x},data:function(a){return a.parent&&a.parent.data&&(a.data=a.self.data=N({},a.parent.data,a.data)),a.data},url:function(a){var b=a.url,c={params:a.params||{}};if(J(b))return"^"==b.charAt(0)?e.compile(b.substring(1),c):(a.parent.navigable||x).url.concat(b,c);if(!b||e.isMatcher(b))return b;throw new Error("Invalid url '"+b+"' in state '"+a+"'")},navigable:function(a){return a.url?a:a.parent?a.parent.navigable:null},ownParams:function(a){var b=a.url&&a.url.params||new P.ParamSet;return M(a.params||{},function(a,c){b[c]||(b[c]=new P.Param(c,null,a,"config"))}),b},params:function(a){return a.parent&&a.parent.params?N(a.parent.params.$$new(),a.ownParams):new P.ParamSet},views:function(a){var b={};return M(H(a.views)?a.views:{"":a},function(c,d){d.indexOf("@")<0&&(d+="@"+a.parent.name),b[d]=c}),b},path:function(a){return a.parent?a.parent.path.concat(a):[]},includes:function(a){var b=a.parent?N({},a.parent.includes):{};return b[a.name]=!0,b},$delegates:{}};x=q({name:"",url:"^",views:null,"abstract":!0}),x.navigable=null,this.decorator=t,this.state=u,this.$get=v,v.$inject=["$rootScope","$q","$view","$injector","$resolve","$stateParams","$urlRouter","$location","$urlMatcherFactory"]}function w(){function a(a,b){return{load:function(c,d){var e,f={template:null,controller:null,view:null,locals:null,notify:!0,async:!0,params:{}};return d=N(f,d),d.view&&(e=b.fromConfig(d.view,d.params,d.locals)),e&&d.notify&&a.$broadcast("$viewContentLoading",d),e}}}this.$get=a,a.$inject=["$rootScope","$templateFactory"]}function x(){var a=!1;this.useAnchorScroll=function(){a=!0},this.$get=["$anchorScroll","$timeout",function(b,c){return a?b:function(a){return c(function(){a[0].scrollIntoView()},0,!1)}}]}function y(a,c,d,e){function f(){return c.has?function(a){return c.has(a)?c.get(a):null}:function(a){try{return c.get(a)}catch(b){return null}}}function g(a,b){var c=function(){return{enter:function(a,b,c){b.after(a),c()},leave:function(a,b){a.remove(),b()}}};if(j)return{enter:function(a,b,c){var d=j.enter(a,null,b,c);d&&d.then&&d.then(c)},leave:function(a,b){var c=j.leave(a,b);c&&c.then&&c.then(b)}};if(i){var d=i&&i(b,a);return{enter:function(a,b,c){d.enter(a,null,b),c()},leave:function(a,b){d.leave(a),b()}}}return c()}var h=f(),i=h("$animator"),j=h("$animate"),k={restrict:"ECA",terminal:!0,priority:400,transclude:"element",compile:function(c,f,h){return function(c,f,i){function j(){l&&(l.remove(),l=null),n&&(n.$destroy(),n=null),m&&(r.leave(m,function(){l=null}),l=m,m=null)}function k(g){var k,l=A(c,i,f,e),s=l&&a.$current&&a.$current.locals[l];if(g||s!==o){k=c.$new(),o=a.$current.locals[l];var t=h(k,function(a){r.enter(a,f,function(){n&&n.$emit("$viewContentAnimationEnded"),(b.isDefined(q)&&!q||c.$eval(q))&&d(a)}),j()});m=t,n=k,n.$emit("$viewContentLoaded"),n.$eval(p)}}var l,m,n,o,p=i.onload||"",q=i.autoscroll,r=g(i,c);c.$on("$stateChangeSuccess",function(){k(!1)}),c.$on("$viewContentLoading",function(){k(!1)}),k(!0)}}};return k}function z(a,b,c,d){return{restrict:"ECA",priority:-400,compile:function(e){var f=e.html();return function(e,g,h){var i=c.$current,j=A(e,h,g,d),k=i&&i.locals[j];if(k){g.data("$uiView",{name:j,state:k.$$state}),g.html(k.$template?k.$template:f);var l=a(g.contents());if(k.$$controller){k.$scope=e,k.$element=g;var m=b(k.$$controller,k);k.$$controllerAs&&(e[k.$$controllerAs]=m),g.data("$ngControllerController",m),g.children().data("$ngControllerController",m)}l(e)}}}}}function A(a,b,c,d){var e=d(b.uiView||b.name||"")(a),f=c.inheritedData("$uiView");return e.indexOf("@")>=0?e:e+"@"+(f?f.state.name:"")}function B(a,b){var c,d=a.match(/^\s*({[^}]*})\s*$/);if(d&&(a=b+"("+d[1]+")"),c=a.replace(/\n/g," ").match(/^([^(]+?)\s*(\((.*)\))?$/),!c||4!==c.length)throw new Error("Invalid state ref '"+a+"'");return{state:c[1],paramExpr:c[3]||null}}function C(a){var b=a.parent().inheritedData("$uiView");return b&&b.state&&b.state.name?b.state:void 0}function D(a,c){var d=["location","inherit","reload","absolute"];return{restrict:"A",require:["?^uiSrefActive","?^uiSrefActiveEq"],link:function(e,f,g,h){var i=B(g.uiSref,a.current.name),j=null,k=C(f)||a.$current,l="[object SVGAnimatedString]"===Object.prototype.toString.call(f.prop("href"))?"xlink:href":"href",m=null,n="A"===f.prop("tagName").toUpperCase(),o="FORM"===f[0].nodeName,p=o?"action":l,q=!0,r={relative:k,inherit:!0},s=e.$eval(g.uiSrefOpts)||{};b.forEach(d,function(a){a in s&&(r[a]=s[a])});var t=function(c){if(c&&(j=b.copy(c)),q){m=a.href(i.state,j,r);var d=h[1]||h[0];return d&&d.$$addStateInfo(i.state,j),null===m?(q=!1,!1):void g.$set(p,m)}};i.paramExpr&&(e.$watch(i.paramExpr,function(a,b){a!==j&&t(a)},!0),j=b.copy(e.$eval(i.paramExpr))),t(),o||f.bind("click",function(b){var d=b.which||b.button;if(!(d>1||b.ctrlKey||b.metaKey||b.shiftKey||f.attr("target"))){var e=c(function(){a.go(i.state,j,r)});b.preventDefault();var g=n&&!m?1:0;b.preventDefault=function(){g--<=0&&c.cancel(e)}}})}}}function E(a,b,c){return{restrict:"A",controller:["$scope","$element","$attrs",function(b,d,e){function f(){g()?d.addClass(i):d.removeClass(i)}function g(){for(var a=0;a<j.length;a++)if(h(j[a].state,j[a].params))return!0;return!1}function h(b,c){return"undefined"!=typeof e.uiSrefActiveEq?a.is(b.name,c):a.includes(b.name,c)}var i,j=[];i=c(e.uiSrefActiveEq||e.uiSrefActive||"",!1)(b),this.$$addStateInfo=function(b,c){var e=a.get(b,C(d));j.push({state:e||{name:b},params:c}),f()},b.$on("$stateChangeSuccess",f)}]}}function F(a){var b=function(b){return a.is(b)};return b.$stateful=!0,b}function G(a){var b=function(b){return a.includes(b)};return b.$stateful=!0,b}var H=b.isDefined,I=b.isFunction,J=b.isString,K=b.isObject,L=b.isArray,M=b.forEach,N=b.extend,O=b.copy;b.module("ui.router.util",["ng"]),b.module("ui.router.router",["ui.router.util"]),b.module("ui.router.state",["ui.router.router","ui.router.util"]),b.module("ui.router",["ui.router.state"]),b.module("ui.router.compat",["ui.router"]),p.$inject=["$q","$injector"],b.module("ui.router.util").service("$resolve",p),q.$inject=["$http","$templateCache","$injector"],b.module("ui.router.util").service("$templateFactory",q);var P;r.prototype.concat=function(a,b){var c={caseInsensitive:P.caseInsensitive(),strict:P.strictMode(),squash:P.defaultSquashPolicy()};return new r(this.sourcePath+a+this.sourceSearch,N(c,b),this)},r.prototype.toString=function(){return this.source},r.prototype.exec=function(a,b){function c(a){function b(a){return a.split("").reverse().join("")}function c(a){return a.replace(/\\-/g,"-")}var d=b(a).split(/-(?!\\)/),e=o(d,b);return o(e,c).reverse()}var d=this.regexp.exec(a);if(!d)return null;b=b||{};var e,f,g,h=this.parameters(),i=h.length,j=this.segments.length-1,k={};if(j!==d.length-1)throw new Error("Unbalanced capture group in route '"+this.source+"'");for(e=0;j>e;e++){g=h[e];var l=this.params[g],m=d[e+1];for(f=0;f<l.replace;f++)l.replace[f].from===m&&(m=l.replace[f].to);m&&l.array===!0&&(m=c(m)),k[g]=l.value(m)}for(;i>e;e++)g=h[e],k[g]=this.params[g].value(b[g]);return k},r.prototype.parameters=function(a){return H(a)?this.params[a]||null:this.$$paramNames},r.prototype.validates=function(a){return this.params.$$validates(a)},r.prototype.format=function(a){function b(a){return encodeURIComponent(a).replace(/-/g,function(a){return"%5C%"+a.charCodeAt(0).toString(16).toUpperCase()})}a=a||{};var c=this.segments,d=this.parameters(),e=this.params;if(!this.validates(a))return null;var f,g=!1,h=c.length-1,i=d.length,j=c[0];for(f=0;i>f;f++){var k=h>f,l=d[f],m=e[l],n=m.value(a[l]),p=m.isOptional&&m.type.equals(m.value(),n),q=p?m.squash:!1,r=m.type.encode(n);if(k){var s=c[f+1];if(q===!1)null!=r&&(j+=L(r)?o(r,b).join("-"):encodeURIComponent(r)),j+=s;else if(q===!0){var t=j.match(/\/$/)?/\/?(.*)/:/(.*)/;j+=s.match(t)[1]}else J(q)&&(j+=q+s)}else{if(null==r||p&&q!==!1)continue;L(r)||(r=[r]),r=o(r,encodeURIComponent).join("&"+l+"="),j+=(g?"&":"?")+(l+"="+r),g=!0}}return j},s.prototype.is=function(a,b){return!0},s.prototype.encode=function(a,b){return a},s.prototype.decode=function(a,b){return a},s.prototype.equals=function(a,b){return a==b},s.prototype.$subPattern=function(){var a=this.pattern.toString();return a.substr(1,a.length-2)},s.prototype.pattern=/.*/,s.prototype.toString=function(){return"{Type:"+this.name+"}"},s.prototype.$normalize=function(a){return this.is(a)?a:this.decode(a)},s.prototype.$asArray=function(a,b){function d(a,b){function d(a,b){return function(){return a[b].apply(a,arguments)}}function e(a){return L(a)?a:H(a)?[a]:[]}function f(a){switch(a.length){case 0:return c;case 1:return"auto"===b?a[0]:a;default:return a}}function g(a){return!a}function h(a,b){return function(c){c=e(c);var d=o(c,a);return b===!0?0===n(d,g).length:f(d)}}function i(a){return function(b,c){var d=e(b),f=e(c);if(d.length!==f.length)return!1;for(var g=0;g<d.length;g++)if(!a(d[g],f[g]))return!1;return!0}}this.encode=h(d(a,"encode")),this.decode=h(d(a,"decode")),this.is=h(d(a,"is"),!0),this.equals=i(d(a,"equals")),this.pattern=a.pattern,this.$normalize=h(d(a,"$normalize")),this.name=a.name,this.$arrayMode=b}if(!a)return this;if("auto"===a&&!b)throw new Error("'auto' array mode is for query parameters only");return new d(this,a)},b.module("ui.router.util").provider("$urlMatcherFactory",t),b.module("ui.router.util").run(["$urlMatcherFactory",function(a){}]),u.$inject=["$locationProvider","$urlMatcherFactoryProvider"],b.module("ui.router.router").provider("$urlRouter",u),v.$inject=["$urlRouterProvider","$urlMatcherFactoryProvider"],b.module("ui.router.state").value("$stateParams",{}).provider("$state",v),w.$inject=[],b.module("ui.router.state").provider("$view",w),b.module("ui.router.state").provider("$uiViewScroll",x),y.$inject=["$state","$injector","$uiViewScroll","$interpolate"],z.$inject=["$compile","$controller","$state","$interpolate"],b.module("ui.router.state").directive("uiView",y),b.module("ui.router.state").directive("uiView",z),D.$inject=["$state","$timeout"],E.$inject=["$state","$stateParams","$interpolate"],b.module("ui.router.state").directive("uiSref",D).directive("uiSrefActive",E).directive("uiSrefActiveEq",E),F.$inject=["$state"],G.$inject=["$state"],b.module("ui.router.state").filter("isState",F).filter("includedByState",G)}(window,window.angular);
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
  $templateCache.put('/modules/base-page/view.tpl',
    '<div class="version">0.0.4</div>\n' +
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
appStickerPipeStore.directive('spSticker', function (Config) {
	return {
		restrict: 'AE',
		template: '',
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

			image.src = attrs.url;
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



appStickerPipeStore.factory('JsInterface', function(
	$rootScope,
	//$state,
	$route,
	PlatformAPI,
	$location) {

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
			//$state.go($state.$current, null, { reload: true });
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
				//window.location.href = $rootScope.goBackUrl;
				$location.update_path($rootScope.goBackUrl, true);
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

appStickerPipeStore.controller('PackController', function($scope, Config, EnvConfig, PlatformAPI, i18n, $rootScope, PackService, pack, $window, Helper) {

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

appStickerPipeStore.controller('StoreController', function($rootScope, $scope, packs, Config, PlatformAPI, $location, Helper, PackService, i18n) {

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