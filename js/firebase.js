
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update ,remove} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import firebaseConfig from "./api.js"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// データベース関係
// Initialize Realtime Database and get a reference to the serv ice
const db = getDatabase(app);

window.db = db;
window.firebaseRef = ref;
window.firebaseSet = set;

$("#create-room").on("click", async function () {
    window.player_tag = 1
    window.roomNum = Math.floor(Math.random() * (99999 - 10000) + 10000);
    $("#room-id").text("ID:" + roomNum);

    create_start()
    // プレイヤー１手札準備
    let dbRef = ref(db, roomNum + "/player1/player_hands");
    let msg = player_hands
    await set(dbRef, msg)

    dbRef = ref(db, roomNum + "/player1/cpu_hands");
    msg = cpu_hands
    await set(dbRef, msg)

    // プレイヤー２手札準備
    dbRef = ref(db, roomNum + "/player2/player_hands");
    msg = cpu_hands
    await set(dbRef, msg)

    dbRef = ref(db, roomNum + "/player2/cpu_hands")
    msg = player_hands
    await set(dbRef, msg)

    subscribeRoom(roomNum)
});

$("#join-room").on("click", async function () {
    try {
        window.player_tag = 2
        window.roomNum = $("#roomNum").val();
        $("#room-id").text("ID:" + roomNum);

        let dbRef = ref(db, roomNum + "/player2/player_hands");
        let get_player_hands = await get(dbRef);
        let player_hands = get_player_hands.val();

        dbRef = ref(db, roomNum + "/player2/cpu_hands");
        let get_cpu_hands = await get(dbRef);
        let cpu_hands = get_cpu_hands.val();

        join_start(player_hands, cpu_hands)
    } catch (error) {
        location.reload()
    }

    subscribeRoom(roomNum)
});

function subscribeRoom(roomNum) {
    const roomRef = ref(db, roomNum.toString());
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val() || {};
        const p1_select = data.player1.select;
        const p2_select = data.player2.select;
        const p1_next = data.player1.next;
        const p2_next = data.player2.next

        if (p1_select) {
            if (player_tag == 2) {
                window.cpu_hand = p1_select
                $("#cpu-field-" + battle_count).hide()
                $("#cpu-board").show();
            }
        }
        if (p2_select) {
            if (player_tag == 1) {
                window.cpu_hand = p2_select

                $("#cpu-field-" + battle_count).hide()
                $("#cpu-board").show();
            }
        }
        if (p1_select && p2_select) {
            $("#cpu-board").delay(300).fadeOut(500);
            $("#cpu-" + cpu_hand.slice(0, 1)).delay(1800).fadeIn(500);
            if (cpu_hand.slice(0, 1) == "g") {
                g_count -= 1
            } else if (cpu_hand.slice(0, 1) == "c") {
                c_count -= 1
            } else if (cpu_hand.slice(0, 1) == "p") {
                p_count -= 1
            }
            judge()
            update(roomRef, {
                "player1/select": null,
                "player2/select": null,
            })
        }
        if (p1_next && p2_next) {
            next()
            battle_count += 1
            update(roomRef, {
                "player1/next": null,
                "player2/next": null,
            })
        }
    });
}

window.deleteRoom = async function(roomNum) {
    const roomPath = roomNum.toString();
    await remove(ref(db, roomPath));
};
