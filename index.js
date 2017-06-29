var express = require('express');
var app = express();

var bdHebrew = require("./js/bdHebrew.js");

//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('BHSEk.SQLite3');
const BOOK = 39;

db.all('SELECT book_number, long_name FROM  books', function (error, rows) {
    if (error) {
        console.log(error);
    } else {
        console.log(rows);
        // rows.forEach(function (row) {
        //     console.log(row);
        // });
    }
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function (req, res, next) {
console.time('test');
    db.all('SELECT book_number, chapter, verse, text FROM verses WHERE verses.book_number=$numberBook AND verses.chapter = $chapter ', {
          $numberBook: 10,
          $chapter: 1
      }, function (err, row) {
        if (err !== null) {
            next(err);
        } else {
          row =  bdHebrew.parsBDText(row);
          console.log(row);
            res.render('pages/index', {
                bookmarks: row,
                title: "Мои контакты",
                emailsVisible: true,
                emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
                phone: "+1234567890"

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