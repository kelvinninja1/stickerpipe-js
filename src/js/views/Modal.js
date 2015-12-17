
(function(Module) {

	var KEY_CODE_A = 65,
		KEY_CODE_TAB = 9,
		KEY_CODE_ESC = 27,

		oMargin = {},
		ieBodyTopMargin = 0,
		pluginNamespace = 'sp-modal',

		classes = {
			lock: 'sp-modal-lock',
			overlay: 'sp-modal-overlay'
		},

		defaultOptions = {
			closeOnEsc: true,
			closeOnOverlayClick: true,

			onBeforeClose: null,
			onClose: null,
			onOpen: null
		},

		isOpen = false;

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

	function lockContainer(overlay) {
		var bodyOuterWidth = Module.El.outerWidth(document.body);
		document.body.classList.add(classes.lock);
		var scrollbarWidth = Module.El.outerWidth(document.body) - bodyOuterWidth;

		if (Module.StickerHelper.isIE()) {
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
		if (Module.StickerHelper.isIE()) {
			document.body.style.marginTop = ieBodyTopMargin + 'px';
		}

		var bodyOuterWidth = Module.El.outerWidth(document.body);
		document.body.classList.remove(classes.lock);
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

	function initModalEl(context) {

		var el = document.createElement('div');
		el.style.display = 'none';
		el.className = 'sp-modal';


		var modalBody = document.createElement('div');
		modalBody.className = 'sp-modal-body';

		el.appendChild(modalBody);

		var close = document.createElement('div');
		close.className = 'sp-icon-close';
		close.addEventListener('click', (function() {
			this.close();
		}).bind(context));


		el.appendChild(close);

		return el;
	}


	Module.View = Module.View || {};

	Module.View.Modal = {

		init: function(el, options) {

			options = extend({}, defaultOptions, (options || {}));

			var modal = {};

			if (!el || !el.nodeType) {

				el = document.querySelector(el);

				if (!el) {
					el = initModalEl(modal);
					document.body.appendChild(el);
				}
			}

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

			return extend(modal, {

				el: el,
				options: options,

				open: function() {

					// close modal if opened
					//if($('.' + classes.overlay).length) {
					//	$.modal().close();
					//}

					// todo: check
					// close modal if opened
					if (document.getElementsByClassName(classes.overlay).length) {
						this.close();
					}

					var overlay = document.createElement('div');
					overlay.className = classes.overlay;

					document.body.insertBefore(overlay, document.body.firstChild);

					lockContainer(overlay);

					var openedModalElement = null;
					if (this.el) {
						openedModalElement = this.el;
						overlay.appendChild(openedModalElement);
						openedModalElement.style.display = 'block';
					}

					if (this.options.closeOnEsc) {
						window.addEventListener('keyup', (function(e) {
							if(e.keyCode === KEY_CODE_ESC && isOpen) {
								this.close(this.options);
							}
						}).bind(this));
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

					document.addEventListener('touchmove', (function(e) {
						//helper function (see below)
						function collectionHas(a, b) {
							for(var i = 0, len = a.length; i < len; i ++) {
								if(a[i] == b) return true;
							}
							return false;
						}

						function findParentBySelector(elm, selector) {
							var all = document.querySelectorAll(selector),
								cur = elm.parentNode;

							//keep going up until you find a match
							while (cur && !collectionHas(all, cur)) {
								cur = cur.parentNode; //go up
							}

							//will return null if not found
							return cur;
						}

						var selector = '.' + classes.overlay;
						var parent = findParentBySelector(e.target, selector);

						if(!parent) {
							e.preventDefault();
						}
					}).bind(this));

					if (this.el) {
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
					}

					if (this.options.onOpen) {
						this.options.onOpen(this.el, overlay, this.options);
					}

					isOpen = true;
				},

				close: function() {
					var overlay = document.getElementsByClassName(classes.overlay)[0];

					// todo
					//if ($.isFunction(this.options.onBeforeClose)) {
					//	if (this.options.onBeforeClose(overlay, this.options) === false) {
					//		return;
					//	}
					//}

					// todo
					//if (!this.options.cloning) {
					//	if (!el) {
					//		el = overlay.data(pluginNamespace+'.el');
					//	}
					//	$(el).hide().appendTo($(el).data(pluginNamespace+'.parent'));
					//}

					overlay.parentNode.removeChild(overlay);
					unlockContainer();

					if(this.options.onClose) {
						this.options.onClose(this.el, overlay, this.options);
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