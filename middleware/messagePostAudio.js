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

var messagePostAudio = async function (req, res) {
	
	let row_a, row_b ;
	const db = makeDb( config );
	const sender = req.body.sender;	
	const receiver = req.body.receiver;
	const opid = req.body.opid;
	
	try {	
	
	row_a = await db.query( `INSERT INTO messages (sender, receiver, opid) VALUES (?,?,?) `, [sender, receiver, opid]);	

    if (row_a != 0) {
		
		console.log('Inserted');
    
     const audioid = row_a.insertId;
     const audiourl = sender + "-m-" + receiver + "-" + audioid + ".m4a";	
	 
	 console.log(audiourl);
	
	 row_b = await db.query (`UPDATE messages SET audiourl = ?  WHERE audioid = ?` , [audiourl, audioid]);	

	if 	(row_b != 0) {
	console.log('Updated');
	
	//const audiourl = row_a.audiourl;
		
	console.log(audiourl);
	 res.json(audiourl);
		
	}  else {
	console.log('Failed');
	res.json({
		 "message" : 'Failed'	
		});	
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

module.exports = messagePostAudio;