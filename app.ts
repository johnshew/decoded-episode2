import restify = require("restify");

import GitHubApi = require("github");
import request = require('request');
import Registry = require('npm-registry');


var server = restify.createServer();
var npm = new Registry();

var npmTopPackagesUrl = "https://raw.githubusercontent.com/nexdrew/all-stars/master/packages.json";

var numProcessed = 0;
var NUM_PACKAGES_TO_SHOW = 10;

server.get("/contributors/:package", function(req, res, next) {
	var github = new GitHubApi({
		version: "3.0.0"
	});
	npm.packages.get(req.params.package, function(err, packageDetails) {
    if (err)
      return next(err);

		var gitHubInfo = packageDetails[0].github;
		github.repos.getContributors(
			{
				user: gitHubInfo.user,
				repo: gitHubInfo.repo,
				per_page: 10
			}, function(err, response) {
        if (err)
          return next(err);

				res.send(response);
			}
		);
  });
	next();
});


server.get("/packages", function(req, res, next) {
	request({ uri: npmTopPackagesUrl, json: true }, function(error, response, packages) {
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

var fs = require('fs');
var decodedHtml = fs.readFileSync('decoded.html');
var clientJS = fs.readFileSync('client.js');
server.get('/', function (req, res, next) {
  res.setHeader('content-type', 'text/html');
  res.end(decodedHtml);
  next();
});
server.get('/client.js', function (req, res, next) {
  res.setHeader('content-type', 'application/javascript');
  res.end(clientJS)
  next()
})

server.listen(3000);

