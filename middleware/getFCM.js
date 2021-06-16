var mysql   = require("mysql");
var express = require("express");
var config = require('../config');
var connection = require("../database");

var getFCM = function (req, res) {
    const bodyuserid = req.body.id;
	
    var sql = `
    SELECT ??, ??, ?? FROM audioposts ap                   
	INNER JOIN audioposts a2 ON a2.audioid = ap.opid
	INNER JOIN subscribe s ON s.audioid = ap.opid
	INNER JOIN accounts us ON us.id = a2.userid 
	WHERE s.userid = ? 
	`;	
    var table = ['ap.audioid','ap.title','us.name', bodyuserid];
    sql = mysql.format(sql, table);	
	 
	
	connection.query(sql, function(err, results){
        if (!err) {	
			
            console.log({results});
			res.json(results);

        }   else{
            console.log('Error while performing query.');
            console.log(err);
        }
    });             
            	
		}	


module.exports = getFCM;