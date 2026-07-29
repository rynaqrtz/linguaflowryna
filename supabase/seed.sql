insert into words (kanji, furigana, romaji, arti, level, contoh, contoh_id, word_group) values
('食べる', 'たべる', 'taberu', 'Makan', 'N5', 'ご飯を食べる', 'Gohan wo taberu — Makan nasi', 'Group 2 (ichidan)'),
('飲む', 'のむ', 'nomu', 'Minum', 'N5', '水を飲む', 'Mizu wo nomu — Minum air', 'Group 1 (godan)'),
('行く', 'いく', 'iku', 'Pergi', 'N5', '学校へ行く', 'Gakkou e iku — Pergi ke sekolah', 'Group 1 (godan)'),
('会う', 'あう', 'au', 'Bertemu', 'N5', null, null, 'Group 1 (godan)'),
('開く', 'あく', 'aku', 'Terbuka', 'N5', null, null, 'Group 1 (godan)'),
('歩く', 'あるく', 'aruku', 'Berjalan', 'N5', null, null, 'Group 1 (godan)'),
('言う', 'いう', 'iu', 'Mengatakan', 'N5', null, null, 'Group 1 (godan)'),
('買う', 'かう', 'kau', 'Membeli', 'N5', '本を買う', 'Hon wo kau — Membeli buku', 'Group 1 (godan)'),
('聞く', 'きく', 'kiku', 'Mendengar', 'N5', null, null, 'Group 1 (godan)'),
('待つ', 'まつ', 'matsu', 'Menunggu', 'N5', 'バスを待つ', 'Basu wo matsu — Menunggu bus', 'Group 1 (godan)'),
('友達', 'ともだち', 'tomodachi', 'Teman', 'N5', null, null, null),
('学校', 'がっこう', 'gakkou', 'Sekolah', 'N5', null, null, null),
('高い', 'たかい', 'takai', 'Tinggi/Mahal', 'N5', null, null, null),
('猫', 'ねこ', 'neko', 'Kucing', 'N5', null, null, null);

insert into schools (id, name, npsn) values
('00000000-0000-0000-0000-000000000001', 'SMK Texar', '12345678');

insert into classes (id, school_id, name, level, major) values
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'XII RPL 1', 'XII', 'RPL'),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'XII RPL 2', 'XII', 'RPL'),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'XI TKJ 1', 'XI', 'TKJ');
