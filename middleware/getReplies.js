var mysql   = require("mysql");
var express = require("express");
var config = require('../config');
var connection = require("../database");

var getReplies = function (req, res) {
	
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
	u.gavatar, 
    u.name, 
    u.email,
       (
        SELECT GROUP_CONCAT(t.tagname)
        FROM entitytag et
        LEFT JOIN tags t on t.tagid = et.tagid
        WHERE et.audioid = ap.audioid
    ) tagname,
    (
      select count(*) from audioposts AS apost WHERE apost.opid = ap.audioid
    ) as replycount
FROM audioposts ap 
LEFT JOIN users u ON u.id = ap.userid
WHERE ap.opid = ?	
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
module.exports = getReplies;