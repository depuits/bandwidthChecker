'use strict';
const config = require('config');

//checker config
var providerConfig = config.get('provider');
var provider = require('./lib/providers/' + providerConfig.name)(providerConfig);
const checker = require('./lib/checker')(provider);
checker.setInterval(config.get('interval'));

//set up rest end points (data access pull and action invoke)
if (config.has('rest')) {
	console.log('rest: starting');
	var restConfig = config.get('rest');
	require('./lib/rest')(checker, restConfig);
}

//set up mqtt client (only for data access, push)
if (config.has('mqtt')) {
	console.log('mqtt: starting');
	var mqttConfig = Object.assign({}, config.get('mqtt')); // we copy the config because it must be editable
	require('./lib/mqtt')(checker, mqttConfig);
}
