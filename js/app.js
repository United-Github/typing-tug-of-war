var game;
var gameReadyScene = document.querySelector('#js-game-ready');
selectRoom();

// game.setChangeEvent('user', function(array, updateKey){
//   console.log(array, updateKey);
// });

function selectRoom() {
  $(".room-name h3").on('click', function(){
      // if ($(this).children('span').text() === "4") {
      //   return ;
      // }
      var loginScene = document.getElementById('js-scene-room');
      $('#js-scene-room').remove();
      loginScene.style.opacity = '0';
      registerName($(this).data('index'));
  });
}

function registerName($id) {
  if (game === undefined) {
    game = new tugOfWar($id);
  }
  $('.js-login').on('click', function(){
    $(this).toggleClass('is-check');
    var input = $(this).parent().parent().find('.js-name');

    var index = input.data('index');
    var name  = input.val();
    $('.js-member-list').find('p').eq(index).text(name); // ゲーム画面のチームメンバーリストに名前を表示
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
  var gameoverFlag = false;
  // 仮の単語リスト（適当）
  var wordList = ['piyo', 'huga', 'hoge', 'network', 'oracle', 'environment', 'install', 'template', 'sass', 'include', 'extend', 'add', 'remove', 'append', 'typing', 'browser', 'value', 'javascript', 'c', 'script', 'python', 'ruby', 'design', 'node', 'array', 'element', 'index', 'undefined', 'function', 'php', 'doctype', 'github', 'api', 'architecture', 'application', 'sublimetext', 'foreach', 'int', 'modules', 'view', 'model', 'readme', 'programming', 'version', 'export', 'import', 'input', 'document', 'variable', 'content', 'division', 'markup', 'math', 'length', 'header', 'language', 'encode', 'decode', 'settings', 'stylesheet', 'console', 'error', 'handling', 'class', 'native', 'sudo', 'keyboard', 'pointer', 'format', 'query', 'queue', 'selector'];

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

  var totalTyping = 0;

  var timeLimit = 60; // 単位:秒
  var leftTime = timeLimit;

  timeKeeper();
  function timeKeeper() {
    if(gameoverFlag){
      leftTime = 0;
      return;
    };
    leftTime--;
    $('.js-timer').text(leftTime);
    setTimeout(function() {
      timeKeeper();
    }, 1000);
    if(leftTime == 0) {
      gameOver();
      return;
    }
  }
  var playersName = game.getElement('user');
  $('.js-playing_name').each(function() {
    $(this).text(playersName[$(this).data('index')]);
  });




  var westForceCurrent = 0;
  var eastForceCurrent = 0;
  var westForcePrevious = 0;
  var eastForcePrevious = 0;

  function westAttack() {
    westForceCurrent = game.getElement('typing')[0] + game.getElement('typing')[1];
    var westTypeSpeed = (game.getElement('typing')[0] + game.getElement('typing')[1]) - westForcePrevious;
    westForcePrevious = westForceCurrent;
    return westTypeSpeed;
  }

  function eastAttack() {
    eastForceCurrent = game.getElement('typing')[2] + game.getElement('typing')[3];
    var eastTypeSpeed = (game.getElement('typing')[2] + game.getElement('typing')[3]) - eastForcePrevious;
    eastForcePrevious = eastForceCurrent;
    return eastTypeSpeed;
  }


  function reloadView() {
    wA = westAttack() + 1;
    eA = eastAttack() + 1;
    console.log(wA, eA);
    var width = 100 / ( wA + eA ) * wA;
    console.log(width);
    westTug.style.width = width + 'vw';
    eastTug.style.width = (100-width) + 'vw';
  }

  setInterval(function() {
    reloadView();
  }, 1000);

  function checkType(downedkey) {
    if(gameoverFlag) return;
    if (downedkey == nowWord.charAt(nowCorrect)) {
      paintColor();
      current++;
      if (nowWord.length == nowCorrect) changeWord();
    }
  }

  function paintColor () {
    nowCorrect++; // 正答文字数のカウントUP
    totalTyping++; // 総計を取得
    game.setTyping(totalTyping);

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
    setTimeout(function() {
      gameoverFlag = true;
      var westTeamScore = westTug.style.width;
      var eastTeamScore = eastTug.style.width;
      if (westTeamScore > eastTeamScore) {
        // 西の勝ち
        westTug.classList.add('win');
      } else if (westTeamScore < eastTeamScore) {
        // 東の勝ち
        eastTug.classList.add('win');
      } else {
        // 同点
        console.log('同点！');
      }
      game.initialize();
      delete game;
      game = undefined;
    }, 1200);
  }

  // キー押下のイベントリスナー
  document.addEventListener('keydown', function(event) {
    checkType(event.key);
  });
}
