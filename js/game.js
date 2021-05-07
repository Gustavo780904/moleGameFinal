const $levels = { "easy": 3, "medium": 5, "hard": 7 }
const $imgWidth = 100
const $imgHeight = 80
const $imgsTheme = { "default": "buraco.gif", "active": "toupeira.gif", "dead": "morreu.gif" }
const $initialTime = 10;

var $timeGame = $initialTime;
var $idChronoGame; //setInterval
var $idChronoStartGame; //startgame
var $molePosition = 0; //guarda a posição da toupeira
var $scoreBoard;
var $level = getLevel();
var $ranking;
var $topFive = new Array();

$(document).ready(function() {
    let users = [{
                "id": 1,
                "username": "Gustavo",
                "pwd": "20",
                "scores": [{
                        "id": 2,
                        "score": 5,
                        "level": "hard"
                    },
                    {
                        "id": 3,
                        "score": 10,
                        "level": "easy"
                    },
                    {
                        "id": 4,
                        "score": 15,
                        "level": "easy"
                    }
                ]
            },
            {
                "id": 2,
                "username": "Elisa",
                "pwd": "10",
                "scores": [{
                    "id": 5,
                    "score": 150,
                    "level": "easy"
                }]
            },
            {
                "id": 3,
                "username": "Tati",
                "pwd": "2",
                "scores": [{
                        "id": 5,
                        "score": 20,
                        "level": "easy"
                    },
                    {
                        "id": 5,
                        "score": 2,
                        "level": "easy"
                    },
                    {
                        "id": 5,
                        "score": 10,
                        "level": "easy"
                    }
                ]
            }
        ]
        // for (var data in users) {
        //     console.log(users.map(users => ({ users: users.username, scores: users.scores.filter(scores => scores.level === 'easy') })));
        // }

    $ranking = users.map(users => ({ users: users.username, scores: users.scores.filter(scores => scores.level === "easy") }));
    //repetir usando foreach
    console.log($ranking);
    for (var data in $ranking.scores) {
        $topFive[data] = $ranking.username,
            console.log($ranking.scores)
    }

    // console.log(users.map(users => ({ users: users.username, scores: users.scores.filter(scores => scores.level === `${$level}`) })));

    // for (var data in users) {
    //     $levelEasy[data] = users[data].scores.filter(scores => scores.level == "easy")
    //     for (var data in $levelEasy) {
    //         var $rankingEasy = $levelEasy
    //     }
    //     console.log(users[data].username, users[data].scores[data].score)
    // }


    // for (var data in users) {

    //     for (var data in users[data].scores) {
    //         var score = scores[data].score
    //         return score
    //     }
    //     console.log("Nome na posição " + data + ' = ' + ordemD[data].username + ', ' +
    //         " score: = " + scores[data].score);
    // }



    fillboard();
    $("#level").prop("disabled", false);

    $("#chrono").text($initialTime)

    $("#btnPlay").click(function() {
        btnCtrl(1);
        play();
    });

    $("#btnResume").click(function() {
        btnCtrl(1);
        play();
    });

    $('#btnPause').click(function() {
        btnCtrl(2);
        pause();
    });

    $("#btnStop").click(function() {
        stop();
        btnCtrl(3);
    });
    $("#btnExit").click(function() {
        exit();
    });
})

function btnCtrl(schema) {
    switch (schema) {
        case 1:
            $("#level").prop("disabled", true);
            $("#btnPlay").prop("disabled", true);
            $("#btnResume").prop("disabled", true);
            $("#btnPause").prop("disabled", false);
            $("#btnStop").prop("disabled", false);
            break;
        case 2:
            $("#level").prop("disabled", true);
            $("#btnPlay").prop("disabled", true);
            $("#btnResume").prop("disabled", false);
            $("#btnPause").prop("disabled", true);
            $("#btnStop").prop("disabled", false);
            break;
        case 3:
            $("#level").prop("disabled", false);
            $("#btnPlay").prop("disabled", false);
            $("#btnResume").prop("disabled", true);
            $("#btnPause").prop("disabled", true);
            $("#btnStop").prop("disabled", true);
            break;
    }
}

function start() {
    alertWifi(`Seu objetivo é eliminar o maior número de toupeiras, você está pronto?`, false, 0, "", "50", false, true)
}

function play() {
    $('#chrono').toggleClass('chrono');
    $idChronoStartGame = setInterval(startGame, 1180);
    // a cada um segundo aciona startChronoGame e decrementa segundo.
    $idChronoGame = setInterval(startChronoGame, 1000);
}

function resume() {
    play();
}

function pause() {
    $('#chrono').toggleClass('btnPause');

    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame)
    $(`#mole_${$molePosition}`).attr("src", `img/${$imgsTheme.default}`);
    $('#chrono').toggleClass('chrono');
}

function stop() {
    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame)
    $(`#mole_${$molePosition}`).attr("src", `img/${$imgsTheme.default}`);
    fillboard();
    btnCtrl(3);
    $("#score").text("0");
    $timeGame = $initialTime;
    $scoreBoard = $("#chrono").text($timeGame); //alimenta o ranking
}

function exit() {
    pause();
    alertWifi(`Deseja realmente sair do jogo?`, false, 0, "", "50", true)
        // window.open("login.html", "_self")
}


function startChronoGame() {
    let $secondsFormat = (--$timeGame).toLocaleString("pt-br", { minimumIntegerDigits: 2 });
    ($timeGame >= 0) ? $("#chrono").text($secondsFormat): endGame();
}

function endGame() {
    alertWifi(`Fim de Jogo. Voce gabhou = ${$("#score").text()} abóboras!`, false, 0, "", "50", false, false)
    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame);
    fillboard();
    btnCtrl(3);
    $("#score").text("0");
    $timeGame = $initialTime;
    $scoreBoard = $("#chrono").text($timeGame); //variavel que alimenta o ranking
}

//cria o tabuleiro(moldura)conforme o nivel
function fillboard() {
    // alert($("#level").val())
    $level = getLevel();
    $boardWidth = $imgWidth * $level
    $boardHeight = $imgHeight * $level
    $("#board").css({ "width": $boardWidth, "height": $boardHeight })
    placeHolesBoard($level)
}
//insere os buracos no tabuleiro
function placeHolesBoard($level) {
    $("#board").empty()
    for ($i = 0; $i < Math.pow($level, 2); $i++) {
        $div = $("<div></div>"); //.attr("id", `mole_${$i+1}`);
        $img = $("<img>").attr({ "src": `img/${$imgsTheme.default}`, "id": `mole_${$i+1}` });
        $($img).click(function() { updateScore(this) });
        $($div).append($img);
        $("#board").append($div);
    }
}
//acrescenta 1 ponto no placar e mostra a toupeira vermelha quando acerta.
function updateScore($img) {
    if ($($img).attr("src").search("toupeira") != -1) {
        $("#score").text(parseInt($("#score").text()) + 1);
        $($img).attr({ "src": `img/${$imgsTheme.dead}` })
    }
}
//faz a toupeira sair dos buracos 
function startGame() {
    // fillboard()
    $(`#mole_${$molePosition}`).attr("src", `img/${$imgsTheme.default}`);
    $level = getLevel();
    $randNumber = getRandNumber(1, Math.pow($level, 2));
    $(`#mole_${$randNumber}`).attr("src", `img/${$imgsTheme.active}`);
    $molePosition = $randNumber;
}

//funções auxiliares
function getRandNumber(min, max) {
    return Math.round((Math.random() * Math.abs(max - min)) + min);
}

function getLevel() {
    return $levels[$("#level").val()]
}