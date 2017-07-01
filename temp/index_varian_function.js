var express = require('express');
var app = express();

// var bdHebrew = require("./js/bdHebrew.js");

//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ETCBC4cSMall2.db');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set(
    'views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function (req, res, next) {
    console.time('test');
    //manuscript, transliteration
    var hebrew = [];
    var prevVerse = -1; // разделение на стихи
    db.each("SELECT v_BHS, manuscript, transliteration, lex_Hebrew,lex_number, gloss_Eng  FROM verse WHERE verse.Book='Gen' AND verse.ch_BHS=1", function (err, row) {
        if (err !== null) {
            next(err);
        } else {

            if (row.v_BHS != prevVerse) {
                prevVerse = (+row.v_BHS);
                hebrew.push({
                    numVerse: prevVerse,
                    textVerse: []
                });

            }
            hebrew[prevVerse - 1].textVerse.push({
                manuscript: row.manuscript,
                transliteration: row.transliteration,
                lex_Hebrew: row.lex_Hebrew,
                lex_number: row.lex_number,
                gloss_Eng: row.gloss_Eng,
            });

            // var hebrew = [];
            // var prevVerse = -1; // разделение на стихи
            // for (var key in row) {
            //     if (row[key].v_BHS != prevVerse) {
            //         prevVerse = (+row[key].v_BHS);
            //         hebrew.push({
            //             numVerse: prevVerse,
            //             textVerse: []
            //         });

            //     }
            //     hebrew[prevVerse - 1].textVerse.push({
            //         manuscript: row[key].manuscript,
            //         transliteration: row[key].transliteration,
            //         lex_Hebrew: row[key].lex_Hebrew,
            //         lex_number: row[key].lex_number,
            //         gloss_Eng: row[key].gloss_Eng,
            //     });
            // }

        }
    }, function () {
        res.render('pages/index', {
            hebrews: hebrew,
            title: "Мои контакты",
            emailsVisible: true,
            emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
            phone: "+1234567890"

        }, function (err, html) {
            res.status(200).send(html);
        });
    });

    console.timeEnd('test');

});

app.get('/:productId', function (req, res, next) {
    //response.send("productId: " + request.params["productId"])  


});


app.listen(app.get('port'), function () {
    console.log('Узел приложения запущен на порту', app.get('port'));
})