var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database"); // get our config file


var userLoginCheck = function (req, res) {

	var post  = {
		email:req.body.email,
		fireToken:req.body.fireToken		
	}

	var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
	var table = ["accounts","fireToken", post.fireToken, "email", post.email];
	query = mysql.format(query,table);

	connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		}
		else {

			if(rows.length==1){
				var token = jwt.sign(rows, config.secret, {expiresIn: '1h'});
				var refreshToken = jwt.sign(rows, config.refreshTokenSecret, { expiresIn: '168h' })
				var user_id= rows[0].id;
				var data  = {
					user_id:rows[0].id,					
					access_token:token,
					//refreshToken:refreshToken
				}
				var query = "INSERT INTO  ?? SET  ?";
				var table = ["access_token"];
				query = mysql.format(query,table);
				connection.query(query, data, function(err,rows){
					if(err) {
						res.json({"Error" : true, "Message" : "Error executing MySQL query"});
					} else {
						res.json({
							//success: true,
							//message: 'Token generated',
							currUser: data.user_id,//data.user_id,
							token: token,
							refreshToken: refreshToken							
						});
           				 } // return info including token
           				});
			}
			else {
				res.json({"Error" : true, "Message" : "wrong email/fireToken combination"});
			}

		}
	});
}

module.exports = userLoginCheck;

