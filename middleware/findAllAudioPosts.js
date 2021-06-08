
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
      WHERE ap.opid = '0'		
	`	

    //var table = ["audioposts ap"];

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