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


var updatePassword = async function(req, res, next){

 var userid = req.body.userid;
 var hashedpassword = md5(req.body.password);
 var password = hashedpassword;
 
 
let row_a ;

const db = makeDb( config )

try {
	
	row_a = await db.query( "UPDATE accounts SET password= ? WHERE id=?", [password, userid]);	

    if (row_a != 0) {
		console.log("Success! Password updated");
		 res.json({"status" : "Success! Password updated"}); 
	 }	else {
		 console.log('failure');
		 res.json({"status" : "Failure! Password NOT updated"}); 
	 }
			
	}
  
catch(err) {
    console.log(err.message);
}
finally {
    db.close();
}
}

 module.exports = updatePassword;