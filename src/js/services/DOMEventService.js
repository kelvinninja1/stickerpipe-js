
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