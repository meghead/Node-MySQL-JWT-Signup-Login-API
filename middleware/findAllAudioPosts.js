
var mysql   = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var findAllAudioPosts = function (req, res) {

	var query = `

     SELECT 
    ap.audioname, 
    ap.userid, 
    ap.audioid, 
    ap.title, 
    ap.likes, 
    u.gavatar,  
    u.name, 
    u.email,   
    t1.tagname as tag1,    
    t2.tagname as tag2,   
    t3.tagname as tag3,
	(
      SELECT count(*) FROM audioposts op WHERE op.opid = ap.audioid
    ) as replycount
	FROM 
    audioposts ap      	
	LEFT JOIN 
    accounts u ON u.id = ap.userid 
    LEFT JOIN
    entitytag et ON et.audioid = ap.audioid
	LEFT JOIN
    tags t1 ON et.tagid1 = t1.tagid
	LEFT JOIN
    tags t2 ON et.tagid2 = t2.tagid
	LEFT JOIN
    tags t3 ON et.tagid3 = t3.tagid	
    WHERE ap.opid = "0"`;	
		

    query = mysql.format(query);

    connection.query(query,function(err,data){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
			/*const data = {"data": [{"audioname":"mytalk.m4a","name":"Josie ","email":"josie@gmail.com"}, {"audioname":"mytalk40.m4a","name":"Jessie James","email":"jesse@gmail.com"}, {"audioname":"mytalk.m4a","name":"Joan Bologney","email":"joan@gmail.com"} ] };*/
			
            console.log(data);
            res.json(data);
	        }
    });
};
module.exports = findAllAudioPosts;