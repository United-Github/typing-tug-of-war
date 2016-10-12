// app.js

// 仮の単語リスト（適当）
var wordList = ['value', 'version', 'export', 'import', 'input', 'document', 'variable', 'content', 'division', 'markup', 'math', 'length', 'header', 'language', 'encode', 'decode', 'settings', 'stylesheet', 'console', 'error', 'handling', 'class', 'native', 'sudo', 'keyboard', 'pointer', 'format', 'query', 'queue', 'selector'];
var wordArea = document.querySelector('#js-word');

//出題中の単語
var nowWord = 'programming';
var nowCorrect = 0;

function checkType(downedkey) {
  if ( downedkey == nowWord.charAt(nowCorrect) ) {
    nowCorrect++;
    console.log('正解！', downedkey);
    if (nowWord.length == nowCorrect) {
      changeWord();
    }
  } else {
    console.log('やり直し！正解は:', nowWord.charAt(nowCorrect));
  }
}

document.addEventListener('keydown', keydown);
function keydown(event) {
  checkType(event.key);
}

// 出題単語を変更する処理
function changeWord() {
  nowCorrect = 0; // 正答文字数のカウンターを元に戻す
  var word = Math.floor(Math.random() * wordList.length);
  wordArea.textContent = nowWord = wordList[word];
}
