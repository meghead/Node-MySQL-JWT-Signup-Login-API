var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
var connection = require("../database");


 var anonymousUser = function(req,res, next){
 	var date = new Date();
    var post  = {
      token:req.body.token      
  };
  console.log(post);
  		var query = "SELECT token FROM ?? WHERE ??=?";
		var table = ["anonymous", "token", post.token];
		query = mysql.format(query,table);
		connection.query(query,function(err,rows){
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		}
		else {

		if(rows.length==0){

			var query = "INSERT INTO  ?? SET  ?";
			var table = ["anonymous"];
			query = mysql.format(query,table);
			connection.query(query, post, function(err,rows){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				} else {
					res.json({"Error" : false, "Message" : "Success"});
				}
			});

		}
		else{
			res.json({"Error" : false, "Message" : "Password already exists"});
		}
		}
    });
	}

   module.exports = anonymousUser;


