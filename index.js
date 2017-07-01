var express = require('express');
var app = express();

var bdHebrew = require("./js/bdHebrew.js");

//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ETCBC4cSMall2.db');


// db.all('SELECT book_number, long_name FROM  books', function (error, rows) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(rows);
//         // rows.forEach(function (row) {
//         //     console.log(row);
//         // });
//     }
// });

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function (req, res, next) {
    console.time('test');
    db.get('SELECT book, ch_BHS, v_BHS FROM verse WHERE verse.Book="Gen" AND ch_BHS=1', function (err, row) {
        if (err !== null) {
            next(err);
        } else {
            // row =  bdHebrew.parsBDText(row);
var obj = [];
 obj.push(row);
            res.render('pages/index', {
                rows: obj
            }, function (err, html) {
                res.status(200).send(html);
            });
        }


    });

    console.timeEnd('test');

});



app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
})