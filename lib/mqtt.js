'use strict';
const mqtt = require('mqtt');

module.exports = function(checker, config) {
	const client  = mqtt.connect(config);

	function sendState() {
		var dataJson = JSON.stringify(checker.data);
		client.publish(config.topics.state, dataJson);
	}

	client.on('connect', function() {
		console.log('mqtt: client connected!')
		sendState(); //make sure the current state is know when connected
	});

	checker.on('data', sendState);

	return client;
}
