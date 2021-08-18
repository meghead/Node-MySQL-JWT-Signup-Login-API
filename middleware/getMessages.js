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

var getMessages = async function (req, res) {
	
	let row_a ;
	const db = makeDb( config );
	const userid = req.body.userid;	
	
	try {	
	
	row_a = await db.query( `
	SELECT
    m.audiourl, 
    m.receiver, 
    m.audioid, 
    m.sender,
    m.timestamp, 	
	ac.gavatar, 
    ac.name 
	FROM messages m 
	LEFT JOIN accounts ac ON ac.id = m.sender
	WHERE m.receiver = ? 
	ORDER BY m.audioid DESC
	`, [userid]);	

    if (row_a != 0) {	

    const audiourl = row_a[0].audiourl;
	const receiver = row_a[0].receiver;
	const audioid = row_a[0].audioid;
	const sender = row_a[0].sender;
	const gavatar = row_a[0].gavatar;
	const name = row_a[0].name;
	const timestamp = row_a[0].timestamp;

     console.log('Got messages');
	 res.json(
		row_a
		);       		
	} else {
	console.log('None');
	res.json({
		 "message" : "None"		
		});	
	}
}
  
catch(err) {
    console.log(err.message);
}
finally {
    db.close();
}
}

module.exports = getMessages;