import restify = require("restify");

import GitHubApi = require("github");
import request = require('request');
import Registry = require('npm-registry');


var server = restify.createServer();
var npm = new Registry();

var npmTopPackagesUrl = "https://raw.githubusercontent.com/nexdrew/all-stars/master/packages.json";

var numProcessed = 0;
var NUM_PACKAGES_TO_SHOW = 10;

server.get("/packages", function(req, res, next) {
	request({ uri: npmTopPackagesUrl, json: true }, function(error, response, packages) {
    console.log(packages)
		numProcessed = 0;
		var packageNames = Object.keys(packages).slice(0, NUM_PACKAGES_TO_SHOW);
		var payload = [];
		var num_processed = 0;

		packageNames.forEach(function(name) {
			payload.push(
				{
					name: name,
					rank: packages[name].rank
				}
			)
		});

    res.send(payload);
    next();
  });
});

server.get("/hello", (req, res, next) => {
	res.send("Hello");
	next();
});

server.listen(3000);

