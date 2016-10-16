// 仮の単語リスト（適当）
var wordList = ['piyo', 'huga', 'hoge', 'network', 'oracle', 'environment', 'install', 'template', 'sass', 'include', 'extend', 'add', 'remove', 'append', 'typiing', 'browser', 'value', 'javascript', 'c', 'script', 'python', 'ruby', 'design', 'node', 'array', 'element', 'index', 'undefined', 'function', 'php', 'doctype', 'github', 'api', 'architecture', 'application', 'sublimetext', 'foreach', 'int', 'modules', 'view', 'model', 'readme', 'programming', 'version', 'export', 'import', 'input', 'document', 'variable', 'content', 'division', 'markup', 'math', 'length', 'header', 'language', 'encode', 'decode', 'settings', 'stylesheet', 'console', 'error', 'handling', 'class', 'native', 'sudo', 'keyboard', 'pointer', 'format', 'query', 'queue', 'selector'];

// TARGET DOM
var wordArea = document.querySelector('#js-word');
var westTug = document.querySelector('#js-red-tug');
var eastTug = document.querySelector('#js-blue-tug');

var nowWord = 'programming'; // 現在出題中の単語
var nowCorrect = 0; // 現在の正答文字数（現在押すべきキーに相当する）

var westForce = 50; // 相手：西軍の強さ（幅[%]）
var eastForce = 50; // 自分：東軍の強さ（幅[%]）

function npcAttach (force) {
  westForce += force;
}

// チーム戦＆リアルタイムをキー押下ごとにやると描画がなんか辛そうな気がスルので100ms毎に幅を更新
function myAttack() {
  npcAttach(2); // 擬似的に敵のタイピングを表現

  var width = Math.floor( ( 100/(westForce + eastForce) ) * westForce );
  if ( width < 0 || width > 100 ) {
    gameOver();
  }

  westTug.style.width = width + '%';
  eastTug.style.width = (100 - width) + '%';
}

setInterval(myAttack, 50);

function checkType(downedkey) {
  if (downedkey == nowWord.charAt(nowCorrect)) {
    paintColor();
    eastForce+=3;
    if (nowWord.length == nowCorrect) changeWord();
  } else {
    eastForce-=1;
  }
}

function paintColor () {
  nowCorrect++; // 正答文字数のカウントUP

  var touchedLetter = document.createElement('span');
  touchedLetter.className = 'touched-letter';
  touchedLetter.textContent = nowWord.substr(0,nowCorrect);
  var untouchedLetter = document.createElement('span');
  untouchedLetter.className = 'untouched-letter';
  untouchedLetter.textContent = nowWord.substr(nowCorrect, nowWord.length);

  wordArea.textContent = null;

  wordArea.appendChild(touchedLetter);
  wordArea.appendChild(untouchedLetter);
}

// 出題単語を変更する処理
function changeWord() {
  nowCorrect = 0; // 正答文字数のカウンターを元に戻す
  var word = Math.floor(Math.random() * wordList.length);
  wordArea.textContent = nowWord = wordList[word];
}

function gameOver() {
  console.log('ゲームオーバ！');
}

// キー押下のイベントリスナー
document.addEventListener('keydown', function(event) {
  checkType(event.key);
});
