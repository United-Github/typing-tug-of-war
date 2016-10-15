var main = function(){
	// // Initialize Firebase
	// var config = {
	// 	apiKey: "AIzaSyB4SrBOJXjb96oQHhufas5bU01AqJcZ6oQ",
	// 	authDomain: "tug-of-war-fc1a3.firebaseapp.com",
	// 	databaseURL: "https://tug-of-war-fc1a3.firebaseio.com",
	// 	storageBucket: "",
	// 	messagingSenderId: "69512977389"
	// };
	// firebase.initializeApp(config);   
	// console.log('初期化したよ');
	// var hoge = '1';
}

// firebase
function tugOfWar() {
	this.initialize = function() {
		this.user = new Firebase("https://tug-of-war-adba1.firebaseio.com/user/");
		this.userIndex = -1;
		// userListの初期化
		user.on("value", function(snapshot) {
			this.usersList = snapshot.val();
		});
	}
	// 変更時の処理
	user.on("child_changed", function(snapshot) {
		this.usersList = snapshot.val();
	});

	// プレイヤーログイン
	this.loginPlayer = function (index, name) {
		if (index < 0 && 3 < index) return false;
		if (this.usersList[userIndex] === "") return false;
		this.userIndex = index;
		this.usersList[userIndex] = userName = name;
		user.set(usersName);
		return true;
	}
}
$(function (){
	var game = new tugOfWar();
	game.initialize();
})
main();