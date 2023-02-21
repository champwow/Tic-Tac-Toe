const database = firebase.database()
const ref = database.ref()

/*AI Champ TAS TAC TOE*/
let originalBoard;
let stageGame = 'PlayGame';
let areadypick = false;
let pickgaju;
let AIcanusereddummy = true;
let Humenboard = [];
let aQuestion = [];
let listQuestionCondition = [];
let redpick;
let cellid;
var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

var match_Winner = '';
var HUMAN = -1;
var COMP = +1;

startGame();
openModal();
cheackEnemyCanPick(board);
optimize();

function cheackEnemyCanPick(board) {
    for (let i = 0; i < board.length; i++) {
        for (let k = 0; k < 3; k++) {
            if (board[i][k] === -1 && Humenboard.includes([i] + [k]) == false) {
                Humenboard.push([i] + [k]);
            }
        }
    }

}


function startGame() {
    originalBoard = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];
}

function warningModal() {
    if (stageGame == 'PlayGame') {
        $(document).ready(function() {
            $("#exitWarning").modal('show')
        })
    }
}

function hideWarningModal() {
    $(document).ready(function() {
        $("#exitWarning").modal('hide');
    });
}

function openModal() {
    if (stageGame == 'PlayGame') {
        getq()
        Cheackwin(board);
        $(document).ready(function() {
            areadypick = false;
            $("#staticBackdrop").modal('show');
        });
    }
}

function hideModal() {
    $(document).ready(function() {
        $("#staticBackdrop").modal('hide');
    });
}

let Hardchoicea;
let Hardchoiceb;
let HardRightAns;
let Hardque;
let Hardinfo;
getHq();

function openHardModal() {
    if (stageGame == 'PlayGame') {
        Cheackwin(board);
        $(document).ready(function() {
            areadypick = false;
            $("#Hardquestion").modal('show');
        });
    }
}

function hideHardModal() {
    $(document).ready(function() {
        $("#Hardquestion").modal('hide');
    });
}

function result(winner) {
    $(document).ready(function() {
        var quote = document.getElementById('textQuote')
        if(winner != 'Draw'){
            document.getElementById('resultText').innerText = `Winner is ${winner}`
            if(winner == 'Player'){
                quote.innerText = `Excellent!, you are the winner`
            }else if(winner == 'AI'){
                quote.innerText = `Nice try`
            }
        }else{
            document.getElementById('resultText').innerText = `Draw`
        }
        $("#gameResult").modal('show')
    })
    saveResult(winner)
}

function saveResult(winner) {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var btn_id = params.bt
    var theme = params.theme
    var uid = params.uid
    ref.child('table').child(theme).child(uid).update({
        [btn_id]: `${winner}`,
    })
    match_Winner = winner;
}


function butttonXO(btn) {
    let id = btn.id;
    let hid = String(id);
    var hx = hid.split("")[0];
    var hy = hid.split("")[1];
    cellid = hid;
    if (pickgaju != 'yellow' && pickgaju != 'red' && stageGame == 'PlayGame') {
        alert('โปรดเลือกหมากที่ท่านต้องการก่อนวางหมาก');
    } else if ((board[hx][hy] == 0 || board[hx][hy] == 1 && pickgaju == 'yellow' || pickgaju == 'red' && stageGame == 'PlayGame') && areadypick == false) {
        if (board[hx][hy] == 0 && pickgaju == 'yellow') {
            clearInterval(jorobim);
            const rndInt = Math.floor(Math.random() * 5) + 1
            if (rndInt >= 1 && rndInt < 4) {
                clickedCell(btn);
            } else {
                randomCell(btn)
            }
            removeElement(originalBoard, btn.id);
            document.querySelector('img[alt="yellow"]').remove();
            pickgaju = ""
            Cheackwin(board)
        } else if (board[hx][hy] != 0 && pickgaju == 'yellow') {
            alert('สีเหลืองวางตรงนี้ไม่ได้');
        }
        if (board[hx][hy] == 1 && pickgaju == 'red') {
            clearInterval(jorobim);
            randomCell(btn)
            removeElement(originalBoard, btn.id);

            document.querySelector('img[alt="red"]').remove();
            pickgaju = ""
            Cheackwin(board)
        } else if (board[hx][hy] != 1 && pickgaju == 'red') {
            alert('สีแดงวางตรงนี้ไม่ได้')
        }
    }
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

/*ลบตัวออกจาก array โดยดูจาก value*/
function removeElement(array, elem) {

    for (let index = 0; index < array.length; index++) {
        if (originalBoard[index] == elem) {
            array.splice(index, 1);
        }
    }
}
/*bot โง่*/
function randomCell(btn) {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    var cell;
    let id = btn.id;
    let hid = String(id);
    var hx = hid.split("")[0];
    var hy = hid.split("")[1];
    if (theme == 'SPC_M' && pickgaju == 'yellow' && stageGame == 'PlayGame') {
        document.getElementById(id).innerHTML = '<img class="pin" src="./img/earth.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        areadypick = true;
        setTimeout(function() { botngo(id); }, 2000);
        document.getElementById('Hmstat').innerHTML = 'Waiting...';
        document.getElementById('Aistat').innerHTML = 'Enemy Turn...';
        setTimeout(function() { document.getElementById('Hmstat').innerHTML = 'Your Turn...'; }, 2000);
        setTimeout(function() { document.getElementById('Aistat').innerHTML = 'Waiting...'; }, 2000);
        board[hx][hy] = HUMAN;
        setTimeout(function() { Cheackwin(board); }, 1000);
    } else if (theme == 'SPC_M' && pickgaju == 'red' && stageGame == 'PlayGame') {
        openHardModal();
        redpick = id;
    }
    if (theme == 'CT_M' && pickgaju == 'yellow' && stageGame == 'PlayGame') {
        document.getElementById(id).innerHTML = '<img class="pin" src="./img/ifel.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        areadypick = true;
        setTimeout(function() { botngo(id); }, 2000);
        document.getElementById('Hmstat').innerHTML = 'Waiting...';
        document.getElementById('Aistat').innerHTML = 'Enemy Turn...';
        setTimeout(function() { document.getElementById('Hmstat').innerHTML = 'Your Turn...'; }, 2000);
        setTimeout(function() { document.getElementById('Aistat').innerHTML = 'Waiting...'; }, 2000);
        board[hx][hy] = HUMAN;
        setTimeout(function() { Cheackwin(board); }, 1000);
    } else if (theme == 'CT_M' && pickgaju == 'red' && stageGame == 'PlayGame') {
        openHardModal();
        redpick = id;
    }
    if (theme == 'SP_M' && pickgaju == 'yellow' && stageGame == 'PlayGame') {
        document.getElementById(id).innerHTML = '<img class="pin" src="./img/football.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        areadypick = true;
        setTimeout(function() { botngo(id); }, 2000);
        document.getElementById('Hmstat').innerHTML = 'Waiting...';
        document.getElementById('Aistat').innerHTML = 'Enemy Turn...';
        setTimeout(function() { document.getElementById('Hmstat').innerHTML = 'Your Turn...'; }, 2000);
        setTimeout(function() { document.getElementById('Aistat').innerHTML = 'Waiting...'; }, 2000);
        board[hx][hy] = HUMAN;
        setTimeout(function() { Cheackwin(board); }, 1000);
    } else if (theme == 'SP_M' && pickgaju == 'red' && stageGame == 'PlayGame') {
        openHardModal();
        redpick = id;
    }
    if (theme == 'AM_M' && pickgaju == 'yellow' && stageGame == 'PlayGame') {
        document.getElementById(id).innerHTML = '<img class="pin" src="./img/cat.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        areadypick = true;
        setTimeout(function() { botngo(id); }, 2000);
        document.getElementById('Hmstat').innerHTML = 'Waiting...';
        document.getElementById('Aistat').innerHTML = 'Enemy Turn...';
        setTimeout(function() { document.getElementById('Hmstat').innerHTML = 'Your Turn...'; }, 2000);
        setTimeout(function() { document.getElementById('Aistat').innerHTML = 'Waiting...'; }, 2000);
        board[hx][hy] = HUMAN;
        setTimeout(function() { Cheackwin(board); }, 1000);
    } else if (theme == 'AM_M' && pickgaju == 'red' && stageGame == 'PlayGame') {
        openHardModal();
        redpick = id;
    }

}

function botngo(id) {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    removeElement(originalBoard, id);
    let popy = originalBoard.pop();
    let spopy = String(popy);
    var x = spopy.split("")[0];
    var y = spopy.split("")[1];
    board[x][y] = COMP;
    if (theme == 'SPC_M' && stageGame == 'PlayGame') {
        document.getElementById(popy).innerHTML = '<img class="pin" src="./img/Moon.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        countdown();
        setTimeout(function() { openModal(); }, 1500);

    } else if (theme == 'CT_M' && stageGame == 'PlayGame') {
        document.getElementById(popy).innerHTML = '<img class="pin" src="./img/colossium.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        countdown();
        setTimeout(function() { openModal(); }, 1500);

    } else if (theme == 'SP_M' && stageGame == 'PlayGame') {
        document.getElementById(popy).innerHTML = '<img class="pin" src="./img/tennis.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        countdown();
        setTimeout(function() { openModal(); }, 1500);

    } else if (theme == 'AM_M' && stageGame == 'PlayGame') {
        document.getElementById(popy).innerHTML = '<img class="pin" src="./img/dog.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
        countdown();
        setTimeout(function() { openModal(); }, 1500);

    }

}



/* Function to heuristic evaluation of state. */
function evalute(state) {
    var score = 0;

    if (gameOver(state, COMP)) {
        score = +1;
    } else if (gameOver(state, HUMAN)) {
        score = -1;
    } else {
        score = 0;
    }

    return score;
}

/* This function tests if a specific player wins */
function gameOver(state, player) {
    var win_state = [
        [state[0][0], state[0][1], state[0][2]],
        [state[1][0], state[1][1], state[1][2]],
        [state[2][0], state[2][1], state[2][2]],
        [state[0][0], state[1][0], state[2][0]],
        [state[0][1], state[1][1], state[2][1]],
        [state[0][2], state[1][2], state[2][2]],
        [state[0][0], state[1][1], state[2][2]],
        [state[2][0], state[1][1], state[0][2]],
    ];

    for (var i = 0; i < 8; i++) {
        var line = win_state[i];
        var filled = 0;
        for (var j = 0; j < 3; j++) {
            if (line[j] == player)
                filled++;
        }
        if (filled == 3)
            return true;
    }
    return false;
}

/* This function test if the human or computer wins */
function gameOverAll(state) {
    return gameOver(state, HUMAN) || gameOver(state, COMP);
}

function emptyCells(state) {
    var cells = [];
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (state[x][y] == 0)
                cells.push([x, y]);
        }
    }
    return cells;
}

/* A move is valid if the chosen cell is empty */
function validMove(x, y) {
    var empties = emptyCells(board);
    try {
        if (board[x][y] == 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

/* Set the move on board, if the coordinates are valid */
function setMove(x, y, player) {
    if (validMove(x, y) == true && pickgaju != 'red') {
        board[x][y] = player;

        return true;
    } else {
        return false;
    }
}

/* *** AI function that choice the best move *** */
// Read more on https://github.com/Cledersonbc/tic-tac-toe-minimax/
function minimax(state, depth, player) {
    var best;

    if (player == COMP) {
        best = [-1, -1, -1000];
    } else {
        best = [-1, -1, +1000];
    }

    if (depth == 0 || gameOverAll(state)) {
        var score = evalute(state);
        return [-1, -1, score];
    }

    emptyCells(state).forEach(function(cell) {
        var x = cell[0];
        var y = cell[1];
        state[x][y] = player;
        var score = minimax(state, depth - 1, -player);
        state[x][y] = 0;
        score[0] = x;
        score[1] = y;

        if (player == COMP) {
            if (score[2] > best[2])
                best = score;
        } else {
            if (score[2] < best[2])
                best = score;
        }
    });

    return best;
}

/* It calls the minimax function */
function aiTurn() {
    var x, y;
    var move;
    var cell;

    if (emptyCells(board).length == 9) {
        x = parseInt(Math.random() * 3);
        y = parseInt(Math.random() * 3);
    } else {
        move = minimax(board, emptyCells(board).length, COMP);
        x = move[0];
        y = move[1];
    }

    if (setMove(x, y, COMP)) {
        const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
        var theme = params.theme
        num = String(x) + String(y);
        cell = document.getElementById(String(x) + String(y));
        if (theme == 'SPC_M' && stageGame == 'PlayGame') {
            cell.innerHTML = '<img class="pin" src="./img/Moon.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
            Cheackwin(board);
            removeElement(originalBoard, num);
            countdown();
            setTimeout(function() { openModal(); }, 1500);
        } else if (theme == 'CT_M' && stageGame == 'PlayGame') {
            cell.innerHTML = '<img class="pin" src="./img/colossium.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
            Cheackwin(board);
            removeElement(originalBoard, num);
            countdown();
            setTimeout(function() { openModal(); }, 1500);
        } else if (theme == 'SP_M' && stageGame == 'PlayGame') {
            cell.innerHTML = '<img class="pin" src="./img/tennis.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
            Cheackwin(board);
            removeElement(originalBoard, num);
            countdown();
            setTimeout(function() { openModal(); }, 1500);
        } else if (theme == 'AM_M' && stageGame == 'PlayGame') {
            cell.innerHTML = '<img class="pin" src="./img/dog.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
            Cheackwin(board);
            removeElement(originalBoard, num);
            countdown();
            setTimeout(function() { openModal(); }, 1500);
        }
    }
}



/* main */
function clickedCell(cell) {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    var conditionToContinue = gameOverAll(board) == false && emptyCells(board).length > 0;
    if (conditionToContinue == true) {
        var x = cell.id.split("")[0];
        var y = cell.id.split("")[1];
        var move = setMove(x, y, HUMAN);
        if (move == true) {
            if (theme == 'SPC_M' && pickgaju == 'yellow') {
                cell.innerHTML = '<img class="pin" src="./img/earth.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;

            } else if (theme == 'SPC_M' && pickgaju == 'red') {
                board[x][y] = COMP
                cell.innerHTML = '<img class="pin" src="./img/earth-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;
            }
            if (theme == 'CT_M' && pickgaju == 'yellow') {
                cell.innerHTML = '<img class="pin" src="./img/ifel.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;

            } else if (theme == 'CT_M' && pickgaju == 'red') {
                board[x][y] = COMP
                cell.innerHTML = '<img class="pin" src="./img/ifel-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;
            }
            if (theme == 'SP_M' && pickgaju == 'yellow') {
                cell.innerHTML = '<img class="pin" src="./img/football.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;

            } else if (theme == 'SP_M' && pickgaju == 'red') {
                board[x][y] = COMP
                cell.innerHTML = '<img class="pin" src="./img/football-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;
            }
            if (theme == 'AM_M' && pickgaju == 'yellow') {
                cell.innerHTML = '<img class="pin" src="./img/cat.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;

            } else if (theme == 'AM_M' && pickgaju == 'red') {
                board[x][y] = COMP
                cell.innerHTML = '<img class="pin" src="./img/cat-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw;"/>';
                areadypick = true;
            }
            setTimeout(function() { Cheackwin(board); }, 2000);
            if (conditionToContinue) {
                const rndInt = Math.floor(Math.random() * 2) + 1
                cheackEnemyCanPick(board)
                if (AIcanusereddummy == true && rndInt == 1) {
                    const random = Math.floor(Math.random() * Humenboard.length);
                    AIcanusereddummy = false;
                    var redx = Humenboard[random].split("")[0];
                    var redy = Humenboard[random].split("")[1];



                    if (theme == 'SPC_M') {
                        setTimeout(function() { document.getElementById(Humenboard[random]).innerHTML = '<img class="pin" src="./img/moon-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'; }, 2000);
                    } else if (theme == 'CT_M') {
                        setTimeout(function() { document.getElementById(Humenboard[random]).innerHTML = '<img class="pin" src="./img/colossium-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'; }, 2000);
                    } else if (theme == 'SP_M') {
                        setTimeout(function() { document.getElementById(Humenboard[random]).innerHTML = '<img class="pin" src="./img/tennis-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'; }, 2000);
                    } else if (theme == 'AM_M') {
                        setTimeout(function() { document.getElementById(Humenboard[random]).innerHTML = '<img class="pin" src="./img/dog-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'; }, 2000);
                    }


                    board[redx][redy] = COMP;
                    Cheackwin(board);
                    countdown();
                    setTimeout(function() { openModal(); }, 3000);
                } else {
                    // Cheackwin(board);
                    setTimeout(function() { aiTurn(); }, 2000);
                    document.getElementById('Hmstat').innerHTML = 'Waiting...';
                    document.getElementById('Aistat').innerHTML = 'Enemy Turn...';
                    setTimeout(function() { document.getElementById('Hmstat').innerHTML = 'Your Turn...'; }, 2000);
                    setTimeout(function() { document.getElementById('Aistat').innerHTML = 'Waiting...'; }, 2000);
                }
            }
        }

    }
}

/* ตรวจสอบว่าชนะยัง */
winner = '';

function Cheackwin(board) {


    if (sum(board[0]) == -3) {
        result('Player')
        stageGame = 'Endgame';

    }
    if (sum(board[1]) == -3) {
        stageGame = 'Endgame';

        result('Player')
    }
    if (sum(board[2]) == -3) {
        result('Player')
        stageGame = 'Endgame';

    }
    if (sum([board[0][0], board[1][0], board[2][0]]) == -3) {
        result('Player')
        stageGame = 'Endgame';

    }
    if (sum([board[0][1], board[1][1], board[2][1]]) == -3) {
        result('Player')
        stageGame = 'Endgame';

    }
    if (sum([board[0][2], board[1][2], board[2][2]]) == -3) {
        result('Player')
        stageGame = 'Endgame';

    }

    if (sum([board[0][0], board[1][1], board[2][2]]) == -3) {
        result('Player')
        stageGame = 'Endgame';

    }
    if (sum([board[0][2], board[1][1], board[2][0]]) == -3) {
        result('Player')
        stageGame = 'Endgame';

    }
    // ----------------------------------------------------------
    if (sum(board[0]) == 3) {
        result('AI')
        stageGame = 'Endgame';

    }
    if (sum(board[1]) == 3) {
        result('AI')
        stageGame = 'Endgame';

    }
    if (sum(board[2]) == 3) {
        result('AI')
        stageGame = 'Endgame';

    }
    if (sum([board[0][0], board[1][0], board[2][0]]) == 3) {
        result('AI')
        stageGame = 'Endgame';

    }
    if (sum([board[0][1], board[1][1], board[2][1]]) == 3) {
        result('AI')
        stageGame = 'Endgame';

    }
    if (sum([board[0][2], board[1][2], board[2][2]]) == 3) {
        result('AI')
        stageGame = 'Endgame';

    }
    if (sum([board[0][0], board[1][1], board[2][2]]) == 3) {
        result('AI')
        stageGame = 'Endgame';

    }
    if (sum([board[0][2], board[1][1], board[2][0]]) == 3) {
        result('AI')
        stageGame = 'Endgame';


    }
    if (board[0][0] != 0 && board[0][1] != 0 && board[0][2] != 0 && board[1][0] != 0 && board[1][1] != 0 && board[1][2] != 0 &&
        board[2][0] != 0 && board[2][1] != 0 && board[2][2] != 0) {
        stageGame = 'Endgame';
        result('Draw')
    }
}

function sum(input) {

    if (toString.call(input) !== "[object Array]")
        return false;

    var total = 0;
    for (var i = 0; i < input.length; i++) {
        if (isNaN(input[i])) {
            continue;
        }
        total += Number(input[i]);
    }
    return total;
}

function startTimer(duration, display) {
    // clearInterval(jorobim);
    var timer = duration,
        minutes, seconds;
    jorobim = setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            Cheackwin(board);
            if (stageGame == 'PlayGame') {
                Cheackwin(board);
                timer = 0;
                clearInterval(jorobim);
                changetextQ();
                aiTurn();
            } else {
                hideModal();
                clearInterval(jorobim);
                timer = 0;
            }
        }
    }, 1000);
}
let choicea;
let choiceb;
let RightAns;
let que;
let info;
getq();

function changetextQ() {
    getq()
    let Question = document.getElementById('test');
    let ChoiceA = document.getElementById('answerA');
    let ChoiceB = document.getElementById('answerB');
    Question.innerHTML = que;
    ChoiceA.innerHTML = choicea;
    ChoiceB.innerHTML = choiceb;
}

countdown();

function countdown() {
    var Minutes = 25,
        display = document.querySelector('#time');
    startTimer(Minutes, display);
}



function getq() {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    let num = randomnumber('normal');
    if (theme == 'SPC_M') {
        fetch("space_qa.json")
            .then(response => response.json())
            .then(data => {
                que = document.getElementById('test').innerHTML = data[num].question;
                choicea = document.getElementById('answerA').innerHTML = data[num].A;
                choiceb = document.getElementById('answerB').innerHTML = data[num].B;
                RightAns = data[num].right;
                info = data[num].info;
            })
    } else if (theme == 'CT_M') {
        fetch("city_qa.json")
            .then(response => response.json())
            .then(data => {
                que = document.getElementById('test').innerHTML = data[num].question;
                choicea = document.getElementById('answerA').innerHTML = data[num].A;
                choiceb = document.getElementById('answerB').innerHTML = data[num].B;
                RightAns = data[num].right;
                info = data[num].info;
            })
    } else if (theme == 'SP_M') {
        fetch("sports_qa.json")
            .then(response => response.json())
            .then(data => {
                que = document.getElementById('test').innerHTML = data[num].question;
                choicea = document.getElementById('answerA').innerHTML = data[num].A;
                choiceb = document.getElementById('answerB').innerHTML = data[num].B;
                RightAns = data[num].right;
                info = data[num].info;
            })
    } else if (theme == 'AM_M') {
        fetch("animals_qa.json")
            .then(response => response.json())
            .then(data => {
                que = document.getElementById('test').innerHTML = data[num].question;
                choicea = document.getElementById('answerA').innerHTML = data[num].A;
                choiceb = document.getElementById('answerB').innerHTML = data[num].B;
                RightAns = data[num].right;
                info = data[num].info;
            })
    }

}


function getHq() {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    let num = randomnumber('hard');

    if (theme == 'SPC_M') {
        fetch("space-hardqa.json")
            .then(response => response.json())
            .then(data => {
                Hardque = document.getElementById('questionHard').innerHTML = data[num].question;
                Hardchoicea = document.getElementById('answerHardA').innerHTML = data[num].A;
                Hardchoiceb = document.getElementById('answerHardB').innerHTML = data[num].B;
                HardRightAns = data[num].right;
                Hardinfo = data[num].info;
            })
    } else if (theme == 'CT_M') {
        fetch("city_hardqa.json")
            .then(response => response.json())
            .then(data => {
                Hardque = document.getElementById('questionHard').innerHTML = data[num].question;
                Hardchoicea = document.getElementById('answerHardA').innerHTML = data[num].A;
                Hardchoiceb = document.getElementById('answerHardB').innerHTML = data[num].B;
                HardRightAns = data[num].right;
                Hardinfo = data[num].info;
            })
    } else if (theme == 'SP_M') {
        fetch("sports-hardqa.json")
            .then(response => response.json())
            .then(data => {
                Hardque = document.getElementById('questionHard').innerHTML = data[num].question;
                Hardchoicea = document.getElementById('answerHardA').innerHTML = data[num].A;
                Hardchoiceb = document.getElementById('answerHardB').innerHTML = data[num].B;
                HardRightAns = data[num].right;
                Hardinfo = data[num].info;
            })
    } else if (theme == 'AM_M') {
        fetch("animals_hardqa.json")
            .then(response => response.json())
            .then(data => {
                Hardque = document.getElementById('questionHard').innerHTML = data[num].question;
                Hardchoicea = document.getElementById('answerHardA').innerHTML = data[num].A;
                Hardchoiceb = document.getElementById('answerHardB').innerHTML = data[num].B;
                HardRightAns = data[num].right;
                Hardinfo = data[num].info;
            })
    }
}

function randomnumber(type) {
    var checkQ = false;
    var numQ;
    if(type == 'normal'){numQ = 20}
    else if(type == 'hard'){numQ = 10}
    let num = Math.floor(Math.random() * 100) % numQ;
    // สุ่ม Question โดยที่ Question จะไม่ซ้ำคำถามเดิม ใน Board นั้นๆ
    while (checkQ == false) {
        let num = Math.floor(Math.random() * 100) % numQ;
        if (aQuestion.includes(num) == false) {
            checkQ = true
            aQuestion.push(num)
        }
    }

    return num;
}

function clickChoice(btn) {
    let id = btn.id;
    if (id == 'answerA') {
        if (choicea == RightAns) {
            listQuestionCondition.push('QNormal')
            hideModal();
        } else {
            listQuestionCondition.push('Wrong')
            clearInterval(jorobim);
            alert(`ผิด : ${info}`)
            aiTurn();
            hideModal();
            setTimeout(function() { openModal(); }, 1500);

        }
    } else if (id == 'answerB') {
        if (choiceb == RightAns) {
            listQuestionCondition.push('QNormal')
            hideModal();

        } else {
            listQuestionCondition.push('Wrong')
            clearInterval(jorobim);
            alert(`ผิด : ${info}`)
            aiTurn();
            hideModal();
            setTimeout(function() { openModal(); }, 1500);
            // alert(info);
        }
    }

}

function clickHardChoice(btn) {
    let id = btn.id;
    var x = cellid.split("")[0];
    var y = cellid.split("")[1];

    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    var user_id = params.uid
    if (id == 'answerHardA') {
        if (Hardchoicea == HardRightAns) {
            // ถูก
            board[x][y] = HUMAN;
            if (theme == 'SPC_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/earth-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            } else if (theme == 'CT_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/ifel-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            } else if (theme == 'SP_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/football-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            } else if (theme == 'AM_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/cat-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            }
            areadypick = true;
            listQuestionCondition.push('QHard')
            setTimeout(function() { Cheackwin(board); }, 2000);
            setTimeout(function() { botngo(id); }, 2000);
            document.getElementById('Hmstat').innerHTML = 'Waiting...';
            document.getElementById('Aistat').innerHTML = 'Enemy Turn...';
            setTimeout(function() { document.getElementById('Hmstat').innerHTML = 'Your Turn...'; }, 2000);
            setTimeout(function() { document.getElementById('Aistat').innerHTML = 'Waiting...'; }, 2000);
            hideHardModal();
            // score_Update('QHard');
        } else {
            // ผิด
            listQuestionCondition.push('Wrong')
            clearInterval(jorobim);
            alert(`ผิด : ${info}`)
            aiTurn();
            hideHardModal();
            getq();
            // score_Update('Wrong');
            setTimeout(function() { openModal(); }, 1500);
            setMove(x, y, COMP)

        }
    } else if (id == 'answerHardB') {
        if (Hardchoiceb == HardRightAns) {
            board[x][y] = HUMAN;
            // ถูก
            if (theme == 'SPC_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/earth-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            } else if (theme == 'CT_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/ifel-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            } else if (theme == 'SP_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/football-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            } else if (theme == 'AM_M') {
                document.getElementById(redpick).innerHTML = '<img class="pin" src="./img/cat-red.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>';
            }
            areadypick = true;
            listQuestionCondition.push('QHard')
            setTimeout(function() { Cheackwin(board); }, 2000);
            setTimeout(function() { botngo(id); }, 2000);
            document.getElementById('Hmstat').innerHTML = 'Waiting...';
            document.getElementById('Aistat').innerHTML = 'Enemy Turn...';
            setTimeout(function() { document.getElementById('Hmstat').innerHTML = 'Your Turn...'; }, 2000);
            setTimeout(function() { document.getElementById('Aistat').innerHTML = 'Waiting...'; }, 2000);
            hideHardModal();
            // score_Update('QHard');
        } else {
            // ผิด
            listQuestionCondition.push('Wrong')
            setMove(x, y, COMP)
            clearInterval(jorobim);
            alert(`ผิด : ${info}`)
            aiTurn();
            hideHardModal();
            getq();
            // score_Update('Wrong');
            setTimeout(function() { openModal(); }, 1500);
        }
    }

}


function pickUp(btn) {
    pickgaju = btn.alt;
    var doodle = document.querySelectorAll('#doodle');
    for (let i = 0; i < doodle.length; i++) {
        if (doodle[i] == btn) {
            doodle[i].classList.add('active')
        } else {
            doodle[i].classList.remove('active')
        }
    }
}

window.onload = function() {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    let id = params.id;
    document.getElementById('nameBoard').innerHTML = 'BOARD ' + id;
};

function getRandomItem(arr) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
}

function callBackData() {
    Questionquery()
    match_Update()
}

function optimize() {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    var p_uid = params.uid
    var username = 
    ref.once('value', function getName(snapshot){
        username = snapshot.child('users').child(p_uid).child('username').val()
        let HUimage = document.getElementById('HuImage');
        let AIimage = document.getElementById('AiImage');
        var doodle = document.querySelectorAll('#doodle');
        let namehumen = document.getElementById('NameHUMEN');
        let nameai = document.getElementById('NameAI');
        if (theme == 'SPC_M') {
            namehumen.innerHTML = `${username}`
            nameai.innerHTML = 'MOON'
            HUimage.src = './img/earth.png';
            AIimage.src = './img/Moon.png';
            for (let i = 0; i < doodle.length; i++) {
                if (doodle[i].alt == 'yellow') {
                    doodle[i].src = './img/earth.png';
                } else {
                    doodle[i].src = './img/earth-red.png';
                }
            }
        } else if (theme == 'CT_M') {
            namehumen.innerHTML = `${username}`
            nameai.innerHTML = 'COLOSSIUM'
            HUimage.src = './img/ifel.png';
            AIimage.src = './img/colossium.png';
            for (let i = 0; i < doodle.length; i++) {
                if (doodle[i].alt == 'yellow') {
                    doodle[i].src = './img/ifel.png';
                } else {
                    doodle[i].src = './img/ifel-red.png';
                }
            }
        } else if (theme == 'SP_M') {
            namehumen.innerHTML = `${username}`
            nameai.innerHTML = 'TENNIS'
            HUimage.src = './img/football.png';
            AIimage.src = './img/tennis.png';
            for (let i = 0; i < doodle.length; i++) {
                if (doodle[i].alt == 'yellow') {
                    doodle[i].src = './img/football.png';
                } else {
                    doodle[i].src = './img/football-red.png';
                }
            }
        } else if (theme == 'AM_M') {
            namehumen.innerHTML = `${username}`
            nameai.innerHTML = 'DOG'
            HUimage.src = './img/cat.png';
            AIimage.src = './img/dog.png';
            for (let i = 0; i < doodle.length; i++) {
                if (doodle[i].alt == 'yellow') {
                    doodle[i].src = './img/cat.png';
                } else {
                    doodle[i].src = './img/cat-red.png';
                }
            }
        }
    })
}

function Questionquery(){
    var Qscore = 0
    var QTotal = 0
    var Pscore = 0
    for(let i = 0; i < listQuestionCondition.length; i++){
        if(listQuestionCondition[i] == 'QHard'){
            Pscore = Pscore + 3
            Qscore = Qscore + 1
            QTotal = QTotal + 1
        }else if(listQuestionCondition[i] == 'QNormal'){
            Pscore = Pscore + 1
            Qscore = Qscore + 1
            QTotal = QTotal + 1
        }else if(listQuestionCondition[i] == 'Wrong'){
            QTotal = QTotal + 1
        }
    }
    score_Update(Qscore, QTotal, Pscore)
}

function score_Update(Q_score, Q_Total, P_score){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var uid = params.uid
    var checkCondition = true
    ref.once('value', function(snapshot){
        var PscoreBF = parseInt(snapshot.child('users').child(uid).child('score').val()) + P_score
        var QscoreBF = parseInt(snapshot.child('users').child(uid).child('correct').val()) + Q_score
        var QTotal = parseInt(snapshot.child('users').child(uid).child('number_q').val()) + Q_Total
        if(checkCondition == true){
            ref.child('users').child(uid).update({
                ['score'] : `${PscoreBF}`,
                ['number_q'] : `${QTotal}`,
                ['correct'] : `${QscoreBF}`
            })
            checkCondition = false
        }
    })
}

function match_Update(){
    ref.once('value', function(snapshot){
        const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
        var uid = params.uid
        var player_score = parseInt(snapshot.child('users').child(uid).child('score').val())
        var player_total_match = parseInt(snapshot.child('users').child(uid).child('total_m').val())
        var player_win = parseInt(snapshot.child('users').child(uid).child('win_m').val())
        if(player_total_match == 0){
            alert(`ยินดีด้วย!, คุณได้รับโบนัสการเล่นครั้งเเรก 10 คะเเนน!`)
            if(match_Winner == 'Player'){
                ref.child('users').child(uid).update({
                    ['win_m'] : `${player_win + 1}`,
                })
            }
            ref.child('users').child(uid).update({
                ['total_m'] : `${player_total_match + 1}`,
                ['score'] : `${player_score + 10}`
            })
        }else if(match_Winner == 'Player'){
            ref.child('users').child(uid).update({
                ['win_m'] : `${player_win + 1}`,
                ['total_m'] : `${player_total_match + 1}`,
                ['score'] : `${player_score + 10}`
            })
        }else if(match_Winner == 'AI'){
            ref.child('users').child(uid).update({
                ['total_m'] : `${player_total_match + 1}`,
                ['score'] : `${player_score + 3}`
            })
        }else if(match_Winner == 'Draw'){
            ref.child('users').child(uid).update({
                ['total_m'] : `${player_total_match + 1}`,
                ['score'] : `${player_score + 5}`
            })
        }
    })
    setTimeout(function() { exit(); }, 500);
}

function exit(){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    var uid = params.uid
    window.location.href = `Mainboard.html?id=${uid}&theme=${theme}`
}