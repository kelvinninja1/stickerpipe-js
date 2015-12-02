
(function(Module) {

	Module.DOMEventService = {

		events: {
			resize: 'resize',
			popoverShown: 'sp.popover.shown',
			popoverHidden: 'sp.popover.hidden',
			newContentFlagChange: 'sp.content.change-new-flag'
		},

		_dispatch: function(eventName, eventData, el) {
			if (!eventName) {
				return;
			}

			eventData = (typeof eventData != 'undefined') ? eventData : null;
			el = el || window;

			// todo: ie
			//if (typeof CustomEvent === 'function') {
				console.log(eventName);
				el.dispatchEvent(new CustomEvent(eventName, {
					detail: eventData
				}));
			//}
			//else { // IE
			//	element=document.documentElement;
			//	var event=document.createEventObject();
			//	el.fireEvent("onresize",event);
			//}
		},

		dispatch: function(eventName, eventData, el) {
			if (!eventName) {
				return;
			}

			eventData = (typeof eventData != 'undefined') ? eventData : null;
			el = el || window;

			// todo: ie

			var event = document.createEvent('Events');
			event.initEvent(eventName, true, true);
			event.data = eventData;
			el.dispatchEvent(event);
		},

		popoverShown: function() {
			this.dispatch(this.events.popoverShown);
		},

		popoverHidden: function() {
			this.dispatch(this.events.popoverHidden);
		},

		changeNewContentFlag: function(value) {
			this.dispatch(this.events.newContentFlagChange, value);
		},

		// todo: add el param
		resize: function() {
			this.dispatch(this.events.resize);
		}
	};

})(window.StickersModule);