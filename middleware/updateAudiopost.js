const util = require( 'util' );
const mysql = require( 'mysql' );

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


var updateAudiopost = async function(req, res, next){	

 var title = req.body.title;
 var audioid = req.body.audioid;
 var userid = req.body.userid;
 var tag1 = req.body.tag1;
 var tag2 = req.body.tag2;
 var tag3 = req.body.tag3;

 
let row_a, row_b, row_c, row_d, row_e, row_f;

const db = makeDb( config )

try {
	
	if(title) {
		row_a = await db.query( "UPDATE audioposts SET title= ? WHERE audioid=?", [title,audioid]);
	}    
	
	
	if(tag1){		//if tag 1 exists in post
	row_b = await db.query( 'SELECT tagid FROM tags WHERE tagname = ?', [tag1] );	// check tag1 exists in tag table
	if (row_b.length > 0){	// if tag1 exists in tag table
	const tagid1 = row_b[0].tagid; /// then create variable from the tagid
	row_c = await db.query("SELECT etid FROM entitytag WHERE userid = ? AND tagid1 = ?", [userid, tagid1]); //check for if user has tag1 id  
	    if (row_c.length > 0)	{ // if user has tag1 
	var etid1 = row_c[0].etid; // create a variable for tag1 in entitytag table
	row_d = await db.query("UPDATE entitytag SET tagid1 = ? WHERE etid =?", [tagid1, etid1]);	//update that row of the entitytag with new tagid1 
	}
	else {
	row_e = await db.query("INSERT INTO entitytag  (audioid, tagid1, userid)  VALUES (?,?,?)", [audioid, tagid1, userid ]);	
	var entityinsert = 	row_e.insertId ;
	}    
	 }	 
	 else {		 
	row_f = await db.query( 'INSERT IGNORE INTO tags (tagname) VALUES (?)', [tag1]);	
    const tagInsertId = row_f.insertId;	
	row_g = db.query('INSERT INTO entitytag SET audioid = ?, tagid1 = ?, userid = ?', [audioid, tagInsertId, userid ]); 
	 }	
	console.log('success!');
	res.json(audioid);	
 }		
}
  
catch(err) {
    console.log(err.message);
}
finally {
    db.close();
}
}

 module.exports = updateAudiopost;