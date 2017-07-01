var express = require('express');
var app = express();

var bdHebrew = require("./js/bdHebrew.js");
var books = bdHebrew.books;
//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ETCBC4cSMall2.db');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function (req, res, next) {
    console.time('test');
    //manuscript, transliteration
    db.all("SELECT v_BHS, manuscript, transliteration, lex_Hebrew,lex_number, gloss_Eng  FROM verse WHERE verse.Book='Gen' AND verse.ch_BHS=1", function (err, row) {
        if (err !== null) {
            next(err);
        } else {
            var versus_hebrew = bdHebrew.verseBuild(row);

            res.render('pages/index', {
                hebrews: versus_hebrew,
                books: books,
                numberBook:'Быт',
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

app.get('/book/:number', function (req, res, next) {
  //  res.send("number: " + req.params["number"]);
  var number_book = req.params["number"];
db.all("SELECT v_BHS, manuscript, transliteration, lex_Hebrew,lex_number, gloss_Eng  FROM verse WHERE verse.Book=? AND verse.ch_BHS=?", [ number_book, 1 ], function (err, row) {
        if (err !== null) {
            next(err);
        } else {
            var versus_hebrew = bdHebrew.verseBuild(row);

  for (var key = 0, l = books.length; key < l; key++) {
                    if (books[key].short_name2 == number_book) {
                      number_book = books[key].rus;
                      break;
                    }
                }
                
            res.render('pages/index', {
                hebrews: versus_hebrew,
                books: books,
                numberBook:number_book,
                title: "Мои контакты",
                emailsVisible: true,
                emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
                phone: "+1234567890"

            }, function (err, html) {
                res.status(200).send(html);
            });
        }
    });

});


app.listen(app.get('port'), function () {
    console.log('Узел приложения запущен на порту', app.get('port'));
})