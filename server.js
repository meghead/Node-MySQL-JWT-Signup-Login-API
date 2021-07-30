var express = require("express");
var http = require('http');
var mysql   = require("mysql2");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var config = require('./config');
var config = require('./database');
//require('dotenv').config(); 

var verifyToken = require('./middleware/verifyToken');
var addNewUser = require('./middleware/addNewUser');
var userLoginCheck = require('./middleware/userLoginCheck');
var findAllUsers = require('./middleware/findAllUsers');
var findAllAudioPosts = require('./middleware/findAllAudioPosts');
var welcome = require('./middleware/welcome');
var verifyRefresh = require('./middleware/verifyRefresh');
var getSingle = require('./middleware/getSingle');
var getTags = require('./middleware/getTags');
var getReplies = require('./middleware/getReplies');
var createAudiopost = require('./middleware/createAudiopost');
var getFCM = require('./middleware/getFCM');
var postEdit = require('./middleware/postEdit');
var updateAudiopost = require('./middleware/updateAudiopost');
var updatePassword = require('./middleware/updatePassword');

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

apiRoutes.get('/', verifyToken, welcome);
apiRoutes.get('/users', verifyToken, findAllUsers);
apiRoutes.post('/audioposts', verifyToken, findAllAudioPosts);
apiRoutes.post('/getsingle', verifyToken, getSingle);
apiRoutes.post('/gettags', verifyToken, getTags);
apiRoutes.post('/getfcm', verifyToken, getFCM);
apiRoutes.post('/getreplies', verifyToken, getReplies);
apiRoutes.post('/postedit', verifyToken, postEdit);
apiRoutes.post('/createaudiopost', verifyToken, createAudiopost);
apiRoutes.post('/updateaudiopost', verifyToken, updateAudiopost);
apiRoutes.post('/updatepassword', verifyToken, updatePassword);




