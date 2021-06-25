
var mysql   = require("mysql");
var express = require("express");
var connection = require("../database");


 var createAudiopost = function(req,res, next){
	 
 var title = req.body.title;
 var userid = req.body.userid;
 var opid = req.body.opid;  

  console.log(post);
	
			var query = "START TRANSACTION; INSERT INTO audioposts (title) VALUES ('Crazy Delivery'); COMMIT;"; 
			//var table = [title, userid, opid];
			//query = mysql.format(query);
			connection.query(query, function(err, data){
				if(err) {
					res.json({"Error" : true, "Message" : "Error executing MySQL query"});
				} else {														
		res.json({data});					
				}
			});	

}	
   module.exports = createAudiopost;


