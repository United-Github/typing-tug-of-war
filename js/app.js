// app.js

// 仮の単語リスト（適当）
var wordList = ['value','version','E-commerce','Replace','Nest','Bracket','Admin','External','export','import','input','document','variable','content','division','markup','math','length','header','language','encode','decode','settings','stylesheet','console','error','handling','class','native','sudo','keyboard','pointer','format','query','queue','selector'];

var wordArea = document.querySelector('#js-word');

var word = Math.floor(Math.random()*wordList.length);
wordArea.textContent = wordList[word];

