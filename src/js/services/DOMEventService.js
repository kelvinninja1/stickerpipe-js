
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

			// todo: ie dispatcher (through el.fireEvent)
			//if (typeof CustomEvent === 'function') {
				el.dispatchEvent(new CustomEvent(eventName, {
					bubbles: true,
					cancelable: true
				}));
			//}
			//else { // IE
			//	element=document.documentElement;
			//	var event=document.createEventObject();
			//	el.fireEvent("onresize",event);
			//}
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