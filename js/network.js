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
	var user = new Firebase("https://tug-of-war-adba1.firebaseio.com/user");
	var userIndex = -1;
	var usersList = [];

	var typing = new Firebase("https://tug-of-war-adba1.firebaseio.com/typing/total");
	var typingList = [];

	// userListを取得
	user.on("value", function(snapshot) {
		usersList = snapshot.val();
	});
	// // 変更時の処理
	user.on("child_changed", function(snapshot) {
		usersList = snapshot.val();
	});

	// typingListを取得
	typing.on("value", function(snapshot) {
		typingList = snapshot.val();
		console.log(typingList);
	});
	// // 変更時の処理
	typing.on("child_changed", function(snapshot) {
		typingList = snapshot.val();
	});


	// プレイヤーログイン(番号(0~3)、名前)
	this.loginPlayer = function (index, name) {
		if (index < 0 && 3 < index) return false;
		if (usersList[index] !== "") return false;
		userIndex = index;
		usersList[index] = userName = name;
		typingList[index] = 0;
		user.update({[index] : name});
		typing.update({[index]:0});
		return true;
	}

	// プレイヤーログアウト
	this.logoutPlayer = function () {
		if (userIndex !== -1) {
			user.update({[userIndex] : ""});
			typing.update({[index]:0});
			usersList[userIndex] = "";
			userIndex = -1;
			return true;
		} 
		return false;
	}


}

$(function (){
	var game = new tugOfWar();
	$(".js_Click").on("click", function() {
		console.log(game.loginPlayer(1,"tanaka"));
	});
	$(".js_Check").on("click", function() {
		console.log(game.logoutPlayer());
	});
})
main();