var mysql   = require("mysql");
var express = require("express");
var md5 = require("MD5");
var connection = require("../database");

 var addNewUser = function(req,res, next){
 	var date = new Date();
	var hashedpassword = md5(req.body.password);
    var post  = {
      name:req.body.name,
      email:req.body.email,
	  gavatar:req.body.gavatar, 
	  password: hashedpassword,	
      fireToken:req.body.fireToken      
  };
  console.log(post);
  
  		var query = "SELECT * FROM ?? WHERE ??=?";
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
					['accounts','gavatar', ugavatar,'id',userid], 
					function(err, rows, fields) 
					{
					if (err) throw err;
					});											
		res.json({
						"name" : post.name, 
						"email" : post.email,
						"gavatar" : ugavatar, 
						"userid": userid,
						"role" : role,
						"Message" : "signup success"
						});					
				}
			});

		}else{
			
			var fetchedId = rows[0].id;
			var name = rows[0].name;
			var gavatar = rows[0].gavatar;
			var email = rows[0].email;
			var role = rows[0].role;
			var bio = rows[0].bio;
			var postcount = rows[0].postcount;
			var modpoints = rows[0].modpoints;
								
			res.json({	
						"Message" : "Email already registered",
						"userid": fetchedId,
						"name" : name, 
						"email" : email,
						"gavatar" : gavatar,
						"role" : role,	
						"bio" : bio,
						"postcount" : postcount,
						"modpoints" : modpoints
					});			
			}
		}
    });	
	}

   module.exports = addNewUser;


