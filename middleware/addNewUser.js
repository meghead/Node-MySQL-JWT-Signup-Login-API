
var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
var connection = require("../database");


 var addNewUser = function(req,res, next){
 	var date = new Date();
	var hashedpassword = md5(req.body.password)
    var post  = {
      name:req.body.name,
      email:req.body.email,
	  gavatar:req.body.gavatar, 
	  password: hashedpassword,	
      fireToken:req.body.fireToken      
  };
  console.log(post);
  		var query = "SELECT email, id FROM ?? WHERE ??=?";
		var table = ['accounts', 'email', post.email];
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
					
					var ugavatar = data.insertId + '-user.jpg';
					var userid = data.insertId;				
					connection.query('UPDATE ??SET ?? = ? WHERE ?? = ?',
					['accounts','gavatar',ugavatar,'id',userid], 
					function(err, rows, fields) 
					{
					if (err) throw err;
					});											
		res.json({
						"name" : post.name, 
						"email" : post.email,
						"gavatar" : ugavatar, 
						"insertid": userid
						});					
				}
			});

		}
		else{
			
			var fetchedId = rows[0].id;
			var jwtToken = rows[0].jwtToken;
			var refreshToken = rows[0].refreshToken;
						
			res.json({	
						"Message" : "Email already registered",
						"fetchedId": fetchedId,
						"jwtToken": jwtToken,
						"refreshToken": refreshToken						
					});			
		}
		}
    });
	}

   module.exports = addNewUser;


