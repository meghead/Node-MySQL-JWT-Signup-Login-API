var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
 
var verifyToken=function (req, res,next) {
	var token = req.body.token || req.query.token || req.headers['token'];
	 if (token) {
		jwt.verify(token, config.secret, function (err, currUser) {
			if (err) {
				res.send(err);
			} else {
				req.currUser = currUser;
				next();
			}
		});
	}
	 else {
		res.status(401).send("Invalid Access");
	}
};
module.exports=verifyToken;