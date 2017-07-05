SELECT verse.word_ID, strong.strong, verse.v_BHS, verse.manuscript, verse.transliteration, verse.lex_Hebrew, verse.lex_number, verse.gloss_Eng  
FROM verse
JOIN strong ON verse.word_ID =strong.word_ID 

AND verse.Book='Gen'
AND verse.ch_BHS=1