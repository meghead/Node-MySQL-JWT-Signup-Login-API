var md5 = require("MD5");
const util = require( 'util' );
const mysql = require( 'mysql2' );

const config = {
    host     : 'localhost',
    user     : 'appspeako2',
    password : 'fuzzybearjones',
    database: 'appspeako2'
};

function makeDb( config ) {
  const connection = mysql.createConnection( config );  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}


var checkPassword = async function(req, res, next){

 var userid = req.body.userid;
 var fireToken = req.body.fireToken; 
 
let row_a ;

const db = makeDb( config )

try {
	
	row_a = await db.query( "SELECT password FROM accounts WHERE id=?", [userid]);	

    if (row_a != 0) {
		
		var password = row_a[0].password;		
        var firepassword = 	fireToken;
		var length = 16;
		var trimmedfireToken = firepassword .substring(0, 16);
		var hashedfiretoken = md5(trimmedfireToken); 
		
        if 	(hashedfiretoken == password) {
		 console.log('FireToken Password');
		 res.json({"status" : "FireToken Password"}); 
			
		 
		} else {
			
		console.log("Password Exists");
		 res.json({"status" : "Password Exists"}); 
		 
		}			
	}
}
  
catch(err) {
    console.log(err.message);
}
finally {
    db.close();
}
}

 module.exports = checkPassword;