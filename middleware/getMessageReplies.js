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

var getMessageReplies = async function (req, res) {
	
	let row_a ;
	const db = makeDb( config );
	const audioid = req.body.audioid;
	
	try {	
	
	row_a = await db.query( `
	SELECT
    m.audiourl, 
    m.receiver, 
    m.audioid, 
    m.sender,
    m.opid,	
	m.timestamp,
	ac.gavatar, 
    ac.name,
    ac.bio,	
	(
      SELECT count(*) FROM messages m WHERE m.opid = m.audioid
    ) as replycount
    FROM messages m 
	LEFT JOIN accounts ac ON ac.id = m.sender  
	WHERE m.opid = ?
	ORDER BY m.audioid DESC
	`, [audioid]);	

    if (row_a != 0) {	

     console.log('Got conversation');
	 res.json({
		 row_a
		});       		
	} else {
	console.log('None');
	res.json({
		 "message" : 'None'	
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

module.exports = getMessageReplies;