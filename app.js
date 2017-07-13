var express = require("express");
var bodyParser = require("body-parser");
var ibmdb = require("ibm_db");
var app = express();

// configure app to use bodyParser()
app.use(bodyParser.json());

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
	extended: true
}));

// configure HTTP respond header to allow CROS and MIME content-type
app.all("*", function(req, res, next) {
	use strict;
	res.header("Access-Control-Allow-Origin", req.headers.origin);

	// 告诉客户端可以在HTTP请求中带上Cookie
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers",
		"Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, " +
		"Last-Modified, Cache-Control, Expires, Content-Type," +
		"Content-Language, Cache-Control, X-E4M-With,X_FILENAME"
	);
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", " 3.2.1");
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
// Handle Task search Post Request and send query result
app.post("/task", function(req, res) {
	var connStr =
		"DATABASE=" + req.body.DB_select +
		";HOSTNAME=devpcrdisde02.w3-969.ibm.com;PORT=50000;PROTOCOL=TCPIP;" +
		"UID=csusr;PWD=1qazxsw2";
	var querySQL =
		"SELECT" +
		"ME.ID," +
		"ME.NAME," +
		"ME.TYPE," +
		"ME.LEVEL," +
		"MUES.ACCOMPLISHED," +
		"MUES.LAST_UPDATED" +
		"FROM" +
		"CORE_SERVICE.MASTERY_ELEMENTS ME" +
		"LEFT JOIN CORE_SERVICE.MASTERY_USER_ELEMENTS_STATUS MUES ON" +
		"MUES.ELEMENT_ID = ME.ID" +
		"AND MUES.REP_INTRANET_ID = LOWER(' " + req.body.queryValue + " ')" +
		"ORDER BY" +
		"ME.ID";

	ibmdb.open(connStr, function(err, conn) {
		if (err) {
			console.log(err);
			return;
		}
		conn.query(querySQL,
			function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log(data);
					res.json(data);
					conn.close(function() {
						console.log('done');
					});
				}
			});
	});

});
// Handle Learn&Exam search Post Request and send query result
app.post("/learn", function(req, res) {
	var connStr =
		"DATABASE=" + req.body.DB_select +
		";HOSTNAME=devpcrdisde02.w3-969.ibm.com;PORT=50000;PROTOCOL=TCPIP;" +
		"UID=csusr;PWD=1qazxsw2";
	var querySQL =
		"SELECT" +
		"MULE.LEARNING_ELEMENT_ID," +
		"MULE.LEARNING_ELEMENT_NAME," +
		"MULS.LEARNING_ELEMENT_VALUE," +
		"MULS.LAST_UPDATED" +
		"FROM" +
		"CORE_SERVICE.MASTERY_USER_LEARNING_ELEMENTS MULE" +
		"LEFT" +
		"JOIN CORE_SERVICE.MASTERY_USER_LEARNING_STATUS MULS ON" +
		"MULS.LEARNING_ELEMENT_ID = MULE.LEARNING_ELEMENT_ID" +
		"AND MULS.REP_INTRANET_ID =LOWER(' " + req.body.queryValue + " ')" +
		"ORDER BY" +
		"MULS.LEARNING_ELEMENT_ID," +
		"MULS.LAST_UPDATED";

	ibmdb.open(connStr, function(err, conn) {
		if (err) {
			console.log(err);
			return;
		}
		conn.query(querySQL,
			function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log(data);
					res.json(data);
					conn.close(function() {
						console.log('done');
					});
				}
			});
	});

});
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listening at http://%s:%s", host, port);
});
