var config = {
	interval:3600,
	provider: {
		name: 'scarlet',
		username: undefined,
		password: undefined
	},
	rest: {
		port:4040
	},
	mqtt: {
		host: '127.0.0.1', 
		port: 1883,
		username: undefined,
		password: undefined,
		topics: {
			state: 'topic/to/push/update'
		}
	}
};

module.exports = config;
