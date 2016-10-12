// app.js

// 仮の単語リスト
var wordList = ['value','E-commerce','Replace','Nest','Bracket','Admin','External','export','import','input','document','variable','content','division','markup','math','length','header','language','encode','decode','settings','stylesheet','console','error','handling','class','native']

var wordArea = document.querySelector('#js-word');

var word = Math.floor(Math.random()*wordList.length);
wordArea.textContent = wordList[word];

