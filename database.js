var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'appspeako2',
    password : 'fuzzybearjones',
    database : 'appspeako2',
    debug    :  true,
	multipleStatements: true
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;