var cheerio = require('cheerio');
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