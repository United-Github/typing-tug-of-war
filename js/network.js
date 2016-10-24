// var main = function(){
// 	// // Initialize Firebase
// 	// var config = {
// 	// 	apiKey: "AIzaSyB4SrBOJXjb96oQHhufas5bU01AqJcZ6oQ",
// 	// 	authDomain: "tug-of-war-fc1a3.firebaseapp.com",
// 	// 	databaseURL: "https://tug-of-war-fc1a3.firebaseio.com",
// 	// 	storageBucket: "",
// 	// 	messagingSenderId: "69512977389"
// 	// };
// 	// firebase.initializeApp(config);
// 	// console.log('初期化したよ');
// 	// var hoge = '1';
// }

// firebase
function tugOfWar() {

	// Keyとvalueを取得できるforInを作成
	Object.defineProperty(Object.prototype, "forIn", {
		value: function(fn, self) {
			self = self || this;

			Object.keys(this).forEach(function(key, index) {
				var value = this[key];

				fn.call(self, key, value);
			}, this);
		}
	});

	// 更新時のイベント関数配列(ユーザー用)
	this.changeEvent = [];
	// 更新時のイベント関数配列(オブジェクト内用)
	this.changeEventForSystem = [];
	// FireBase配列
	this.fire = [];
	// 取得データ配列
	this.table = [];
	// Userの番号
	this.userIndex = -1;
	// 元のURI
	this.baseUri = "https://tug-of-war-adba1.firebaseio.com/";

	// 全員が更新が変わったときのイベント
	this.changeReadyEvent = function(ready){};

	// FireBaseオブジェクトのインスタンス化
	this.fire['user'] = new Firebase(this.baseUri + "user");
	this.fire['typing'] = new Firebase(this.baseUri + "typing/total");
	this.fire['ready'] = new Firebase(this.baseUri + "ready");

	// fireのイベント登録
	this.fire.forIn(function(key, value) {

		// コールバックイベントの初期化
		this.changeEvent[key] = function(array, updateKey) {};
		this.changeEventForSystem[key] = function(){};

		// テーブルを取得できた時のイベント登録
		value.on("value", function(snapshot) {
			this.table[key] = snapshot.val();
		}.bind(this));

		// テーブルが更新された時のイベント登録
		value.on("child_changed", function(snapshot) {
			this.table[key][snapshot.key()] = snapshot.val();
			this.changeEvent[key](this.table[key],snapshot.key());
			this.changeEventForSystem[key]();
		}.bind(this));

	}.bind(this));

	// 削除時の処理
	$(window).unload(function() {
		this.logoutPlayer();
	}.bind(this));

	// readyの変更時のイベント
	this.changeEventForSystem['ready'] = function (){
		var flag = true;
		this.table['ready'].forEach(function(element) {
			if (element === 0) flag = false;
		}, this);
		// 全員が準備できていたらtrue
		this.changeReadyEvent(flag);
	}.bind(this);


}
	// チェンジイベントの登録 (データ名, イベント関数)
	tugOfWar.prototype.setChangeEvent = function(key, func) {
		if (this.changeEvent[key] === undefined) return false;
		this.changeEvent[key] = func;
		return true;
	}

	// 初期化処理
	tugOfWar.prototype.initializePlayer = function() {
		if (this.userIndex === -1) return false;
		this.table['typing'][this.userIndex] = 0;
		this.table['ready'][this.userIndex] = 0;
		this.fire['typing'].update({[this.userIndex]:0});
		this.fire['ready'].update({[this.userIndex] : 0});
		return true;
	}
	// プレイヤーのログイン(番号, ユーザー名)
	tugOfWar.prototype.loginPlayer = function (index, name) {
		if (this.userIndex !== -1) return false;
		if (index < 0 && 3 < index) return false;
		if (this.table['user'][index] !== "") return false;
		this.userIndex = index;
		this.table['user'][index] = name;
		this.fire['user'].update({[index] : name});
		this.initializePlayer();
		return true;
	}
	// プレイヤーのログアウト処理
	tugOfWar.prototype.logoutPlayer = function () {
		if (this.userIndex === -1) return false;
			this.fire['user'].update({[this.userIndex] : ""});
			this.table['user'][this.userIndex] = "";
			this.initializePlayer();
			this.userIndex = -1;
			return true;
	}
	// ready変更時のイベント登録(セットする関数の引数には、全員が準備できていたらtrue)
	tugOfWar.prototype.setReadyEvent = function(func) {
		this.changeReadyEvent = func;
	}

	// テーブル内の値の取得
	tugOfWar.prototype.getElement = function(key) {
		return (key in this.table) ? this.table[key] : [];
	}

	// 準備状態のセッター
	tugOfWar.prototype.setStatusReady = function(status) {
		if (this.userIndex !== -1 ){
			status = status ? 1 : 0;
			this.table['ready'][this.userIndex] = status;
			this.fire['ready'].update({[this.userIndex] : status});
		}
	}

$(function (){
	var game = new tugOfWar();
	game.setChangeEvent('user', function(array, updateKey){
		console.log(array, updateKey);
	});
	$(".js_Click").on("click", function() {
		console.log(game.getElement('user'));
		// console.log(game.test());
		console.log(game.loginPlayer(1,"tanaka"));
	});
	$(".js_Check").on("click", function() {
	game.setStatusReady(true);
		// console.log(game.logoutPlayer());
	});
})
