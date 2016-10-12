// 仮の単語リスト（適当）
var wordList = ['value', 'version', 'export', 'import', 'input', 'document', 'variable', 'content', 'division', 'markup', 'math', 'length', 'header', 'language', 'encode', 'decode', 'settings', 'stylesheet', 'console', 'error', 'handling', 'class', 'native', 'sudo', 'keyboard', 'pointer', 'format', 'query', 'queue', 'selector'];

// TARGET DOM
var wordArea = document.querySelector('#js-word');

document.addEventListener('keydown', function() {
  checkType(event.key);
});

var nowWord = 'programming'; // 現在出題中の単語
var nowCorrect = 0; // 現在の正答文字数（現在押すべきキーに相当する）

function checkType(downedkey) {
  if ( downedkey == nowWord.charAt(nowCorrect) ) {
    paintColor();
    if (nowWord.length == nowCorrect) {
      changeWord();
    }
  } else {
    console.log('やり直し！正解は:', nowWord.charAt(nowCorrect));
  }
}

// 打鍵済みのキーに色を塗る！
function paintColor () {
  nowCorrect++; // 正答文字数のカウントUP

  // 既打鍵のDOMを生成
  var touchedLetter = document.createElement('span');
  touchedLetter.className = 'touched-letter';
  touchedLetter.textContent = nowWord.substr(0,nowCorrect);
  // 未打鍵のDOMを生成
  var untouchedLetter = document.createElement('span');
  untouchedLetter.className = 'untouched-letter';
  untouchedLetter.textContent = nowWord.substr(nowCorrect, nowWord.length);

  // 一旦、空に
  wordArea.textContent = null;

  // 打鍵を更新
  wordArea.appendChild(touchedLetter);
  wordArea.appendChild(untouchedLetter);
}

// 出題単語を変更する処理
function changeWord() {
  nowCorrect = 0; // 正答文字数のカウンターを元に戻す
  var word = Math.floor(Math.random() * wordList.length);
  wordArea.textContent = nowWord = wordList[word];
}
