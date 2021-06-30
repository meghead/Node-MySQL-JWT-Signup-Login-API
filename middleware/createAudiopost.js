const mysql = require( 'mysql' );

let config = {
    host     : 'localhost',
    user     : 'appspeako2',
    password : 'fuzzybearjones',
    database: 'appspeako2'
};

class DataBase {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
     query( sql, args ) {
        let that = this;
        return new Promise( function ( resolve, reject ) {
            that.database.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        });
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.database.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

const mydb = new DataBase(config);


var createAudiopost = async function(req, res, next){
	

 var title = req.body.title;
 var userid = req.body.userid;
 var opid = req.body.opid; 
 var tag1 = req.body.tag1;
 var tag2 = req.body.tag2;
 var tag3 = req.body.tag3;
 
let row_a, row_b, row_c, row_d, row_e, row_f;

try {

	console.log('before program');
    row_a = await mydb.query( 'INSERT INTO audioposts (title,userid,opid) VALUES (?,?,? )', [title,userid,opid]);
	console.log('after query 1');
     
    
    var newid = row_a[0].insertId;
	console.log('newid = ' + newid);
    var audioname = userid + '-' + newid  + '.m4a';	
	
	console.log('audioname = ' + audioname + ' and newid = ' + newid);

    rows_b = await mydb.query( 'UPDATE audioposts SET audioname=?? WHERE audioid = ?',[audioname , newid ] );

    rows_c = await mydb.query( 'SELECT tagid FROM tags WHERE tagname = ?', [tag1] );
    const tagid1 = row_c[0]['tagid'];

    rows_d = mydb.query( 'INSERT INTO tags SET tagname = ? ',[tag1] );
    const tagInsertId = row_d[0].insertId;

    //your condition
    if(tagInsertId) {
        rows_e = await mydb.query( 'INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?', [newid, tagInsertId, userid ] );    
    }
    else {
        rows_f = mydb.query('INSERT INTO entitytag SET audioid = ?, tagid = ?, userid = ?', [newid, tagid1, userid]);
    }
    console.log("success");
    res.json({
                    "title" : title, 
                    "userid" : userid,
                    "opid" : opid, 
                    "insertid": newid
                        });
}
catch(err) {
    console.log(err.message);
}
finally {
    mydb.close();
}
}

 module.exports = createAudiopost;