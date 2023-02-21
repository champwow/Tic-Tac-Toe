const auth = firebase.auth()
const database = firebase.database()
const ref = database.ref()

function register() {
    //get all input fields
    var username = document.getElementById('input-user-signup').value
    var email = document.getElementById('input-email-signup').value
    var password = document.getElementById('input-password-signup').value
    if (validate_email(email) == false || validate_password(password) == false){
        alert('Email or password is not currect!')
        return
    }
    else if (validate_username(username) == false){
        alert('Username must have 5-11 character!')
        return
    }

    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
        var user = auth.currentUser
        var ref = database.ref()
        var user_data = {
            email : email,
            username : username,
            last_login : Date.now(),
            score : '0',
            total_m : '0',
            win_m : '0',
            number_q : '0',
            correct : '0'
        }

        ref.child('users/' + user.uid).set(user_data)
        
        setTimeout(function(){
            window.location.href='index.html'
            alert('[Compelete] User Create')
        }, 1000);
    })
    .catch(function(error){
        var error_code = error.code
        var error_message = error.message

        alert(error_message)
    })
}

function login(){
    var email = document.getElementById('input-email-login').value
    var password = document.getElementById('input-password-login').value
    if(validate_email(email) == false || validate_password(password) == false){
        alert('Email or Password is not currect!!');
        return
    }

    auth.signInWithEmailAndPassword(email, password)
    .then(function(){
        var user = auth.currentUser
        var ref = database.ref()
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var date = new Date()
        var month = months[date.getMonth()];
        var day = date.getDate();
        var year = date.getFullYear();
        var user_data = {
            last_login : `${day} ${month} ${year}`
        }

        ref.child('users/' + user.uid).update(user_data)
        setTimeout(function(){
            window.location.href='playerProfile.html'
            alert('User Logged In!')
        }, 1000);
    })
    .catch(function(error){
        var error_code = error.code
        var error_message = error.message

        alert(error_message)
    })
    
}



function validate_email(email){
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true){
        return true
    } else {
        return false
    }
}

function validate_password(password){
    if( password < 6){
        return false
    } else {
        return true
    }
}

function validate_username(username){
    if(username.length > 11 || username.length < 5){
        return false
    } else {
        return true
    }
}

//Logout
function logout(){
    firebase.auth().signOut();
    setTimeout(function(){
        window.location.href='index.html'
        alert('Logout Compelete')
    }, 1000);
}



firebase.auth().onAuthStateChanged((user) => {
    playerInfo(user.uid)
});

/*ref.on('value', snapshot =>{
    const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
    let list = {}
    let player_score = snapshot.child('score_board');
    for(let i = 0; i < player_score.length; i++){
        
    }
    console.log(player_score)
    let arr = sortObject(list);
    
})*/

var result;

ref.on('value', snapshot => {
    let listOfPlayerUID = [],
        ListOfPlayerScoreVal = [];
    snapshot.child('users').forEach(function(childSnapshot) {
        listOfPlayerUID.push(childSnapshot.key);
        ListOfPlayerScoreVal.push(childSnapshot.val());
    })
    var playerScore = new Array;
    for(let i = 0; i < ListOfPlayerScoreVal.length; i++){
        let uid = listOfPlayerUID[i];
        let score = ListOfPlayerScoreVal[i].score;
        let name = ListOfPlayerScoreVal[i].username;
        var arr = {
            uid : uid, score : score, username : name
        }
        playerScore = playerScore.concat(arr);
    }
    
    var user = auth.currentUser.uid;
    sortScore(playerScore)
    if(document.title == 'Player Profile'){
        playerRanking(playerScore, user)
    }if(document.title == 'Ranking Board'){
        playerScoreBoard(playerScore, user)
    }
})

var scoreArray = []

function sortScore(scoreArr){
    scoreArr.sort((item2, item1) => {
        return item1.score - item2.score
    })
    // console.log(scoreArr)
    // var len = scoreArr.length;
    // for (var i = 0; i<len; i++){
    //   for(var j = len-1; j>0; j--){
    //     if(scoreArr[j-1].score<scoreArr[j].score){

    //         var temp = scoreArr[j];
    //         scoreArr[j] = scoreArr[j-1];
    //         scoreArr[j-1] = temp;
    //     }
    //   }
    // }
    // scoreArray = scoreArr
    // return scoreArr;

    // let min;
    // //start passes.
    // for (let i = 0; i < len; i++) {
    //   //index of the smallest element to be the ith element.
    //   min = i;
  
    //   //Check through the rest of the array for a lesser element
    //   for (let j = i + 1; j < len; j++) {
    //     if (scoreArr[j].score > scoreArr[min].score) {
    //       min = j;
    //     }
    //   }
  
    //   //compare the indexes
    //   if (min !== i) {
    //     //swap
    //     [scoreArr[i], scoreArr[min]] = [scoreArr[min], scoreArr[i]];
    //   }
    // }
    // console.log(scoreArr)
    // return scoreArr;
}

function playerInfo(user){
    var player_name = document.getElementById('player-name');
    var player_email = document.getElementById('player_email');
    var total_match = document.getElementById('total_m');
    var win_rate = document.getElementById('win_rate');
    var num_question = document.getElementById('num_q');
    var num_win = document.getElementById('win_m');
    var total_score = document.getElementById('total_score');
    var correct_rate = document.getElementById('crr_rate')
    ref.on('value', snapshot =>{
        if(document.title == 'Player Profile'){
            player_name.innerText = snapshot.child('users').child(user).child('username').val();
            var email = snapshot.child('users').child(user).child('email').val();
            player_email.innerText = `Email : ${email}`
            var total_m = snapshot.child('users').child(user).child('total_m').val();
            var win = snapshot.child('users').child(user).child('win_m').val();
            total_match.innerText = total_m;
            win_rate.innerText = `${parseInt((parseInt(win) / parseInt(total_m)) * 100)} %`
            num_question.innerText = snapshot.child('users').child(user).child('number_q').val();
            num_win.innerText = snapshot.child('users').child(user).child('win_m').val();
            total_score.innerText = snapshot.child('users').child(user).child('score').val();
            correct_rate.innerText = `${parseInt(parseInt(snapshot.child('users').child(user).child('correct').val()) / parseInt(snapshot.child('users').child(user).child('number_q').val()) * 100)} %`
        }
        
    })
}

function playerRanking(arr, user){
    var player_ranking = document.querySelectorAll('.playerName');
    var user_field = document.querySelectorAll('#user_field');
    
    player_ranking[0].innerText = arr[1].username;
    player_ranking[1].innerText = arr[0].username;
    player_ranking[2].innerText = arr[2].username;

    for(let i = 0; i < arr.length; i++){
        if(arr[i].uid == user){
            user_field[0].innerText = `No. ${i+1}`
            user_field[1].innerText = arr[i].username
            user_field[2].innerText = arr[i].score
        }
    }
}

function playerScoreBoard(arr, user){
    var player_name = document.querySelectorAll('#player_nameTxt');
    var player_score = document.querySelectorAll('#player_scoreTxt');
    var user_no = document.querySelector('#user_no');
    var user_name = document.querySelector('#user_nameTxt');
    var user_score = document.querySelector('#user_scoreTxt');


    for(let i = 0; i < arr.length && i < 10; i++){
        player_name[i].innerText = arr[i].username;
        player_score[i].innerText = arr[i].score;
    }
    for(let i = arr.length; i < 10; i++){
        player_name[i].innerText = '-';
        player_score[i].innerText = '-';
    }
    for(let i = 0; i < arr.length; i++){
        if(arr[i].uid == user){
            user_no.innerText = `${i+1}`
            user_name.innerText = arr[i].username
            user_score.innerText = arr[i].score
        }
    }
}

function toMainBoard(){
    var user = auth.currentUser.uid
    window.location.href = `theme.html?id=${user}`
}