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


var getTags = async function(req, res, next){	

 var tagname = req.body.tagname;
 var tagid = "";
 var audioid = ""; 
 
let row_a, row_b, row_c;

const db = makeDb( config )

try {
	
    row_a = await db.query( 'SELECT tagid FROM tags WHERE tagname = ?', [tagname]);
    const tagid = row_a[0].tagid;	
	console.log('tagid = ' + tagid);
	
	if (row_a) {
		console.log('rowa is bigger than zero and tagname exists');
		  row_b = await db.query( 'SELECT audioid FROM entitytag WHERE tagid1 OR tagid2 OR tagid3 = ?',[tagid] );		
	
	if(row_b){
		
	console.log('audioid exists in entitytag');
    const audioid = row_b[0].audioid;	
	console.log('audioid = ' + audioid);	
	
		
	row_c = await db.query( `
SELECT 
    ap.audioname, 
    ap.userid, 
    ap.audioid, 
    ap.title, 
    ap.likes, 
    u.gavatar,  
    u.name, 
    u.email,   
    t1.tagname as tag1,    
    t2.tagname as tag2,   
    t3.tagname as tag3
FROM 
    audioposts ap 
LEFT JOIN 
    accounts u ON u.id = ap.userid 
LEFT JOIN
    entitytag et ON et.audioid = ap.audioid
LEFT JOIN
    tags t1 ON et.tagid1 = t1.tagid
LEFT JOIN
    tags t2 ON et.tagid2 = t2.tagid
LEFT JOIN
    tags t3 ON et.tagid3 = t3.tagid

WHERE ap.audioid = ?`, [audioid ]);
	
	console.log('success!');
	res.json(row_c);		
	} else {
	console.log('audioid doesnt exist');
	res.json({"message":"audioid doesn't exist in any audioposts"});
	}		
	} else {
	console.log('tagname doesnt exist');
	res.json({"message":"tagname doesn't exist"});
	}
 
	}	
  
catch(err) {
    console.log(err.message);
}
finally {
    db.close();
}
}

 module.exports = getTags;