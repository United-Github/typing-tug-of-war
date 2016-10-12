// app.js

// 仮の単語リスト（適当）
var wordList = ['value', 'version', 'E-commerce', 'Replace', 'Nest', 'Bracket', 'Admin', 'External', 'export', 'import', 'input', 'document', 'variable', 'content', 'division', 'markup', 'math', 'length', 'header', 'language', 'encode', 'decode', 'settings', 'stylesheet', 'console', 'error', 'handling', 'class', 'native', 'sudo', 'keyboard', 'pointer', 'format', 'query', 'queue', 'selector'];
var wordArea = document.querySelector('#js-word');

//出題中の単語
var nowWord = '';

// 出題単語を変更する処理
function changeWord() {
  var word = Math.floor(Math.random() * wordList.length);
  wordArea.textContent = nowWord = wordList[word];
}

document.addEventListener('keydown', keydown);
function keydown(event) {
  console.log(event.key);
}
