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


var passwordCheck = async function(req, res, next){

 var userid = req.body.userid;
 var checkpassword = md5(req.body.password); 
 
let row_a ;

const db = makeDb( config )

try {
	
	row_a = await db.query( "SELECT password FROM accounts WHERE id=?", [userid]);	

    if (row_a != 0) {
		
		var password = row_a[0].password;       
		
        if 	(checkpassword == password) {
		 console.log('true');
		 res.json({"status" : "true"}); 
			
		 
		} else {
			
		console.log("false");
		 res.json({"status" : "false"}); 
		 
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

 module.exports = passwordCheck;