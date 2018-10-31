'use strict';
const fs = require('fs');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const urlLogin = 'https://www.scarlet.be/customercare/logon.do';
const urlData = 'https://www.scarlet.be/customercare/usage/dispatch.do';

module.exports = function(config) {
	function textBetween (value, startPattern, endPattern, startIndex) {
		startIndex = value.indexOf(startPattern, startIndex) + startPattern.length;
		var endIndex = value.indexOf (endPattern, startIndex);
		value = value.substring(startIndex, endIndex);

		return { value, startIndex, endIndex };
	}

	function poll() {
		var cookieJar = request.jar();
		
		var loginInfo = {
			username: config.username, 
			password: config.password 
		};

		var dir = './tmp/';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		console.log('Logging in');
		return request({ url: urlLogin, method: 'POST', jar: cookieJar, form: loginInfo }).then(resp => {
			fs.writeFile(dir + 'logon.html', resp.body, () => {});
			console.log('Getting data');
			return request({ url: urlData, method: 'GET', jar: cookieJar });
		}).then(resp => {
			fs.writeFile(dir + 'usage.html', resp.body, () => {});

			//"parse" the html
			var { value: usedStr, endIndex } = textBetween(resp.body, 'document.write(Math.round(', ')', 0);
			var { value: totalStr, endIndex } = textBetween(resp.body, 'document.write(Math.round(', ')', endIndex);
			var refreshInStr = textBetween(resp.body, '<strong>', ' ', endIndex).value;

			var refreshDate = new Date();
			refreshDate.setUTCHours(0,0,0,0);
			var days = parseInt(refreshInStr);
			if (days === NaN) {
				// if we couldn't parse the days remaining it must be refreshed today
				//  so we'll set the refresh to the next month
				refreshDate.setMonth(refreshDate.getMonth() + 1);
			} else {
				refreshDate.setDate(refreshDate.getDate() + days);
			}

			return {
				used: parseFloat(usedStr),
				total: parseFloat(totalStr),
				refreshDate
			};
		});
	}

	return {
		poll
	};
};
