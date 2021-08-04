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

 var addNewUser = async function(req,res, next){
 	var date = new Date();
	var hashedpassword = md5(req.body.password);
    var name = req.body.name;
    var email = req.body.email;
	var password = hashedpassword;	
    var fireToken = req.body.fireToken;   
 
let row_a, row_b, row_c, row_d, row_e, row_f;

const db = makeDb( config )

try {	
	
	row_a = await db.query( 'SELECT * FROM ?? WHERE ?? = ?', ['accounts', 'email', email]);
	if(row_a == 0) {
		row_b = await db.query( 'INSERT INTO ?? (name, email, password, fireToken) VALUES (?, ?, ?, ?)', ['accounts', name, email, password, fireToken]);	
        if(row_b != 0) {
			console.log('row_b inserted');
			const ugavatar  = row_b.insertId + '-user.jpg';
			console.log('ugavatar = ' + ugavatar);
			const userid = row_b.insertId;
			row_c = await db.query( 'UPDATE ?? SET ?? = ? WHERE ?? = ?', ['accounts','gavatar', ugavatar,'id', userid]);
				res.json({
						"name" : name, 
						"email" : email,
						"gavatar" : ugavatar, 
						"userid": userid,
						"role" : 'user',
						"Message" : "signup success"
						});				
						}
					} 
		else{
			
			const fetchedId = row_a[0].id;
			const name = row_a[0].name;
			const gavatar = row_a[0].gavatar;
			const email =row_a[0].email;
			const role = row_a[0].role;
			const bio = row_a[0].bio;
			const postcount = row_a[0].postcount;
			const modpoints = row_a[0].modpoints;
								
			res.json({	
						"Message" : "Email already registered",
						"userid": fetchedId,
						"name" : name, 
						"email" : email,
						"gavatar" : gavatar,
						"role" : role,	
						"bio" : bio,
						"postcount" : postcount,
						"modpoints" : modpoints
					});			
		}
		  }
catch(err) {
    console.log(err.message);
           }
finally {
    db.close();
        }
 
 };
  		   module.exports = addNewUser;


