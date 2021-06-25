var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
var jwt = require('jsonwebtoken'); 
var config = require('../config');
var connection = require("../database"); 

var userLoginCheck = function (req, res) {
	var hashedpassword = md5(req.body.password);
	var post  = {
		email:req.body.email,
		password: hashedpassword		
	}
	var query = "SELECT ??, ??, ?? FROM ?? WHERE ??=? AND ??=?";
	var table = ["email","id","name","accounts","password", post.password, "email", post.email];
	query = mysql.format(query,table);
	
	connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		} else {

			if(rows.length==1){
				var jwtToken = jwt.sign(rows, config.secret, {expiresIn: '1h'});
				var refreshToken = jwt.sign(rows, config.refreshsecret, { expiresIn: '30d' });
				var userid= rows[0].id;
				const response = {
										"status": "Logged in",
										"jwtToken": jwtToken,
										"refreshToken": refreshToken,
										"userid": userid
									};
   
				res.json(
				  response
				);				
			} else {
				res.json({"Error" : true, "Message" : "wrong email/password combination"});
			}
		}
	});	
}

module.exports = userLoginCheck;