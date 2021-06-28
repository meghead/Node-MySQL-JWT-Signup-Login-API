
var mysql   = require("mysql");
var express = require("express");
var connection = require("../database");


 var createAudiopost = function(req, res, next){
	 
 var title = req.body.title;
 var userid = req.body.userid;
 var opid = req.body.opid; 
  var tag1 = req.body.tag1;
	 
connection.beginTransaction(function(err) {
  if (err) { throw err; }
  
	connection.query('INSERT INTO ?? (title,userid,opid) VALUES (?, ?, ? )', ['audioposts',title,userid,opid], function(err, result) {
     if (err) { 
      connection.rollback(function() {
        throw err;
      });
    }

    var audioname = userid + '-' + result.insertId + '.m4a';
	var newid = result.insertId;	
	console.log("newid: "  , newid  );
	
	connection.query('UPDATE ?? SET audioname=? WHERE audioid = ?',  ['audioposts',audioname,newid], function (error, result, fields) {
      if (err) { 
        connection.rollback(function() {
          throw err;
        });
      }  
	  
	  if (tag1)  {	
		connection.query('SELECT tagid FROM tags WHERE tagname = ?', [tag1], function (error, result, fields) {
					
				  if (err) { 
					connection.rollback(function() {
					  throw err;
					});
							}							
							const tagid1 = result[0].tagid;
		if (result < 1) {	

			connection.query('INSERT INTO tags SET tagname = ?', [tag1], function (error, result, fields) {
					  if (err) { 
					connection.rollback(function() {
						  throw err;
							});
								} 	
								
						console.log("lets see this ridiculous result", result);
															
						const tagInsertId = result.insertId;	
						//console.log("taginsertId: ", tagInsertId);
						
						//connection.query("INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?", [newid, tagid1, userId], function (error, result, fields)  {
						
			    connection.query("INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?", [newid, tagInsertId, userid], function (error, result, fields) {
					  if (err) { 
						connection.rollback(function() {
						  throw err;
							});
							  }	 

				connection.commit(function(err) {
				if (err) { 
				  connection.rollback(function() {
					throw err;
				  });
				}
				 console.log('success!');
				 newid = result.insertId;
				 res.json({
								"title" : title, 
								"userid" : userid,
								"opid" : opid, 
								"insertid": newid
						});	//resjson success				
					}); //commit			  
			    }); // insert entitytags
	        }); // insert tags 			
	      } // if row
		  
		  else {											
				connection.query("INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?", [newid, tagid1, userid], function (error, result, fields) {			  
			  if (err) { 
				connection.rollback(function() {
				  throw err;
						}); //err
						} //err	

				connection.commit(function(err) {
				if (err) { 
				  connection.rollback(function() {
					throw err;
				  });
				}
				 console.log('success!');
				 res.json({
								"title" : title, 
								"userid" : userid,
								"opid" : opid, 
								"insertid": newid,
								"tag1": tag1
						});	//resjson success				
			  }); //commit	
			})	// insert entitytag2
		  }
	    }); //select tagid
      }//tag1
    }); //update
  }); //insert
}); //begin transaction
}	//createaudiopost
   module.exports = createAudiopost;


