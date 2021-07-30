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
 var password = req.body.password;
 
let row_a ;

const db = makeDb( config )

try {
	
	row_a = await db.query( "UPDATE accounts SET password= ? WHERE id=?", [password, userid]);	

    if (response.statusCode !== 200) {
		 res.json({"status" : "Success! Password created"}); 
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