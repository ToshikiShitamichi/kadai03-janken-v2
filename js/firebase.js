
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import firebaseConfig from "./api.js"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// データベース関係
// Initialize Realtime Database and get a reference to the serv ice
const database = getDatabase(app);

const db = getDatabase();


$("#create-room").on("click", function () {
    const roomNum = Math.floor(Math.random() * (99999 - 10000) + 10000);
    const player_tag = "player_1"
    console.log(roomNum)
    start()
    $("#room-id").text("ID:" + roomNum);
    // プレイヤー１手札準備
    let dbRef_p1_hands = ref(db, roomNum + "/player_1/hands");
    let msg = player_hands
    set(dbRef_p1_hands, msg)
    // プレイヤー２手札準備
    let dbRef_p2_hands = ref(db, roomNum + "/player_2/hands");
    msg = cpu_hands
    set(dbRef_p2_hands, msg)
});



// onChildAdded(dbRef, function (data) {
//     const sendUserIcon = data.val().uI
//     const sendUserName = data.val().uN;
//     const sendDate = data.val().date;
//     const html = data.val().html;
//     let h = '<div class="chat-msg"><p class="chat-detail"><img class="user-icon" src="' + sendUserIcon + '"><span class="username">' + sendUserName + '</span><span class="date">' + sendDate + '</span></p>' + html + '</div><hr>'
//     $(".chat-list").append(h);
// })
