import restify = require("restify");

var server = restify.createServer();

server.get("/hello", (req, res, next) => {
	res.send("Hello");
	next();
});

server.listen(3000);

