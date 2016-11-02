var game = new tugOfWar();
var gameReadyScene = document.querySelector('#js-game-ready');
registerName();

// game.setChangeEvent('user', function(array, updateKey){
//   console.log(array, updateKey);
// });

function registerName() {
  $('.js-login').on('click', function(){
    $(this).toggleClass('is-check');
    var input = $(this).parent().find('.js-name');

    var index = input.data('index');
    var name  = input.val();

    game.loginPlayer(index, name);
    game.setStatusReady(true);
  });

  // ready の監視
  game.setReadyEvent(function(flag){
    if(flag === true) {
      // 全員が準備できた
      var loginScene = document.getElementById('js-scene-login');
      loginScene.style.opacity = '0';
      countDown();
    } else {
      // 全員の準備ができていない
      console.log('準備未完了');
    }
  });

}

function countDown() {
  var number = document.querySelector('#js-count-number');

  var count = 5;
  function countNum () {
    number.textContent = count;
    count--;
    if (count == -1) {
      setTimeout(function() {
        fadeOutReady();
      }, 300);
    }
  }
  setInterval(function() { countNum(); }, 1000);

  function fadeOutReady() {
    gameReadyScene.style.transition = 'all .2s ease-in-out';
    gameReadyScene.style.opacity = '0';
    gameReadyScene.style.transform = 'scale(0.8)';
    gameStart();
  }
}

function gameStart() {
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

  var previous = 0; // n回目のタイピング速度
  var current = 0; // n+1回目のタイピング速度

  function attackForce() {
    var typeSpeed = current - previous;
    previous = current;
    return typeSpeed;
  }

  function reloadView() {
    westForce = attackForce();
    eastForce = 3;

    var width = 100 / (westForce + eastForce) + eastForce;
    westTug.style.width = width + 'vw';
    eastTug.style.width = (100-width) + 'vw';
  }

  setInterval(function() {
    reloadView();
  }, 1000);

  function checkType(downedkey) {
    if (downedkey == nowWord.charAt(nowCorrect)) {
      paintColor();
      current++;
      if (nowWord.length == nowCorrect) changeWord();
    } else {

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

}
