var express = require('express');
var app = express();

var bdHebrew = require("./js/bdHebrew.js");
var bodyParser = require("body-parser");
var ejs = require('ejs');
var _ = require('lodash');
var books = bdHebrew.books;
//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ETCBC4cSMall2__.sqlite3');

var dbLex = new sqlite3.Database('lex.dictionary.SQLite3');
var globalsearchText = "";


// создаем парсер для данных application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
/**
 * Побудова начального темплейта, на стороні сервера
 */
app.get('/', function (req, res, next) {


    res.render('pages/index', {}, function (err, html) {
        res.status(200).send(html);
    });
});

/**
 * Запрос раздела книги
 * number: название книги
 * charter: раздел книги
 */
app.get('/hbook/:number/:charter', function (req, res, next) {
    let number_book = req.params["number"],
        number_book_eng = number_book;
    var number_charter_active = req.params["charter"];
    var number_charter_count = undefined; // передаем количество разделов
    db.all("SELECT word_ID, st_strong, v_BHS, manuscript, transliteration, lex_Hebrew, lex_number, gloss_Eng, morph ,morph_prscoderus, gloss_Rus  FROM verse WHERE verse.Book=? AND verse.ch_BHS=?", [number_book, number_charter_active], function (err, row) {

        if (err !== null) {
            next(err);
        } else {
            var versus_hebrew = bdHebrew.verseBuild(row);

            for (var key = 0, l = books.length; key < l; key++) {
                if (books[key].short_name2 == number_book) {
                    number_book = books[key].rus;
                    number_charter_count = books[key].ch;
                    break;
                }
            }

            res.render('partials/versepage', {
                hebrews: versus_hebrew,
                books: books,
                globalsearchText: globalsearchText,
                numberBook: number_book,
                numberBookEng: number_book_eng,
                numberChapterActive: number_charter_active,
                numberCharterCount: number_charter_count,
            }, function (err, html) {
                res.status(200).send(html);
            });
        }
    });

});
/**
 * Запрос на отображение морфологии слова, при наведении на морфологическую строку
 * id_word: id в базе
 */
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
    var arr_strong = strong.split('｜'); // разбиваем на масив, если несколько  номеров стронга
    var query = undefined;
    for (var index = 0; index < arr_strong.length; index++) {
        if (index == 0) {
            query = ' topic="' + arr_strong[index] + '"';
        } else {
            query += ' OR topic="' + arr_strong[index] + '"';
        }
    }
    query = "SELECT * FROM dictionary WHERE " + query + "  LIMIT 4"

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

/**
 * Поиск
 */
app.get('/search/:searchText', function (req, res) {
    var searchText = globalsearchText = req.params["searchText"];

    var query = undefined;
    
    //Проверяем пользователь вводил поиск по номерам стронга?
    let isStrong = searchText.match(/H\d{1,4}/g);
    let subQuery = "";
   
    var s_currBook = ""; //по текущей книге
    var isStronginVerseView ="";
    // будет ли запрос с условием книги?
    if (req.query.hasOwnProperty("currbook")) {
        s_currBook = 'verse.Book="' + req.query.currbook + '" AND ';
    }

    // условие для отображение стронга
    if (req.query.hasOwnProperty("jn_strong_verse")) {
        isStronginVerseView = ' GROUP_CONCAT(verse.gloss_Rus ||" "|| verse.st_strong,\" \") ';
    } else{
        isStronginVerseView = ' GROUP_CONCAT(verse.gloss_Rus, \" \") ';

    }

    var quertyBetter ="";
    // Поиск по стронгу?
    if (isStrong == null) {
        if(req.query.hasOwnProperty("jn_better_find")){
            quertyBetter = "'" + searchText + "'";
        }
        else{
            
            quertyBetter = "'%" + searchText + "%'" ;
        }
        

        query = "SELECT verse.Book, verse.ch_BHS, verse.v_BHS,  "+isStronginVerseView+" as find  FROM verse,  (SELECT * FROM verse  WHERE gloss_Rus LIKE " + quertyBetter + "  GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY _rowid_ ASC  ) AS CC WHERE " + s_currBook + " verse.Book == CC.Book AND verse.ch_BHS == CC.ch_BHS AND verse.v_BHS == CC.v_BHS GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY verse.word_ID";
    } else {
        query = "SELECT verse.Book, verse.ch_BHS, verse.v_BHS, verse.gloss_Rus,  "+isStronginVerseView+" as find   FROM verse,  (SELECT * FROM verse  WHERE st_strong LIKE '" + searchText + "'  GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY _rowid_ ASC  ) AS CC WHERE " + s_currBook + " verse.Book == CC.Book AND verse.ch_BHS == CC.ch_BHS AND verse.v_BHS == CC.v_BHS GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY verse.word_ID";
        //query = "SELECT verse.Book, verse.ch_BHS, verse.v_BHS,  GROUP_CONCAT(verse.gloss_Rus, \" \") as find  FROM verse,  (SELECT * FROM verse  WHERE st_strong LIKE '"+searchText+"'   GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY _rowid_ ASC  ) AS CC WHERE  verse.Book == CC.Book AND verse.ch_BHS == CC.ch_BHS AND verse.v_BHS == CC.v_BHS AND verse.st_strong == CC.st_strong GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY verse.word_ID";
    }
    //console.log(dateTime.match(/H\d{1,4}/g));
    //query = "SELECT verse.Book, verse.ch_BHS, verse.v_BHS,  GROUP_CONCAT(verse.gloss_Rus, \" \") as find  FROM verse,  (SELECT * FROM verse  WHERE gloss_Rus LIKE '%"+searchText+"%'   GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY _rowid_ ASC  ) AS CC WHERE  verse.Book == CC.Book AND verse.ch_BHS == CC.ch_BHS AND verse.v_BHS == CC.v_BHS GROUP BY verse.Book, verse.ch_BHS, verse.v_BHS ORDER BY verse.word_ID";
    db.all(query, function (err, row) {
        if (err !== null) {
            next(err);
        } else {
            let tows = row;
            var html = ejs.renderFile(__dirname + '/views/partials/templateFind.ejs', {
                dlg_find: tows,
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

app.post("/update_rus_verse/", urlencodedParser, function (request, response) {

    if (!request.body) return response.sendStatus(400);
    db.run("UPDATE verse SET gloss_Rus = ? WHERE word_ID = ?", request.body.rus, request.body.id);
    response.status(200).send(request.body);
});


app.listen(app.get('port'), function () {
    console.log('Узел приложения запущен на порту', app.get('port'));
})