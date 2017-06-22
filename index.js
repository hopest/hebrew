var express = require('express');
var app = express();

//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('BHSEk.SQLite3');

//Perform SELECT Operation
db.all("SELECT * FROM books", function (err, rows) {
    console.log(rows);
    //rows contain values while errors, well you can figure out.
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index')
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
})