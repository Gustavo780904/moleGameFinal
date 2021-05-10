const $levels = { "easy": 3, "medium": 5, "hard": 7 }
const $imgWidth = 100
const $imgHeight = 80
const $imgsTheme = { "default": "buraco.gif", "active": "toupeira.gif", "dead": "morreu.gif" }
const $initialTime = 10;

// var $tema = new Audio('tema.mp3');
// var $motoLigada = new Audio('motoLigada.mp3');
// var $motoLigada = new Audio('motoLigada.mp3');
// var $motoLigada = new Audio('motoLigada.mp3');
var $users = new Array();
var $timeGame = $initialTime;
var $idChronoGame; //setInterval
var $idChronoStartGame; //startgame
var $molePosition = 0; //guarda a posição da toupeira
var $scoreBoard;
var $level = getLevel();
var $ranking;
var $topFive = new Array();
var $actualLevel;
var $idUser = iDlogin();
var $actualUser = username();
var $finalScore = 0;
var $score;


// var $dados = new Array();

$(document).ready(function() {
    //baixa o json
    $.getJSON("http://localhost:8080/user", json);

    //
    function json(json) {
        $users = json
            // ranking(json)
    }
    //filtra por level e score 
    // ranking()
    // $tema.play();
    // $motoLigada.play();
    fillboard();
    //buscam os dados no seesionStore
    iDlogin();
    username();
    //libera o select do level
    $("#level").prop("disabled", false);
    //insere o cronometro e o usuario
    $("#chrono").text($initialTime);
    $("#usuario").text($actualUser);
    console.log($actualUser)
    console.log($idUser)
        //controle dos botoes
    $("#btnPlay").click(function() {
        btnCtrl(1);
        //tem que chamar start
        start();
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
    //limpa o ponteiro do cursor
    $("main").mousedown(function(e) {
        e.preventDefault();
        $(this).blur();
        return false;
    });

})


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
//abre o wifi inicial
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
    $("#chrono").text($timeGame);
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
    $score = $finalScore;
    console.log($finalScore)
    console.log($score)
        // $users.push({ "score": $score, "level": $actualLevel });
    ranking($users);
    // console.log($actualLevel)
    // console.log($ranking)
    saveScore($score);
    // console.log($finalScore)
    alertWifi(`Fim de Jogo. Voce ganhou ${$("#score").text()} abóboras!`, false, 0, "", "40", false, false, `Level: ${$actualLevel}`, $ranking)
        //reseta o jogo
    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame);
    fillboard();
    btnCtrl(3);
    $finalScore = 0;

    $("#score").text("0");
    $timeGame = $initialTime;
    $("#chrono").text($timeGame);
}

//filtra os dados dos usuários e ordena 
function ranking() {
    // $users = json;
    console.log($users);
    $selectedLevel = select();
    console.log($selectedLevel);
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
    // const users = $dados
    const highestToLowestSortingStrategy = (a, b) => b - a;
    /**
     * Filtra os dados de uma determinada lista de
     * usuários e ordena suas pontuações através
     * de uma dificuldade
     *
     * @param {ArrayList<User>} users Lista de usuários
     * @param {string} difficulty Dificuldade utilizada para o filtro da pontuação
     * @param {(a: any, b: any) => number} sortingStrategy Estratégia de ordenamento de scores
     * @returns Retorna a lista filtrada de usuários
     */
    const filterScoresByDifficulty = (users, $level, sortingStrategy = highestToLowestSortingStrategy) => users.map(({ scores, ...user }) => scores.filter((score) => score.level === $level).map((score) => ({...user, ...score, }))).reduce((list, next) => [...list, ...next], []).sort((a, b) => sortingStrategy(a.score, b.score));

    const filteredLevelScoresHighestToLowest = filterScoresByDifficulty($users, $selectedLevel);

    $ranking = filteredLevelScoresHighestToLowest
    console.log($ranking)
    return $ranking;
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
//insere os buracos no tabuleiro e chama updatescore
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
        $finalScore = $finalScore += 1;
        $($img).attr({ "src": `img/${$imgsTheme.dead}` })
        return $finalScore;
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
//fornece o nivel em number 
function getLevel() {
    return $levels[$("#level").val()]
}
// pega o nivel selecionado
function select() {
    return $actualLevel = $("#level").val();
}

function logout() {
    sessionStorage.removeItem("id")
    sessionStorage.removeItem("username")
}

function iDlogin() {
    return sessionStorage.getItem("id")
}

function username() {
    return sessionStorage.getItem("username");
}

function saveScore() {
    let data = { "score": $score, "level": $actualLevel }
    axios.post("http://localhost:8080/user/" + $idUser + "/score", data);
}