/*
const scrapeIt = require("scrape-it");

 var cookieJar = request.jar();
 request.post({url : requesturl, jar: cookieJar, form: lform}, ...

// Promise interface
scrapeIt("https://ionicabizau.net", {
    title: ".header h1", 
    desc: ".header h2", 
    avatar: {
        selector: ".header img", 
        attr: "src"
    }
}).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`);
    console.log(data);
});
*/

module.exports = {
	poll: function() {
		return {};
	}
};
