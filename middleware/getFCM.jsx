var mysql   = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var getFCM = function (req, res) {
	
	const bodyuserid = req.body.id;

	var query = "SELECT ?? FROM ?? WHERE userid = ? "; 
	var table = ['audioid', 'subscribe', bodyuserid];
	query = mysql.format(query,table);	

    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {	
			var n=0;
			var thislength = rows.length; 			
			var newaudioid = rows[n].audioid; //144 and 147	
			var query = `SELECT ap.audioid, ap.title, us.name FROM audioposts ap INNER JOIN audioposts a2 ON a2.audioid = ap.opid INNER JOIN accounts us ON us.id = a2.userid WHERE ap.opid = ? AND ap.opid <> 0` ;
			var table = [newaudioid];//result op:144 = 147, op 147 = 148, 157			
			query = mysql.format(query, table);
			
			while(n < thislength)	{
				
			console.log('n = ' + n);			 
					
			connection.query(query,function(err,data){
				if(err) {res.json({"Error" : true, "Message" : "Error executing MySQL query"});} else 
				{console.log(data);
					//res.json(data);
					}
					
				});	
			     n++;											
			}			
					

            
	        }
    });
};
module.exports = getFCM;