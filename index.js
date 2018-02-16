const config = require('config');

//set up data structure
var data = {
	used: undefined,
	total: undefined,
	refreshDate: undefined
};

//set up rest end points (data access pull and action invoke)
if (config.has('rest')) {
	var restConfig = config.get('rest'); // we copy the config because it must be editable
	var express = require('express');
	const app = express();

	app.get('/', (req, res) => {
		res.json(data);
	});

	app.listen(restConfig.port, () => console.log('App listening on port ' + restConfig.port + '!'));
}

//set up mqtt client (only for data access, push)
if (config.has('mqtt')) {
	const mqtt = require('mqtt');

	var mqttConfig = Object.assign({}, config.get('mqtt')); // we copy the config because it must be editable
	const client  = mqtt.connect(mqttConfig);

	function sendState() {
		var dataJson = JSON.stringify(data);
		client.publish(mqttConfig.topics.state, dataJson);
	}

	client.on('connect', function () {
		console.log('Mqtt client connected!')
		sendState(); //make sure the current state is know when connected
	});
}

//start polling loop
var providerConfig = config.get('provider');
var provider = require('./lib/providers/' + providerConfig.name);
function poll() {
	//TODO update dat instead of replacing it
	var data = provider.poll();
}

setInterval(poll, config.get('interval'));
