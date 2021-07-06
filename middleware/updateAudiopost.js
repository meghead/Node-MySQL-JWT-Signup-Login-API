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


var updateAudiopost = async function(req, res, next){	

 var title = req.body.title;
 var audioid = req.body.audioid;
 var userid = req.body.userid;
 var tag1 = req.body.tag1;
 var tag2 = req.body.tag2;
 var tag3 = req.body.tag3;

 
let row_a, row_b, row_c, row_d, row_e, row_f, row_g, row_h, row_i, row_j, row_k, row_l, row_m, row_n, row_o, row_p, row_q, row_r, row_s ;

const db = makeDb( config )

try {
	
	if(title) {
		row_a = await db.query( "UPDATE audioposts SET title= ? WHERE audioid=?", [title, audioid]);
	}    
	
	
	if(tag1){	
	
	row_c = await db.query( "SELECT tagid FROM tags WHERE tagname = ?", [tag1]);	
	
	if (row_c.length > 0){	
	console.log('tag exists in database ');
	const tagid1 = row_c[0].tagid;
	console.log('tagid1 = ' + tagid1);
	row_f = await db.query("INSERT INTO entitytag (tagid1, audioid) VALUES (?,?) ON DUPLICATE KEY UPDATE tagid1 = ?", [tagid1, audioid, tagid1 ]);
 	} else {
     console.log('tag does not exist in database ');		
	row_d = await db.query( 'INSERT IGNORE INTO tags (tagname) VALUES (?)', [tag1]);	
    const tagInsertId = row_d.insertId;	
	console.log('tagInsertId = ' + tagInsertId);
	row_e = db.query('INSERT INTO entitytag (tagid1, audioid) VALUES (?,?) ON DUPLICATE KEY UPDATE tagid1 = ?', [tagInsertId, audioid, tagInsertId ]);
	}	
	}
     console.log('success!');
	 res.json(tag1);	
	}
  
catch(err) {
    console.log(err.message);
}
finally {
    db.close();
}
}

 module.exports = updateAudiopost;