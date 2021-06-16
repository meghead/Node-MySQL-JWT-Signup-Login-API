var express = require("express");
var http = require('http');
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var config = require('./config');
var config = require('./database');  

var verifyToken = require('./middleware/verifyToken');
//var verifyRefresh = require('./middleware/verifyRefresh');
var addNewUser = require('./middleware/addNewUser');
var userLoginCheck = require('./middleware/userLoginCheck');
var findAllUsers = require('./middleware/findAllUsers');
var findAllAudioPosts = require('./middleware/findAllAudioPosts');
var welcome = require('./middleware/welcome');
var verifyRefresh = require('./middleware/verifyRefresh');
var getSingle = require('./middleware/getSingle');
var getFCM = require('./middleware/getFCM');

var port = process.env.PORT || 3000;
var app  = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, function() {
console.log('Express server listening on port ' +port);
});

app.post('/signup', addNewUser);
app.post('/userlogin', userLoginCheck);
app.post('/verifyrefresh', verifyRefresh);

var apiRoutes = express.Router();
apiRoutes.use(bodyParser.urlencoded({ extended: true }));
apiRoutes.use(bodyParser.json());

app.use('/api', apiRoutes); 
apiRoutes.use(verifyToken);
//apiRoutes.use(verifyRefresh);

apiRoutes.get('/', verifyToken, welcome);
apiRoutes.get('/users', verifyToken, findAllUsers);
apiRoutes.get('/audioposts', verifyToken, findAllAudioPosts);
apiRoutes.get('/getsingle', verifyToken, getSingle);
apiRoutes.post('/getfcm', verifyToken, getFCM);
//apiRoutes.get('/refresh', verifyRefresh, welcome);




