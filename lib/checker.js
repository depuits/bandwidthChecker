'use strict';
const eventEmitter = require('events').EventEmitter;

module.exports = function(provider) {
	const checker = Object.create(new eventEmitter());
	var pollId = undefined;
	//set up data structure
	// this will be overwritten in the poll
	// but its filled in here to get an idea of the data
	checker.data = {
		used: undefined,
		total: undefined,
		refreshDate: undefined,
		lastUpdate: undefined
	};

	//polling loop
	function poll() {
		console.log('starting poll');
		return provider.poll().then(d => {
			checker.data = d;

			//add the last update time
			d.lastUpdate = new Date();
			console.log('poll complete');
			checker.emit('data', d);
			return d;
		}).catch(e => {
			console.log('err: polling failed - ' + e);
		});
	}

	poll(); // do the initial polling to fill the data

	return Object.assign(checker, {
		poll: poll,
		setInterval: function(i) {
			checker.interval = i;
			clearInterval(pollId);
			if (i !== undefined) {
				console.log('starting interval');
				pollId = setInterval(poll, i);
			}
		}
	});
};
