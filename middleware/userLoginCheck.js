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
	var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
	var table = ["accounts","password", post.password, "email", post.email];
	query = mysql.format(query,table);
	
	connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		} else {

			if(rows.length==1){
				var jwtToken = jwt.sign(rows, config.secret, {expiresIn: '1h'});
				var refreshToken = jwt.sign(rows, config.refreshsecret, { expiresIn: '30d' });
				var userid= rows[0].id;
				var name= rows[0].name;
				var gavatar= rows[0].gavatar;
				var email= rows[0].email;
				var role= rows[0].role;
				var bio= rows[0].bio;
				var postcount= rows[0].postcount;
				var modpoint= rows[0].modpoint;
				const response = {
										"status": "Logged in",
										"jwtToken": jwtToken,
										"refreshToken": refreshToken,
										"userid": userid,
										"name": name,
										"gavatar": gavatar,
										"email": email,
										"role": role,
										"bio": bio,	
										"postcount": postcount,
										"modpoint": modpoint
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