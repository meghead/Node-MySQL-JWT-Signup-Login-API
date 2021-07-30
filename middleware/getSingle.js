var mysql   = require("mysql");
var express = require("express");
var config = require('../config');
var connection = require("../database");

var getSingle = function (req, res) {
	
	const bodyuserid = req.body.id;

	//var query = "SELECT * FROM ?? WHERE ?? = ? ";
	
	var query = `
	
	SELECT
    ap.audioname, 
    ap.userid, 
    ap.audioid, 
    ap.title, 
    ap.likes,
	ap.opid,
	ac.gavatar, 
    ac.name, 
    ac.email,
	ac.bio,
	t1.tagname as tag1,    
    t2.tagname as tag2,   
    t3.tagname as tag3,
    
    (
      SELECT count(*) FROM audioposts op WHERE op.opid = ap.audioid
    ) as replycount
		FROM audioposts ap 
		LEFT JOIN accounts ac ON ac.id = ap.userid
		LEFT JOIN entitytag et ON et.audioid = ap.audioid
		LEFT JOIN tags t1 ON et.tagid1 = t1.tagid
		LEFT JOIN tags t2 ON et.tagid2 = t2.tagid
		LEFT JOIN tags t3 ON et.tagid3 = t3.tagid	
		WHERE ap.audioid = ?		
	`	;
	
	var table = [bodyuserid];
	query = mysql.format(query, table);	

    connection.query(query,function(err,data){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {			
            console.log(data);
            res.json(data);
	        }
    });
};
module.exports = getSingle;