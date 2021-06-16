var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
 
var verifyRefresh=function (req, res,next) {
	var refreshToken = req.body.refreshToken || req.query.refreshToken || req.headers['refreshToken'];
	 if (refreshToken) {
		jwt.verify(refreshToken, config.refreshsecret, function (err, currUser) {
			if (err) {
				res.send(err);
			} else {
			req.currUser = currUser;	
			console.log(currUser);
			const user = {
			 "name": req.body.name,	
            "email": req.body.email,
           	"id": req.body.id
        }
        const jwtToken = jwt.sign(user, config.secret, { expiresIn: '1h' })
        const response = {
            "jwtToken": jwtToken
        }
		res.status(200).send(response);
				
			}
		});
	}
	 else {
		res.status(401).send("Invalid Access");
	}
};
module.exports=verifyRefresh;