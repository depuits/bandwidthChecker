'use strict';
const fs = require('fs');
const request = require('request-promise');

const urlLogin = 'https://www.proximus.be/auth/json/authenticate';
const urlProducts = 'https://www.proximus.be/rest/products-aggregator/user-product-overview';
const urlData = 'https://www.proximus.be/rest/usage-product-internet/usage/service/';

module.exports = function(config) {
	async function poll() {
		let cookieJar = request.jar();

		let dir = './tmp/';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		console.log('Logging in');
		let respLoginReq = await request({ url: urlLogin, method: 'POST', jar: cookieJar, json: true });
		fs.writeFile(dir + '01_loginRes.json', JSON.stringify(respLoginReq), () => {});

		// fill in user and password
		respLoginReq.callbacks[0].input[0].value = config.username;
		respLoginReq.callbacks[1].input[0].value = config.password;
		fs.writeFile(dir + '02_loginReq.json', JSON.stringify(respLoginReq), () => {});

		let respLogin = await request({ url: urlLogin, method: 'POST', jar: cookieJar, json: respLoginReq });
		fs.writeFile(dir + '03_loggedinRes.json', JSON.stringify(respLogin), () => {});

		console.log('Getting products');
		let respProds = await request({ url: urlProducts, method: 'GET', jar: cookieJar, json: true });
		fs.writeFile(dir + '04_products.json', JSON.stringify(respProds), () => {});

		//find the correct product for internet (it's the only one with the soccabisId property)
		let product = respProds.FLS.inPackProducts[0].products.find(p => p.soccabisId);
		let productId = product.soccabisId;

		console.log('Getting data');
		let respData = await request({ url: urlData + productId, method: 'GET', jar: cookieJar, json: true });
		fs.writeFile(dir + '05_usage.json', JSON.stringify(respData), () => {});

		let data = respData.reportingCategoryGroups[0].reportingCategories[0];
		let b2gb = (1024 * 1024 * 1024); // kb * mb * gb

		return {
			used: data.usage / b2gb,
			total: data.allowance.threshold / b2gb,
			refreshDate: new Date(data.endDate)
		};
	}

	return {
		poll
	};
};
