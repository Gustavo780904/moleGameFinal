const $levels = { "easy": 3, "medium": 5, "hard": 7 }
const $imgWidth = 100
const $imgHeight = 80
const $imgsTheme = { "default": "buraco.gif", "active": "toupeira.gif", "dead": "morreu.gif" }
const $initialTime = 1;

var $timeGame = $initialTime;
var $idChronoGame; //setInterval
var $idChronoStartGame; //startgame
var $molePosition = 0; //guarda a posição da toupeira
var $scoreBoard;
var $level = getLevel();
var $ranking;
var $topFive = new Array();
var $actualLevel;

$(document).ready(function() {

    fillboard();
    ranking();

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

function conection() {
    $.getJSON("https://localhost:8080/", function(dados) {});
}

function ranking() {
    $selectedLevel = select();

    /**
     * @typedef Score Pontuação de um usuário
     * @property {number} id ID da pontuação do usuário
     * @property {number} score Pontuação do usuário
     * @property {string} level Dificuldade
     */

    /**
     * @typedef User
     * @property {number} id ID do usuário
     * @property {string} username Nome do usuário
     * @property {string} pwd ???
     * @property {Array<Score>} scores Lista de pontuações do usuário
     */

    /** @type{Array<User>} */
    const users = [{
            id: 1,
            username: "Gustavo",
            pwd: "20",
            scores: [{
                    id: 2,
                    score: 5,
                    level: "hard",
                },
                {
                    id: 3,
                    score: 10,
                    level: "easy",
                },
                {
                    id: 4,
                    score: 15,
                    level: "easy",
                },
            ],
        },
        {
            id: 2,
            username: "Elisa",
            pwd: "10",
            scores: [{
                id: 5,
                score: 150,
                level: "easy",
            }, ],
        },
        {
            id: 3,
            username: "Tati",
            pwd: "2",
            scores: [{
                    id: 5,
                    score: 20,
                    level: "easy",
                },
                {
                    id: 5,
                    score: 2,
                    level: "easy",
                },
                {
                    id: 5,
                    score: 10,
                    level: "easy",
                },
            ],
        },
    ];

    const highestToLowestSortingStrategy = (a, b) => b - a;

    /**
     * Filtra os dados de uma determinada lista de
     * usuários e ordena suas pontuações através
     * de uma dificuldade
     *
     * @param {Array<User>} users Lista de usuários
     * @param {string} difficulty Dificuldade utilizada para o filtro da pontuação
     * @param {(a: any, b: any) => number} sortingStrategy Estratégia de ordenamento de scores
     * @returns Retorna a lista filtrada de usuários
     */
    const filterScoresByDifficulty = (
            users,
            $level,
            sortingStrategy = highestToLowestSortingStrategy
        ) =>
        users
        .map(({ scores, ...user }) =>
            scores
            .filter((score) => score.level === $level)
            .map((score) => ({
                ...user,
                ...score,
            }))
        )
        .reduce((list, next) => [...list, ...next], [])
        .sort((a, b) => sortingStrategy(a.score, b.score));

    const filteredLevelScoresHighestToLowest = filterScoresByDifficulty(
        users,
        $selectedLevel
    );
    // console.log(filteredLevelScoresHighestToLowest);
    $ranking = filteredLevelScoresHighestToLowest
    return $ranking;
}

//habilita/desabilita os botões
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
    // $actualLevel = select();
    console.log($actualLevel)
    console.log($ranking)
    alertWifi(`Fim de Jogo. Voce ganhou ${$("#score").text()} abóboras!`, false, 0, "", "40", false, false, `Level: ${$actualLevel}`, $ranking)
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
    // $level = getLevel();
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

function select() {
    return $actualLevel = $("#level").val();
}