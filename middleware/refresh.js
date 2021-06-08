var mysql   = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); 
var md5 = require("MD5");
var config = require('../config');
var connection = require("../database");

var refresh = function (req, res) {

    var bodyemail = req.body.email;  
	var bodyrefreshToken = req.body.refreshToken;
	var bodypassword = req.body.password;
	var query = "SELECT ?? FROM ?? WHERE ??=?";
	var table = ["refreshToken", "accounts", "email", bodyemail];
	query = mysql.format(query,table);

	connection.query(query,function(err, data){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		}
		else {
			
			if (data.refreshToken == bodyrefreshToken){
				
		const user = {
        "email": bodyemail,
        "password": md5(bodypassword)
        }
        const token = jwt.sign(user, config.secret, { expiresIn: '1h'})
        const response = {
            "token": token,
        }
		var query = "INSERT INTO accounts SET  jwtToken =?";
		var table = [ token ];
		query = mysql.format(query,table);
		
		connection.query(query,function(err,data){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		}else {
			res.json({
				"jwtToken": token
			});
			}	
		})		
			}
		}
	});
}

module.exports = refresh;

