var config = {
	interval: 60 * 60 * 1000, // minutes * seconds * milliseconds
	provider: {
		name: 'scarlet', // adjust to match your provider
		username: undefined,
		password: undefined
	},

	// remove to disable rest api
	rest: {
		port: 4040
	},

	// remove to disable mqtt interface
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
