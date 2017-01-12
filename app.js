var express = require('express');
var bodyParser = require('body-parser');
var ibmdb = require('ibm_db');
var app = express();

var dbData; //store the data received from DB2

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.all("*", function(req, res, next) {
	//res.setHeader("Access-Control-Allow-Origin", "true");
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header('Access-Control-Allow-Credentials', true); //告诉客户端可以在HTTP请求中带上Cookie
	res.header("Access-Control-Allow-Headers",
		"Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, " +
		"Last-Modified, Cache-Control, Expires, Content-Type, Content-Language, Cache-Control, X-E4M-With,X_FILENAME"
	);
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
//router middleware.
app.get("/", function(req, res) {
	res.send("hello dojo");
	//主页入口 --> res.render("index");
});

app.post("/task", function(req, res) {
	var connStr =
		"DATABASE=" + req.body.DB_select +
		";HOSTNAME=devpcrdisde02.w3-969.ibm.com;PORT=50000;PROTOCOL=TCPIP;UID=csusr;PWD=1qazxsw2";
	var querySQL =
		'SELECT ME.ID,	ME.NAME,	ME."TYPE",	ME."LEVEL",	MUES.ACCOMPLISHED,	MUES.LAST_UPDATED FROM 	CORE_SERVICE.MASTERY_ELEMENTS ME LEFT JOIN CORE_SERVICE.MASTERY_USER_ELEMENTS_STATUS MUES ON 	MUES.ELEMENT_ID = ME.ID	AND MUES.REP_INTRANET_ID = LOWER(\' ' +
		req.body.queryValue + '\') ORDER BY ME.ID';
	console.log(querySQL);
	ibmdb.open(connStr, function(err, conn) {
		if (err) return console.log(err);
		//SELECT * FROM CORE_SERVICE.REP_ALL WHERE IMT_RPTG = 'US'; 'SELECT ' + req.body.schemaColumn + ' FROM ' + req.body.schemaName +'.'+ req.body.tableName + ' WHERE ' + req.body.queryCondition + '= \'' + req.body.queryValue + '\''
		conn.query(querySQL,
			function(err, data) {
				if (err) console.log(err);
				else console.log(data);
				//res.send(data);
				res.json(data);
				conn.close(function() {
					console.log('done');
				});
			});
	});

});
app.post("/learn", function(req, res) {
	var connStr =
		"DATABASE=" + req.body.DB_select +
		";HOSTNAME=devpcrdisde02.w3-969.ibm.com;PORT=50000;PROTOCOL=TCPIP;UID=csusr;PWD=1qazxsw2";
	var querySQL =
		'SELECT	MULE.LEARNING_ELEMENT_ID,	MULE.LEARNING_ELEMENT_NAME,	MULS.LEARNING_ELEMENT_VALUE,	MULS.LAST_UPDATED FROM CORE_SERVICE.MASTERY_USER_LEARNING_ELEMENTS MULE LEFT JOIN CORE_SERVICE.MASTERY_USER_LEARNING_STATUS MULS ON	MULS.LEARNING_ELEMENT_ID = MULE.LEARNING_ELEMENT_ID	AND MULS.REP_INTRANET_ID =LOWER(\' ' +
		req.body.queryValue +
		'\') ORDER BY	MULS.LEARNING_ELEMENT_ID,	MULS.LAST_UPDATED';
	console.log(querySQL);
	ibmdb.open(connStr, function(err, conn) {
		if (err) return console.log(err);
		//SELECT * FROM CORE_SERVICE.REP_ALL WHERE IMT_RPTG = 'US'; 'SELECT ' + req.body.schemaColumn + ' FROM ' + req.body.schemaName +'.'+ req.body.tableName + ' WHERE ' + req.body.queryCondition + '= \'' + req.body.queryValue + '\''
		conn.query(querySQL,
			function(err, data) {
				if (err) console.log(err);
				else console.log(data);
				//res.send(data);
				res.json(data);
				conn.close(function() {
					console.log('done');
				});
			});
	});

});
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listening at http://%s:%s", host, port);
});
