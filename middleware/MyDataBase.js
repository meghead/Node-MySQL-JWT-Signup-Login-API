class MyDataBase {
    constructor( config ) {
        this.mydb = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {

            this.mydb.query( sql, args, ( err, rows ) => {
                if (err) {
                    return reject(err);
                }
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.mydb.end( err => {
                if ( err ) {
                    return reject( err );
                }
                resolve();
            } );
        } );
    }
}

module.exports = MyDataBase;