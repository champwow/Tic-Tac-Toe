const auth = firebase.auth()
const database = firebase.database()
const ref = database.ref()

var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

var mainmatch_Winner = '';

function choseBoard(btn) {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    uId = params.id
    theme = params.theme
    btnID = btn.getAttribute('value')
    changetext(btn);
    window.location.href = `ingame.html?id=${btnID}&bt=${btn.id}&theme=${theme}&uid=${uId}`

}

function changetext() {
    console.log(document.getElementById('MainBoard'));
}

var id = '';
var theme = '';

if(document.title == 'Theme'){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    id = params.id;
} else if (document.title == 'Main Board'){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    id = params.id;
    theme = params.theme
}

function chooseTheme(themeParam){
    window.location.href = `Mainboard.html?id=${id}&theme=${themeParam}`
}

function callBackDatatoTheme(){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    uid = params.id;
    window.location.href = `theme.html?id=${uid}`
}

ref.on('value', snapshot => {
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    var allButton = document.querySelectorAll('.cell')
    var data = snapshot.child('users').child(id).val()
    for(let i = 0; i < allButton.length; i++){
        var symbol = snapshot.child('table').child(theme).child(id).child(allButton[i].id).val();
        if(symbol && symbol != 'Draw'){
            allButton[i].innerHTML = '';
            var x = allButton[i].id.split('')[4] - 1
            var y = allButton[i].id.split('')[10] - 1
            allButton[i].setAttribute('onclick', '')
            allButton[i].style.cursor = 'context-menu'
            if(theme == 'SPC_M'){
                if(symbol == 'Player'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/earth.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = -1
                }else if(symbol == 'AI'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/Moon.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = 1
                }
            }if(theme == 'CT_M'){
                if(symbol == 'Player'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/ifel.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = -1
                }else if(symbol == 'AI'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/colossium.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = 1
                }
            }if(theme == 'SP_M'){
                if(symbol == 'Player'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/football.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = -1
                }else if(symbol == 'AI'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/tennis.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = 1
                }
            }if(theme == 'AM_M'){
                if(symbol == 'Player'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/cat.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = -1
                }else if(symbol == 'AI'){
                    allButton[i].innerHTML = '<img class="pin" src="./img/dog.png" alt="" style="margin-left: 0; margin-right: 0; width: 7vw; "/>'
                    board[x][y] = 1
                }
            }
        }
    }
    Cheackwin(board)
})

function resetGameModal(){
    $(document).ready(function() {
        $("#resetGameModal").modal('show');
    });
}

function hideWarningModal(){
    $(document).ready(function() {
        $("#resetGameModal").modal('hide');
    });
}

function resetGame(condition){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var theme = params.theme
    var uid = params.id
    ref.child('table').child(theme).child(uid).remove()
    hideWarningModal()
    if(condition != 'Endgame'){
        window.location.href = `Mainboard.html?id=${uid}&theme=${theme}`
    }else{
        setTimeout(function() { window.location.href = `playerProfile.html` }, 1000);
    }
}

function Cheackwin(board) {


    if (sum(board[0]) == -3) {
        result('Player')

    }
    if (sum(board[1]) == -3) {

        result('Player')
    }
    if (sum(board[2]) == -3) {
        result('Player')

    }
    if (sum([board[0][0], board[1][0], board[2][0]]) == -3) {
        result('Player')

    }
    if (sum([board[0][1], board[1][1], board[2][1]]) == -3) {
        result('Player')

    }
    if (sum([board[0][2], board[1][2], board[2][2]]) == -3) {
        result('Player')

    }

    if (sum([board[0][0], board[1][1], board[2][2]]) == -3) {
        result('Player')

    }
    if (sum([board[0][2], board[1][1], board[2][0]]) == -3) {
        result('Player')

    }
    // ----------------------------------------------------------
    if (sum(board[0]) == 3) {
        result('AI')

    }
    if (sum(board[1]) == 3) {
        result('AI')

    }
    if (sum(board[2]) == 3) {
        result('AI')

    }
    if (sum([board[0][0], board[1][0], board[2][0]]) == 3) {
        result('AI')

    }
    if (sum([board[0][1], board[1][1], board[2][1]]) == 3) {
        result('AI')

    }
    if (sum([board[0][2], board[1][2], board[2][2]]) == 3) {
        result('AI')

    }
    if (sum([board[0][0], board[1][1], board[2][2]]) == 3) {
        result('AI')

    }
    if (sum([board[0][2], board[1][1], board[2][0]]) == 3) {
        result('AI')


    }
    if (board[0][0] != 0 && board[0][1] != 0 && board[0][2] != 0 && board[1][0] != 0 && board[1][1] != 0 && board[1][2] != 0 &&
        board[2][0] != 0 && board[2][1] != 0 && board[2][2] != 0) {
        result('Draw')
    }

}

function result(winner) {
    mainmatch_Winner = winner;
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
}


function callBackData(){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var uid = params.id
    save_Result()
    resetGame('Endgame')
}

function save_Result(){
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
    var uid = params.id
    ref.once('value', function(snapshot){
        var player_Mscore = parseInt(snapshot.child('users').child(uid).child('score').val())
        var player_Mwin = parseInt(snapshot.child('users').child(uid).child('win_m').val())
        var player_totalMatch = parseInt(snapshot.child('users').child(uid).child('total_m').val())
        if(mainmatch_Winner == 'Player'){
            player_Mscore = player_Mscore + 100
            player_Mwin = player_Mwin + 1
            player_totalMatch = player_totalMatch + 1
        }else if(mainmatch_Winner == 'AI'){
            player_Mscore = player_Mscore + 20
            player_totalMatch = player_totalMatch + 1
        }else if(mainmatch_Winner == 'Draw'){
            player_Mscore = player_Mscore + 30
            player_totalMatch = player_totalMatch + 1
        }
        ref.child('users').child(uid).update({
            ['score'] : `${player_Mscore}`,
            ['win_m'] : `${player_Mwin}`,
            ['total_m'] : `${player_totalMatch}`
        })
    })
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