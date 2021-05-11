const $levels = { "easy": 3, "medium": 5, "hard": 7 }
const $imgWidth = 100
const $imgHeight = 80
const $imgsTheme = { "default": "buracoM.gif", "active": "toupeiraMarrom.gif", "dead": "morreu.gif" }
const $initialTime = 5;

// var $users = new Array();
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

$(document).ready(function() {

    $.getJSON("http://localhost:8080/user", json);

    function json(json) {
        $users = json
    }
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
        if ($idUser && $actualUser) {
            btnCtrl(1);
            start();
        } else
            window.open("login.html", "_self")
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
    $(".a").mousedown(function(e) {
        e.preventDefault();
        $(this).blur();
        return false;
    });
    $(".b").mousedown(function(e) {
        e.preventDefault();
        $(this).blur();
        return false;
    });
    $(".c").mousedown(function(e) {
        e.preventDefault();
        $(this).blur();
        return false;
    });
    $(".d").mousedown(function(e) {
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
    alertWifi(`As toupeiras estão devastando a plantação de abóboras. Para garantir o halloween, seu objetivo é eliminar o maior número delas, você está preparado?`, false, 0, "img/serrapainel.png", "30", false, true)
}

function play() {

    fillboard();
    $(".motoLigada").trigger('play');
    setTimeout(function() { $("h1").removeClass("treme") }, 500);
    $(".tema").trigger('pause');
    $('#chrono').removeClass('btnPause');
    $idChronoStartGame = setInterval(startGame, 1180);
    // a cada um segundo aciona startChronoGame e decrementa segundo.
    $idChronoGame = setInterval(startChronoGame, 1000);

}

function resume() {
    play();
    // $('#chrono').toogleClass('btnResume');
}

function pause() {
    $(".motoLigada").trigger('pause');
    $(".tema").trigger('play');
    $('#chrono').addClass('btnPause');
    // $('#chrono').removeClass('btnResume');
    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame)
    $(`#mole_${$molePosition}`).attr("src", `img/${$imgsTheme.default}`);
    // $(".motoLigada").trigger('pause');
}

function stop() {
    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame)
    $(`#mole_${$molePosition}`).attr("src", `img/${$imgsTheme.default}`);
    fillboard();
    btnCtrl(3);
    $("#score").text("0");
    $timeGame = $initialTime;
    $("main").removeClass("ponteiro")
    $("#chrono").text($timeGame);
    $(".motoLigada").trigger('pause');
    $("#board").css({ "width": $boardWidth, "height": $boardHeight, opacity: 0 })
}

function exit() {
    pause();
    alertWifi(`Deseja realmente sair do jogo?`, false, 0, "img/fim.jpg", "50", true)
        // window.open("login.html", "_self")
}

function startChronoGame() {
    let $secondsFormat = (--$timeGame).toLocaleString("pt-br", { minimumIntegerDigits: 2 });
    // if ($timeGame >= 5) $("#chrono").toogleClass("piscaChrono");
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
    alertWifi(`Fim de Jogo. Voce ganhou ${$("#score").text()} abóboras!`, false, 0, "img/halow.jpg", "30", false, false, `Level: ${$actualLevel}`, $ranking)
        //reseta o jogo
    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame);
    $(".tema").trigger('play');
    fillboard();
    btnCtrl(3);
    $finalScore = 0;

    $("#score").text("0");
    $timeGame = $initialTime;
    $("#chrono").text($timeGame);
    $("#board").css({ "width": $boardWidth, "height": $boardHeight, opacity: 0 })
}

//filtra os dados dos usuários e ordena 
function ranking() {
    // $users = json;
    console.log($users);
    $selectedLevel = select();
    console.log($selectedLevel);
    $testePegaAtual = $users.find($usuario => $usuario.username == $actualUser)
    $testePegaAtual.scores.push({ "score": $score, "level": $actualLevel })
    console.log($testePegaAtual)
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
    $("#board").css({ "width": $boardWidth, "height": $boardHeight, opacity: 1 })
    placeHolesBoard($level)
}
//insere os buracos no tabuleiro e chama updatescore
function placeHolesBoard($level) {
    $("#board").empty()
    for ($i = 0; $i < Math.pow($level, 2); $i++) {
        $div = $("<div></div>"); //.attr("id", `mole_${$i+1}`);
        $img = $("<img>").attr({ "src": `img/${$imgsTheme.default}`, "id": `mole_${$i+1}` });
        $($img).click(function() { //treme aqui
            updateScore(this)
        });
        $($div).append($img);
        $("#board").append($div);
    }
}
//acrescenta 1 ponto no placar e mostra a toupeira vermelha quando acerta.
function updateScore($img) {
    if ($($img).attr("src").search("toupeira") != -1) {
        // stopAudio();
        $(".motoAcionada").trigger('pause');
        $(".motoAcionada").trigger('play');
        $(".motoAcionada").prop("currentTime", 0);
        $("#score").text(parseInt($("#score").text()) + 1);
        $finalScore = $finalScore += 1;
        $($img).attr({ "src": `img/${$imgsTheme.dead}` })
        $("h1").addClass("treme")
        setTimeout(function() { $("h1").removeClass("treme") }, 500);
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

function stopAudio() {
    $(".mudo").html('<i class="mute" onclick="mute()"> <span class="material-icons"> volume_off</span></i>')
        //pause playing
    $(".tema").trigger('pause');
    //set play time to 0
    // $(".tema").prop("currentTime", 0);
}

function mute() {
    $(".mudo").html('<i class="mute" onclick="stopAudio()"> <span class="material-icons"> volume_up</span></i>')
        //pause playing
    $(".tema").trigger('play');
}