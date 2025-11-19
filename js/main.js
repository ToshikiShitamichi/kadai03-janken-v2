/* ゲームフロー
1.スタート/2.カード配布
3.カード選択/4.相手カード表示/5.勝敗判定
6.次へ
7.4回戦後、終了
8.2敗している場合、山札開示ボタン表示
*/

//カードマスター
var cards = ["g-1", "g-2", "g-3", "g-4", "g-5", "c-1", "c-2", "c-3", "c-4", "c-5", "p-1", "p-2", "p-3", "p-4", "p-5"]
//カード枚数
var cards_count = 15
//プレイヤー手札
var player_hands = []
//CPU手札
var cpu_hands = []
//グー枚数
var g_count = 0
//チョキ枚数
var c_count = 0
//パー枚数
var p_count = 0
//勝利数
var win_count = 0
//敗北数
var lose_count = 0
//引分数
var draw_count = 0
//対戦回数
var battle_count = 1

// let
// オブジェクト
// Object

var hand_card_html = '<div class="hand-card"><img id="player-field-1" class="player-hand-card" src="" alt=""><img id="player-field-2" class="player-hand-card" src="" alt=""><img id="player-field-3" class="player-hand-card" src="" alt=""><img id="player-field-4" class="player-hand-card" src="" alt="">'

$("input[type=number]").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $('#join-room').trigger('click');
    }
})

// ボード初期化関数
function board_hide() {
    $("#player-g,#player-c,#player-p,#cpu-g,#cpu-c,#cpu-p,#judge-msg,#cpu-board").hide();
}

// 1.スタート
$("body").addClass("remove-scrolling");
$(".content").hide();

function start() {
    $(".start").fadeOut(1000);
    $(".content").delay(1000).fadeIn(500);

    $("#next").hide();
    $("#finish").hide();
    board_hide();
}

function create_start() {
    start()
    for (let i = 0; i < 4; i++) {

        let select_num = Math.floor(Math.random() * cards_count)
        let select_card = cards[select_num]

        player_hands.push(select_card);
        cards.splice(select_num, 1)
        cards_count -= 1;
        if (select_card.slice(0, 1) == "g") {
            g_count += 1
        } else if (select_card.slice(0, 1) == "c") {
            c_count += 1
        } else if (select_card.slice(0, 1) == "p") {
            p_count += 1
        }

        $("#player-field-" + (i + 1)).attr("id", select_card);
        $("#" + select_card).attr("src", "./img/" + select_card.slice(0, 1) + ".png");
    }
    for (let i = 0; i < 4; i++) {
        let select_num = Math.floor(Math.random() * cards_count)
        let select_card = cards[select_num]

        cpu_hands.push(select_card);
        cards.splice(select_num, 1)
        cards_count -= 1;
        if (select_card.slice(0, 1) == "g") {
            g_count += 1
        } else if (select_card.slice(0, 1) == "c") {
            c_count += 1
        } else if (select_card.slice(0, 1) == "p") {
            p_count += 1
        }
    }
    $("#remaining-g").text("×" + g_count);
    $("#remaining-c").text("×" + c_count);
    $("#remaining-p").text("×" + p_count);
}

function join_start(player_hands, cpu_hands) {
    start()

    i = 0
    player_hands.forEach(select_card => {
        if (select_card.slice(0, 1) == "g") {
            g_count += 1
        } else if (select_card.slice(0, 1) == "c") {
            c_count += 1
        } else if (select_card.slice(0, 1) == "p") {
            p_count += 1
        }

        $("#player-field-" + (i + 1)).attr("id", select_card);
        $("#" + select_card).attr("src", "./img/" + select_card.slice(0, 1) + ".png");
        i += 1
    })
    cpu_hands.forEach(select_card => {
        if (select_card.slice(0, 1) == "g") {
            g_count += 1
        } else if (select_card.slice(0, 1) == "c") {
            c_count += 1
        } else if (select_card.slice(0, 1) == "p") {
            p_count += 1
        }
    });

    $("#remaining-g").text("×" + g_count);
    $("#remaining-c").text("×" + c_count);
    $("#remaining-p").text("×" + p_count);
}

// 3.カード選択
$(document).on("click", ".player-hand-card", async function () {
    $("#reset").hide();
    $(".player-hand").css({ "pointer-events": "none" }); //クリック不可
    $("#score").hide();

    window.player_hand = $(this).attr("id");
    if (player_hand.slice(0, 1) == "g") {
        g_count -= 1
    } else if (player_hand.slice(0, 1) == "c") {
        c_count -= 1
    } else if (player_hand.slice(0, 1) == "p") {
        p_count -= 1
    }

    $("#" + player_hand).hide();
    $("#player-" + player_hand.slice(0, 1)).show();


    const player_tag = window.player_tag;
    const roomNum = window.roomNum;
    const db = window.db;
    const ref = window.firebaseRef;
    const set = window.firebaseSet;

    if (player_tag == 1) {
        let dbRef = ref(db, roomNum + "/player1/select");
        let msg = player_hand
        await set(dbRef, msg)
    } else if (player_tag == 2) {
        let dbRef = ref(db, roomNum + "/player2/select");
        let msg = player_hand
        await set(dbRef, msg)
    }
})

function judge() {
    // 5.勝敗判定
    if (player_hand.slice(0, 1) == "g") {
        if (cpu_hand.slice(0, 1) == "g") {
            draw_count += 1;
            $("#judge-msg").text("引分");
        } else if (cpu_hand.slice(0, 1) == "c") {
            win_count += 1;
            $("#judge-msg").text("勝利");
        } else if (cpu_hand.slice(0, 1) == "p") {
            lose_count += 1;
            $("#judge-msg").text("敗北");
        }
    } else if (player_hand.slice(0, 1) == "c") {
        if (cpu_hand.slice(0, 1) == "g") {
            lose_count += 1;
            $("#judge-msg").text("敗北");
        } else if (cpu_hand.slice(0, 1) == "c") {
            draw_count += 1;
            $("#judge-msg").text("引分");

        } else if (cpu_hand.slice(0, 1) == "p") {
            win_count += 1;
            $("#judge-msg").text("勝利");
        }
    } else if (player_hand.slice(0, 1) == "p") {
        if (cpu_hand.slice(0, 1) == "g") {
            win_count += 1;
            $("#judge-msg").text("勝利");
        } else if (cpu_hand.slice(0, 1) == "c") {
            lose_count += 1;
            $("#judge-msg").text("敗北");
        } else if (cpu_hand.slice(0, 1) == "p") {
            draw_count += 1;
            $("#judge-msg").text("引分");
        }
    }
    $("#judge-msg").delay(2300).fadeIn(0);


    $("#score").html(win_count + "勝" + lose_count + "敗" + "<br>" + draw_count + "分")
    $("#score").delay(2300).fadeIn(0);

    if (win_count + lose_count + draw_count < 4) {
        $("#next").delay(2300).fadeIn(0);
    } else {
        $("#finish").delay(2300).fadeIn(0);
    }

}

// 6.次へ
$("#next").on("click", async function () {
    $("#next").hide();
    const roomNum = window.roomNum;
    const db = window.db;
    const ref = window.firebaseRef;
    const set = window.firebaseSet;

    if (player_tag == 1) {
        let dbRef = ref(db, roomNum + "/player1/next");
        let msg = true
        await set(dbRef, msg)
    } else if (player_tag == 2) {
        let dbRef = ref(db, roomNum + "/player2/next");
        let msg = true
        await set(dbRef, msg)
    }
});

function next() {
    board_hide(); //ボード初期化

    $(".player-hand").css({ "pointer-events": "auto" }); //クリック許可

    $("#remaining-g").text("×" + g_count);
    $("#remaining-c").text("×" + c_count);
    $("#remaining-p").text("×" + p_count);
}


// 7.終了
$("#finish").on("click", function () {
    alert(win_count + "勝" + lose_count + "敗" + draw_count + "分\n勝率:" + (Math.round(win_count / 4 * 1000) / 10) + "%")
    if (window.player_tag == 1) {
        window.deleteRoom(window.roomNum);
    }
    location.reload()
});

