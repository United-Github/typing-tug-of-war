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

	Object.defineProperty(Object.prototype, "forIn", {
		value: function(fn, self) {
			self = self || this;

			Object.keys(this).forEach(function(key, index) {
				var value = this[key];

				fn.call(self, key, value);
			}, this);
		}
	});

	this.changeEvent = [];
	this.fire = [];
	this.table = [];
	this.userIndex = -1;
	this.baseUri = "https://tug-of-war-adba1.firebaseio.com/";

	this.fire['user'] = new Firebase(this.baseUri + "user");
	this.fire['typing'] = new Firebase(this.baseUri + "typing/total");
	this.fire['ready'] = new Firebase(this.baseUri + "ready");

	// fireのイベント登録
	this.fire.forIn(function(key, value) {
		this.changeEvent[key] = function() {};
		value.on("value", function(snapshot) {
			this.table[key] = snapshot.val();
		}.bind(this));
		value.on("child_changed", function(snapshot) {
			this.table[key] = snapshot.val();
			this.changeEvent[key]();
		}.bind(this));
	}.bind(this));

	// 削除時
	$(window).unload(function() {
		console.log(this);
		this.logoutPlayer();
	}.bind(this));

}
	tugOfWar.prototype.setChangeEvent = function(key, func) {
		if (this.changeEvent[key] === undefined) return false;
		this.changeEvent[key] = func;
		return true;
	}

	tugOfWar.prototype.loginPlayer = function (index, name) {
		if (this.userIndex !== -1) return false;
		if (index < 0 && 3 < index) return false;
		if (this.table['user'][index] !== "") return false;
		this.userIndex = index;
		this.table['user'][index] = name;
		this.table['typing'][index] = 0;
		this.fire['user'].update({[index] : name});
		this.fire['typing'].update({[index]:0});
		return true;
	}
	tugOfWar.prototype.logoutPlayer = function () {
		if (this.userIndex === -1) return false;
			this.fire['user'].update({[this.userIndex] : ""});
			this.fire['typing'].update({[this.userIndex]:0});
			this.table['user'][this.userIndex] = "";
			this.userIndex = -1;
			return true;
	} 

$(function (){
	var game = new tugOfWar();
	game.setChangeEvent('ready', function(){
		console.log('changeEvent');
	});
	$(".js_Click").on("click", function() {
		console.log(game.loginPlayer(1,"tanaka"));
	});
	$(".js_Check").on("click", function() {
		console.log(game.logoutPlayer());
	});
})
// main();
// function obj () {
// 	Object.defineProperty(Object.prototype, "forIn", {
// 		value: function(fn, self) {
// 			self = self || this;

// 			Object.keys(this).forEach(function(key, index) {
// 				var value = this[key];

// 				fn.call(self, key, value);
// 			}, this);
// 		}
// 	});

// 	// fireのイベント登録
// 	this.array = {'test':'aaa'};
// 	var that = this;
// 	this.array.forIn(function(key, value) {
// 		console.log(that.array);
// 	});
// }
// obj.prototype.test = function (){

// 	console.log('fda');
// };

// $(function(){
// 	var ins = new obj;
// 	ins.test();
// 	console.log(ins.array);
// });