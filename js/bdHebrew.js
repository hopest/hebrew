//var cheerio = require('cheerio');

module.exports.books= [{"book_number":10,"short_name":"Gen","long_name":"Genesis","short_name2":"Gen","rus":"Быт","ch":50},{"book_number":20,"short_name":"Exo","long_name":"Exodus","short_name2":"Exo","rus":"Исх","ch":40},{"book_number":30,"short_name":"Lev","long_name":"Leviticus","short_name2":"Lev","rus":"Лев","ch":27},{"book_number":40,"short_name":"Num","long_name":"Numbers","short_name2":"Num","rus":"Чис","ch":36},{"book_number":50,"short_name":"Deu","long_name":"Deuteronomy","short_name2":"Deu","rus":"Втор","ch":34},{"book_number":60,"short_name":"Josh","long_name":"Joshua","short_name2":"Jon","rus":"Нав","ch":4},{"book_number":70,"short_name":"Judg","long_name":"Judges","short_name2":"Jos","rus":"Суд","ch":24},{"book_number":80,"short_name":"Ruth","long_name":"Ruth","short_name2":"Rth","rus":"Руфь","ch":4},{"book_number":90,"short_name":"1Sam","long_name":"1 Samuel","short_name2":"1Sa","rus":"1Цар","ch":31},{"book_number":100,"short_name":"2Sam","long_name":"2 Samuel","short_name2":"2Sa","rus":"2Цар","ch":24},{"book_number":110,"short_name":"1Kin","long_name":"1 Kings","short_name2":"1Ki","rus":"3Цар","ch":22},{"book_number":120,"short_name":"2Kin","long_name":"2 Kings","short_name2":"2Ki","rus":"4Цар","ch":25},{"book_number":130,"short_name":"1Chr","long_name":"1 Chronicles","short_name2":"1Ch","rus":"1Пар","ch":29},{"book_number":140,"short_name":"2Chr","long_name":"2 Chronicles","short_name2":"2Ch","rus":"2Пар","ch":36},{"book_number":150,"short_name":"Ezr","long_name":"Ezra","short_name2":"Ezr","rus":"Ездр","ch":10},{"book_number":160,"short_name":"Neh","long_name":"Nehemiah","short_name2":"Neh","rus":"Неем","ch":13},{"book_number":190,"short_name":"Esth","long_name":"Esther","short_name2":"Est","rus":"Есф","ch":10},{"book_number":220,"short_name":"Job","long_name":"Job","short_name2":"Jer","rus":"Иов","ch":52},{"book_number":230,"short_name":"Ps","long_name":"Psalms","short_name2":"Psa","rus":"Пс","ch":150},{"book_number":240,"short_name":"Prov","long_name":"Proverbs","short_name2":"Pro","rus":"Прит","ch":31},{"book_number":250,"short_name":"Eccl","long_name":"Ecclesiastes","short_name2":"Ecc","rus":"Еккл","ch":12},{"book_number":260,"short_name":"Song","long_name":"Song of Solomon","short_name2":"Son","rus":"Песн","ch":8},{"book_number":290,"short_name":"Isa","long_name":"Isaiah","short_name2":"Isa","rus":"Ис","ch":66},{"book_number":300,"short_name":"Jer","long_name":"Jeremiah","short_name2":"Jdg","rus":"Иер","ch":21},{"book_number":310,"short_name":"Lam","long_name":"Lamentations","short_name2":"Lam","rus":"Плач","ch":5},{"book_number":330,"short_name":"Ezek","long_name":"Ezekiel","short_name2":"Eze","rus":"Иез","ch":48},{"book_number":340,"short_name":"Dan","long_name":"Daniel","short_name2":"Dan","rus":"Дан","ch":12},{"book_number":350,"short_name":"Hos","long_name":"Hosea","short_name2":"Hos","rus":"Ос","ch":14},{"book_number":360,"short_name":"Joel","long_name":"Joel","short_name2":"Job","rus":"Иоил","ch":42},{"book_number":370,"short_name":"Am","long_name":"Amos","short_name2":"Amo","rus":"Ам","ch":9},{"book_number":380,"short_name":"Oba","long_name":"Obadiah","short_name2":"Oba","rus":"Авд","ch":1},{"book_number":390,"short_name":"Jona","long_name":"Jonah","short_name2":"Joe","rus":"Ион","ch":4},{"book_number":400,"short_name":"Mic","long_name":"Micah","short_name2":"Mic","rus":"Мих","ch":7},{"book_number":410,"short_name":"Nah","long_name":"Nahum","short_name2":"Nah","rus":"Наум","ch":3},{"book_number":420,"short_name":"Hab","long_name":"Habakkuk","short_name2":"Hab","rus":"Авв","ch":3},{"book_number":430,"short_name":"Zeph","long_name":"Zephaniah","short_name2":"Zep","rus":"Соф","ch":3},{"book_number":440,"short_name":"Hag","long_name":"Haggai","short_name2":"Hag","rus":"Агг","ch":2},{"book_number":450,"short_name":"Zech","long_name":"Zechariah","short_name2":"Zec","rus":"Зах","ch":14},{"book_number":460,"short_name":"Mal","long_name":"Malachi","short_name2":"Mal","rus":"Мал","ch":3}]

      module.exports.verseBuild = function(row) {
                let hebrew = [];
                let prevVerse = -1; // разделение на стихи
                for (var key = 0, l = row.length; key < l; key++) {
                    if (row[key].v_BHS != prevVerse) {
                        prevVerse = row[key].v_BHS;
                        hebrew.push({
                            numVerse: prevVerse,
                            textVerse: []
                        });
                    }
                    hebrew[prevVerse - 1].textVerse.push({
                        wordID:row[key].word_ID,
                        manuscript: row[key].manuscript,
                        transliteration: row[key].transliteration,
                        lex_Hebrew: row[key].lex_Hebrew,
                        lex_number: row[key].lex_number,
                        st_strong: row[key].st_strong,
                         gloss_Eng: row[key].gloss_Eng,
                        morph_prscoderus:row[key].morph_prscoderus
                    });
                }
                return hebrew;
            }

module.exports.parsBDText = function (row) {
 let $;
            row.forEach(function (bd) {

                let obj = [];
                let st = {};
                $ = cheerio.load('<div>' + bd.text + '</div>');
                var chi = $('div')[0].childNodes;

                for (var i = 0, l = chi.length; i < l; i++) {

                    if (chi[i].data != undefined) {
                        st.text = chi[i].data;
                    } else if (chi[i].name == 's') {
                        st.s = chi[i].childNodes[0].data;
                    } else if (chi[i].name == 'm') {
                        st.m = chi[i].childNodes[0].data;
                    }
                    if (i % 3 == 2) {
                        obj.push(st);
                        st = {};
                    }
                }
                 bd.text = obj;

            });
            return row;
}


module.exports.getBDdata = function (cheerio, db, querty, callback) {
    var q = querty;
    var addQ = 'SELECT book_number, chapter, verse, text FROM verses WHERE verses.book_number=' + q.book_number + ' AND verses.chapter = ' + q.chapter + '';
    var _row;
    db.all(addQ, function (err, row) {
        if (err !== null) {
            next(err);
        } else {
            let $;
            row.forEach(function (bd) {
                let obj = [];
                let st = {};
                let j = 0;
                $ = cheerio.load('<div>' + bd.text + '</div>');
                var chi = $('div')[0].childNodes;

                for (var i = 0, l = chi.length; i < l; i++) {

                    if (chi[i].data != undefined) {
                        st.text = chi[i].data;
                    } else if (chi[i].name == 's') {
                        st.s = chi[i].childNodes[0].data;
                    } else if (chi[i].name == 'm') {
                        st.m = chi[i].childNodes[0].data;
                    }
                    if (i % 3 == 2) {
                        obj.push(st);
                        st = {};
                    }
                }
                console.log(obj.length);
            });

        }
                    callback(row);
    });
    return _row;
}