// firebase
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
function roomController() {
	this.baseUri = "https://tug-of-war-adba1.firebaseio.com/";
	this.roomObjList = [];
	this.roomDataList = [[],[],[],[]];
	for (var index = 0; index < 4; index++) {
		this.roomObjList[index] = new Firebase(this.baseUri + "room/" + index + "/user");
	}

	this.roomObjList.forIn(function(key, value) {
		value.on("value", function(snapshot) {
			changeRoomList(key, snapshot.val(), this);
		}.bind(this));
		value.on("child_changed", function(snapshot) {
			changeRoomList(snapshot.key(), snapshot.val(), this);
		}.bind(this));
	}.bind(this));

	function changeRoomList(key, value, o) {
		o.roomDataList[key] = value;
		$('h3[data-index='+ key +'] span').text(getNum(value));
	}

	function getNum(array) {
		var count = 0;
		array.forEach(function(element){
			if (element !== "") {
				count ++;
			}
		});
		return count;
	}
}
roomController.prototype.getRoomList = function() {

}

function tugOfWar($id) {

	// Object.defineProperty(Object.prototype, "forIn", {
	// 	value: function(fn, self) {
	// 		self = self || this;

	// 		Object.keys(this).forEach(function(key, index) {
	// 			var value = this[key];

	// 			fn.call(self, key, value);
	// 		}, this);
	// 	}
	// });


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
	this.baseUri = "https://tug-of-war-adba1.firebaseio.com/room/" + $id + "/";

	// 全員が更新が変わったときのイベント
	this.changeReadyEvent = function(ready){};

	// FireBaseオブジェクトのインスタンス化
	this.fire['user'] = new Firebase(this.baseUri + "user");
	this.fire['typing'] = new Firebase(this.baseUri + "typing");
	this.fire['ready'] = new Firebase(this.baseUri + "ready");

	// fireのイベント登録
	this.fire.forIn(function(key, value) {

		// コールバックイベントの初期化
		this.changeEvent[key] = function(array, updateKey) {};
		this.changeEventForSystem[key] = function(){};

		// テーブルを取得できた時のイベント登録
		value.on("value", function(snapshot) {
			this.table[key] = snapshot.val();
			if (key == 'user') {
				snapshot.val().forIn(function(key, value) {
					$('.js-name').each(function(){
						if ($(this).data('index') == key) {
								$(this).prop('disabled', (value == "")? false : true);
								$(this).val(value);

						}
					});
				});
			}
			if (key == 'ready') {
				snapshot.val().forIn(function(key, value) {
					$('.js-name').each(function(){
						if ($(this).data('index') == key) {

							var button = $(this).parent().find('.js-login');
							if (value == '1') {
								// button.toggleClass('is-check');
							}
							if (value == '1') {
								button.addClass('is-check');
							} else {
								button.removeClass('is-check');
							}
						}
					});
				});
			}
								$(this).parent().find('.js-login')
		}.bind(this));

		// テーブルが更新された時のイベント登録
		value.on("child_changed", function(snapshot) {
			this.table[key][snapshot.key()] = snapshot.val();
			this.changeEvent[key](this.table[key][snapshot.key()],snapshot.key());
			this.changeEventForSystem[key](this.table[key][snapshot.key()],snapshot.key());
		}.bind(this));

	}.bind(this));

	// fireのイベント登録
	// 削除時の処理
	$(window).unload(function() {
		this.logoutPlayer();
	}.bind(this));

	// readyの変更時のイベント
	this.changeEventForSystem['ready'] = function (value, index){
		var flag = true;
		this.table['ready'].forEach(function(element) {
			if (element === 0) flag = false;
		}, this);
		// 全員が準備できていたらtrue
		this.changeReadyEvent(flag);
	}.bind(this);

	this.changeEventForSystem['user'] = function (value, index) {
		$('.js-name').each(function(){
			if ($(this).data('index') == index) {
					$(this).prop('disabled', (value == "")? false : true);
					$(this).val(value);
			}
		});
	}

		console.log(432);
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

	tugOfWar.prototype.setTyping = function(value) {
			if (this.userIndex === -1) return false;
			this.table['typing'][this.userIndex] = value;
			this.fire['typing'].update({[this.userIndex] : value});
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
	tugOfWar.prototype.initialize = function(){
		this.logoutPlayer();
	}

$(function (){
	var hoge = new roomController();
})
