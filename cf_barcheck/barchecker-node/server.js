/*eslint no-console: 0, no-shadow: 0, new-cap: 0, quotes: 0, no-unused-vars: 0*/

var express = require("express");
var app = express();

var xsenv = require("@sap/xsenv");
var hdbext = require("@sap/hdbext");

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
app.use(
	hdbext.middleware(hanaOptions.hana)
);

app.get('/', function(req, res) {
	res.type("text/html").status(200).send(
		'<html><head></head><body><a href="/database">Database</a><br/><a href="/session">Session</a><br/><a href="/insert">Insert</a><br/><a href="/select">Select</a><br/></body></html>'
	);
});

app.get('/database', function(req, res) {
	
	req.db.exec('select SYSTEM_ID, DATABASE_NAME, HOST, VERSION, USAGE from M_DATABASE', function(err, results) {
		if (err) {
			res.type("text/plain").status(500).send("ERROR: " + err.toString());
			return;
		}
		res.status(200).json(results);
	});
});

app.get('/session', function(req, res) {
	req.db.exec('select SESSION_USER, CURRENT_SCHEMA from DUMMY', function(err, results) {
		if (err) {
			res.type("text/plain").status(500).send("ERROR: " + err.toString());
			return;
		}
		res.status(200).json(results);
	});
});

app.get('/insert', function(req, res) {
	var sql = 'insert into' + '"barchecker-db::locationtable.vcalocations"' + "(ID,NAME,STREET,AADDRESS,POSTCODE,CITY,CATEGORYID,WATER,CAPS_NAME,IMAGINE,USER,LATITUDE,LONGITUDE,WHY_NOT,WHY_NOT_BEFORE,GLAS_330,PET_500,GLAS_750,PET_1000,TRIO_750,PET_750,COMMENT,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY,PLACE_ID) VALUES (0,'Koralle Bar','Simon-von-Utrecht-Straße 89',NULL,20359,'Hamburg',2,'X','KORALLE BAR',NULL,'ebn8Q9rYqMZWUztos0ZJIBGLDzL2','535.511.397','9.961.944.300.000.020',NULL,NULL,'X',NULL,NULL,NULL,NULL,NULL,NULL,'Montag: 20:00–03:00 Uhr','Dienstag: 20:00–03:00 Uhr','Mittwoch: 20:00–03:00 Uhr','Donnerstag: 20:00–03:00 Uhr','Freitag: 20:00–03:00 Uhr','Samstag: 20:00–03:00 Uhr','Sonntag: 20:00–00:00 Uhr','ChIJd1pZCm6PsUcRVnlStboVqho')";
	var ts = new Date().toISOString();
	req.db.prepare(sql, function(err, statement) {
		if (err) {
			res.type("text/plain").status(500).send("ERROR: " + err.toString());
			return;
		}
		statement.exec([ts], function(err, results) {
			if (err) {
				res.type("text/plain").status(500).send("ERROR: " + err.toString());
			} else {
				res.status(200).json(results);
			}
		});
	});
});

app.get('/select', function(req, res) {
	req.db.exec('select * from "barchecker-db::locationtable.vcalocations"', function(err, results) {
		if (err) {
			res.type("text/plain").status(500).send("ERROR: " + err.toString());
			return;
		}
		res.status(200).json(results);
	});
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.info("Listening on port: " + port);
});

