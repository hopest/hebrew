var express = require('express');
var app = express();

var bdHebrew = require("./js/bdHebrew.js");

//Load modules
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ETCBC4cDel.db');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function (req, res, next) {
    console.time('test');
    //manuscript, transliteration
    db.all("SELECT data.book, data.ch_BHS, data.v_BHS, data.manuscript, data.transliteration  FROM data WHERE data.Book='Gen' AND data.ch_BHS=1", function (err, row) {
        if (err !== null) {
            next(err);
        } else {
            var verse = [];
            var i_verse = 0;
            var prevVerse = 0;
            for (var key in row) {
                if (row[key].v_BHS != prevVerse) {
                    prevVerse = row[key].v_BHS;
                    verse[prevVerse]={} ;
                    prevVerse;
                }
                verse[prevVerse].push( {
                     ver: row[key].v_BHS,
                     man: row[key].manuscript
                 });
                i_verse++;

            }
            console.log(verse);
            //row =  bdHebrew.parsBDText(row);
            res.render('pages/index', {
                hebrews: row,
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