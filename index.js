var express = require('express');
var app = express();
var cheerio = require('cheerio');


//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('BHSEk.SQLite3');

// //Perform SELECT Operation
// db.all("SELECT * FROM books", function (err, rows) {
//     console.log(rows);
//     //rows contain values while errors, well you can figure out.
// });

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res, next) {

    db.all('SELECT book_number, chapter, verse, text FROM verses WHERE verses.book_number=10 AND verses.chapter = 1 AND verses.verse=1', function (err, row) {
        if (err !== null) {

            next(err);
        } else {
            let $ ;
            row.forEach(function (bd) {
               // let reg = bd.text.match(/<s>(.*?)<\/s>/);
                // console.log(reg);
               $ =  cheerio.load('<div>'+bd.text+'</div>');
               console.log($('s + *').html());
            });

            res.render('pages/index', {
                bookmarks: row,
                title: "Мои контакты",
                emailsVisible: true,
                emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
                phone: "+1234567890"

            }, function (err, html) {
                res.send(200, html);
            });
        }

        // res.render('pages/index', {
        //     title: "Мои контакты",
        //     emailsVisible: true,
        //     emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        //     phone: "+1234567890"
        // })

    });



});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
})