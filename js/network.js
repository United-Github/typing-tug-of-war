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
	var user = new Firebase("https://tug-of-war-adba1.firebaseio.com/user/");
	var userIndex = -1;
	var usersList = null;
	user.on("value", function(snapshot) {
		usersList = snapshot.val();
	});
	// // 変更時の処理
	user.on("child_changed", function(snapshot) {
		this.usersList = snapshot.val();
	});

	// プレイヤーログイン
	this.loginPlayer = function (index, name) {
		if (index < 0 && 3 < index) return false;
		if (usersList[index] !== "") return false;
		userIndex = index;
		usersList[index] = userName = name;
		user.set(usersList);
		return true;
	}
}
$(function (){
	var game = new tugOfWar();
	$(".js_Check").on("click", function() {
		console.log(game.loginPlayer(1,"tanaka"));
	});
})
main();