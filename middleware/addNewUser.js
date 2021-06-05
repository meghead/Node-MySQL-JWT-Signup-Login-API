
var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
var connection = require("../database");


 var addNewUser = function(req,res, next){
 	var date = new Date();
    var post  = {
      name:req.body.name,
      email:req.body.email,
	  gavatar:req.body.gavatar,      
      fireToken:req.body.fireToken      
  };
  console.log(post);
  		var query = "SELECT email FROM ?? WHERE ??=?";
		var table = ["accounts", "email", post.email];
		query = mysql.format(query,table);
		connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		}
		else {

		if(rows.length==0){

			var query = "INSERT INTO  ?? SET  ?";
			var table = ["accounts"];
			query = mysql.format(query,table);
			connection.query(query, post, function(err, data){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				} else {
					//res.json({"Error" : false, "Message" : "Success"});
					//res.send(data);
					res.json({
						"name" : post.name, 
						"email" : post.email,
						"gavatar" : post.gavatar, 
						"insertid": data.insertId
						});
				}
			});

		}
		else{
			res.json({"Error" : false, "Message" : "Email already registered"});
		}
		}
    });
	}

   module.exports = addNewUser;


