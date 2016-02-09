
(function(Plugin) {

	// todo: + bind & unbind methods for events (error on ESC two modals)

	var modalsStack = [],
		KEY_CODE_A = 65,
		KEY_CODE_TAB = 9,
		KEY_CODE_ESC = 27,

		oMargin = {},
		ieBodyTopMargin = 0,

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

		var bodyOuterWidth = Plugin.Service.El.outerWidth(document.body);
		document.body.classList.add(classes.lock);
		document.getElementsByTagName('html')[0].classList.add(classes.lock);

		var scrollbarWidth = Plugin.Service.El.outerWidth(document.body) - bodyOuterWidth;

		if (Plugin.Service.Helper.isIE()) {
			ieBodyTopMargin = Plugin.Service.El.css(document.body, 'marginTop');
			document.body.style.marginTop = 0;
		}

		if (scrollbarWidth != 0) {
			var tags = ['html', 'body'];
			for (var i = 0 ; i < tags.length; i++) {
				var tag = tags[i],
					tagEl = document.getElementsByTagName(tag)[0];

				oMargin[tag.toLowerCase()] = parseInt(Plugin.Service.El.css(tagEl, 'marginRight'));
			}

			document.getElementsByTagName('html')[0].style.marginRight = oMargin['html'] + scrollbarWidth + 'px';

			overlay.style.left = 0 - scrollbarWidth + 'px';
		}
	}

	function unlockContainer() {
		overlay.parentNode.removeChild(overlay);
		overlay = null;

		if (Plugin.Service.Helper.isIE()) {
			document.body.style.marginTop = ieBodyTopMargin + 'px';
		}

		var bodyOuterWidth = Plugin.Service.El.outerWidth(document.body);
		document.body.classList.remove(classes.lock);
		document.getElementsByTagName('html')[0].classList.remove(classes.lock);
		var scrollbarWidth = Plugin.Service.El.outerWidth(document.body) - bodyOuterWidth;

		if (scrollbarWidth != 0) {
			var tags = ['html', 'body'];
			for (var i = 0 ; i < tags.length; i++) {
				var tag = tags[i],
					tagEl = document.getElementsByTagName(tag)[0];

				tagEl.style.marginRight = oMargin[tag.toLowerCase()] + 'px';
			}
		}
	}

	Plugin.Module.Modal = {

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
					Plugin.Service.El.appendAfter(this.modalEl, overlay);

					this.modalEl.style.display = 'block';

					if (this.options.closeOnEsc) {
						window.addEventListener('keyup', (function(e) {
							if(e.keyCode === KEY_CODE_ESC && isOpen) {
								this.close(this.options);
							}
						}).bind(this));

						// todo
						// if iframe
						//if (this.contentEl && this.contentEl.contentWindow) {
						//	this.contentEl.contentWindow.addEventListener('keyup', (function(e) {
						//		if(e.keyCode === KEY_CODE_ESC && isOpen) {
						//			this.close(this.options);
						//		}
						//	}).bind(this));
						//}
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

						//var q = Plugin.Service.El.getParents(e.target, '.' + classes.overlay);
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
				},

				// todo
				hasGlobalOpened: function() {
					return isOpen;
				}
			});
		},

		setDefaultOptions: function(options) {
			defaultOptions = extend({}, defaultOptions, options);
		}
	};

})(window.StickersModule);