SELECT verse.Book, verse.ch_BHS, verse.v_BHS, verse.gloss_Rus FROM verse,  (SELECT `_rowid_`,* FROM `verse`  WHERE `gloss_Rus` LIKE '%нача%' ESCAPE '\' ORDER BY `_rowid_` ASC LIMIT 0, 50000) AS CC
WHERE  verse.Book == CC.Book AND verse.ch_BHS == CC.ch_BHS AND verse.v_BHS == CC.v_BHS


