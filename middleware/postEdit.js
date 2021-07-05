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
    (
        SELECT GROUP_CONCAT(t.tagname)
        FROM entitytag et
        LEFT JOIN tags t on t.tagid = et.tagid
        WHERE et.audioid = ap.audioid
    ) tagname,
    (
      SELECT count(*) FROM audioposts op WHERE op.opid = ap.audioid
    ) as replycount
		FROM audioposts ap 
		LEFT JOIN accounts ac ON ac.id = ap.userid
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