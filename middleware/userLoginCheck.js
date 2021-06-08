var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
var jwt = require('jsonwebtoken'); 
var config = require('../config');
var connection = require("../database"); 

var userLoginCheck = function (req, res) {

	var post  = {
		email:req.body.email,
		password:req.body.password		
	}

	var query = "SELECT ??, ??, ?? FROM ?? WHERE ??=? AND ??=?";
	var table = ["email","id","name","accounts","password", md5(post.password), "email", post.email];
	query = mysql.format(query,table);

	connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		}
		else {

			if(rows.length==1){
				var jwtToken = jwt.sign(rows, config.secret, {expiresIn: '1h'});
				var refreshToken = jwt.sign(rows, config.refreshTokenSecret, { expiresIn: '30d' })
				var user_id= rows[0].id;
				var data  = {
					user_id:rows[0].id,					
					jwtToken:jwtToken,
					refreshToken:refreshToken
				}
				var query = "UPDATE accounts SET jwtToken = ?, refreshToken = ? WHERE id = ?";
				var table = [jwtToken,  refreshToken, data.user_id ];
				query = mysql.format(query,table);
				connection.query(query, data, function(err,rows){
					if(err) {
						res.json({"Error" : true, "Message" : "Error executing MySQL query"});
					} else {
						res.json({
							//success: true,
							//message: 'Token generated',
							currUser: data.user_id,
							jwtToken: jwtToken,
							refreshToken: refreshToken							
						});
						
						
           				 } // return info including jwtToken
           				});
			}
			else {
				res.json({"Error" : true, "Message" : "wrong email/fireToken combination"});
			}

		}
	});
}

module.exports = userLoginCheck;

