'use strict';
const express = require('express');

module.exports = function(checker, config) {
	const app = express();

	app.get('/', (req, res) => {
		res.json(checker.data);
	});

	app.get('/update', (req, res) => {
		checker.poll.then(d => {
			res.json(d);
		}).catch(next);
	});

	app.listen(config.port, () => console.log('rest: listening on port ' + config.port + '!'));

	return app;
};
