
var mysql   = require("mysql");
var express = require("express");
var connection = require("../database");


 var createAudiopost = function(req, res, next){
	 
 var title = req.body.title;
 var userid = req.body.userid;
 var opid = req.body.opid; 
	 
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
	
	
	var query = 'UPDATE audioposts SET audioname = ? WHERE audioid = 438';
	var table = [audioname, newid];
	query = mysql.format(query);

    connection.query('UPDATE audioposts SET audioname=? WHERE audioid = ?',  [audioname,newid], function (error, results, fields) {
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
		 res.json({
						"title" : title, 
						"userid" : userid,
						"opid" : opid, 
						"insertid": newid
						});	
		//res.json(result);
      });
    });
  });
});
}	
   module.exports = createAudiopost;


