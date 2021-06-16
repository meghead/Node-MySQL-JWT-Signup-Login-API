var mysql   = require("mysql");
var express = require("express");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var connection = require("../database");

var getSingle = function (req, res) {
	
	const bodyuserid = req.body.id;

	var query = "SELECT * FROM ?? WHERE ?? = ? ";
	var table = ['audioposts', 'audioid', bodyuserid];
	query = mysql.format(query,table);	

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
module.exports = getSingle;