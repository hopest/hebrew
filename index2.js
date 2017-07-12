var express = require('express');
var app = express();

var bdHebrew = require("./js/bdHebrew.js");
var bodyParser = require("body-parser");
var ejs = require('ejs');
var books = bdHebrew.books;
//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ETCBC4cSMall2__.sqlite3');
var dbLex = new sqlite3.Database('lex.dictionary.SQLite3');

// создаем парсер для данных application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function (req, res, next) {

    res.redirect('/book/Gen/1');
});

app.get('/book/:number/:versus', function (req, res, next) {
    //  res.send("number: " + req.params["number"]);
    var number_book = req.params["number"],
        number_book_eng = number_book;
    var number_charter_active = req.params["versus"];
    var number_charter_count = undefined; // передаем количество разделов
    console.time('test');
    db.all("SELECT word_ID, st_strong, v_BHS, manuscript, transliteration, lex_Hebrew, lex_number, gloss_Eng, morph_prscoderus  FROM verse WHERE verse.Book=? AND verse.ch_BHS=?", [number_book, number_charter_active], function (err, row) {

        if (err !== null) {
            next(err);
        } else {
            console.timeEnd('test');
            var versus_hebrew = bdHebrew.verseBuild(row);

            for (var key = 0, l = books.length; key < l; key++) {
                if (books[key].short_name2 == number_book) {
                    number_book = books[key].rus;
                    number_charter_count = books[key].ch;
                    break;
                }
            }

            res.render('pages/index', {
                hebrews: versus_hebrew,
                books: books,
                numberBook: number_book,
                numberBookEng: number_book_eng,
                numberChapterActive: number_charter_active,
                numberCharterCount: number_charter_count,
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

app.get('/morph_def/:id_word', function (req, res) {
    var idWord = req.params["id_word"];
    db.all("SELECT morph FROM verse WHERE verse.word_ID=?", idWord, function (err, row) {

        if (err !== null) {
            next(err);
        } else {
            res.send(row[0].morph);
        }
    });
});
/**
 * Запрос с словаря стронга, и ответ в виде шаблона
 */
app.get('/strong/:number_strong', function (req, res) {
    var strong = req.params["number_strong"];
    var arr_strong = strong.split('｜');
    var query = undefined;
    for (var index = 0; index < arr_strong.length; index++) {
        if (index == 0){
            query = ' topic="'+ arr_strong[index]+'"';
        } else{
            query += ' OR topic="'+ arr_strong[index]+'"';
        }

    }
query = "SELECT * FROM dictionary WHERE "+query+"  LIMIT 4"

    dbLex.all(query, function (err, row) {

        if (err !== null) {
            next(err);
        } else {
            let tows = row;
            var html = ejs.renderFile(__dirname + '/views/partials/templateStrong.ejs', {
                dlg_strongs: tows
            }, function (err, str) {
                if (err !== null) {
                    next(err);
                } else {
                    res.status(200).send(str);
                }
            });

        }
    });
});

app.post("/register", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    //     console.log(request.body);
    //   response.send(`${request.body.userName} - ${request.body.userAge}`);
    // Directly in the function arguments.
    db.run("UPDATE verse SET gloss_Eng = ? WHERE word_ID = ?", request.body.userName, 1);
    //UPDATE my_table SET age = 34 WHERE name='Karen'
});


app.listen(app.get('port'), function () {
    console.log('Узел приложения запущен на порту', app.get('port'));
})