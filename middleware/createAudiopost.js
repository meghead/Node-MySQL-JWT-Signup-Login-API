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


var createAudiopost = async function(req, res, next){	

 var title = req.body.title;
 var userid = req.body.userid;
 var opid = req.body.opid; 
 var tag1 = req.body.tag1;
 var tag2 = req.body.tag2;
 var tag3 = req.body.tag3;
 
let row_a, row_b, row_c, row_d, row_e, row_f;

const db = makeDb( config )

try {
	
    row_a = await db.query( 'INSERT INTO audioposts (title,userid,opid) VALUES (?,?,? )', [title,userid,opid]);
    var newid = row_a.insertId;	
	console.log('newid = ' + newid);
    var audioname = userid + '-' + newid  + '.m4a';	
	console.log('audioname = ' + audioname);

    row_b = await db.query( 'UPDATE audioposts SET audioname = ? WHERE audioid = ?',[audioname , newid ] );		
	
	if(tag1){
		
		console.log('tag1 exists');		
		
	row_c = await db.query( 'SELECT tagid FROM tags WHERE tagname = ?', [tag1] );
	
	console.log('row_c.length = '+ row_c.length);
	
	if (row_c.length > 0){	
	console.log('row_c.tagid exists ');
	const tagid1 = row_c[0].tagid;
	console.log('tagid1 = ' + tagid1);
	row_f = await db.query("INSERT INTO entitytag  (audioid, tagid, userid)  VALUES (?,?,?)", [newid, tagid1, userid ]);
    var entityinsert = 	row_f.insertId ;
	console.log('entityinsertid = ' + entityinsert);
		
	} else {	
	row_d = await db.query( 'INSERT IGNORE INTO tags (tagname) VALUES (?)', [tag1]);	
    const tagInsertId = row_d.insertId;	
	console.log('tagInsertId = ' + tagInsertId);
	row_e = db.query('INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?', [newid, tagInsertId, userid ]);
	}
		
	}
	if(tag2){
		
		console.log('tag2 exists');		
		
	row_c = await db.query( 'SELECT tagid FROM tags WHERE tagname = ?', [tag2] );
	
	console.log('row_c.length = '+ row_c.length);
	
	if (row_c.length > 0){	
	console.log('row_c.tagid exists ');
	const tagid2 = row_c[0].tagid;
	console.log('tagid2 = ' + tagid2);
	row_f = await db.query("INSERT INTO entitytag  (audioid, tagid, userid)  VALUES (?,?,?)", [newid, tagid2, userid ]);
    var entityinsert = 	row_f.insertId ;
	console.log('entityinsertid = ' + entityinsert);
		
	} else {	
	row_d = await db.query( 'INSERT IGNORE INTO tags (tagname) VALUES (?)', [tag2]);	
    const tag2InsertId = row_d.insertId;	
	console.log('tag2InsertId = ' + tag2InsertId);
	row_e = db.query('INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?', [newid, tag2InsertId, userid ]);
	}
		
	}
	
	if(tag3){
		
		console.log('tag3 exists');		
		
	row_c = await db.query( 'SELECT tagid FROM tags WHERE tagname = ?', [tag3] );
	
	console.log('row_c.length = '+ row_c.length);
	
	if (row_c.length > 0){	
	console.log('row_c.tagid exists ');
	const tagid3 = row_c[0].tagid;
	console.log('tagid3 = ' + tagid3);
	row_f = await db.query("INSERT INTO entitytag  (audioid, tagid, userid)  VALUES (?,?,?)", [newid, tagid3, userid ]);
    var entityinsert = 	row_f.insertId ;
	console.log('entityinsertid = ' + entityinsert);
		
	} else {	
	row_d = await db.query( 'INSERT IGNORE INTO tags (tagname) VALUES (?)', [tag3]);	
    const tag3InsertId = row_d.insertId;	
	console.log('tag3InsertId = ' + tag3InsertId);
	row_e = db.query('INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?', [newid, tag3InsertId, userid ]);
	}
		
	}
	
	console.log('success!');
				 res.json(newid);	
}
	
    
	
  
catch(err) {
    console.log(err.message);
}
finally {
    db.close();
}
}

 module.exports = createAudiopost;