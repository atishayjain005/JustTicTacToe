console.log('Hello World');

//gettting all the boxes 
const cols = Array.from(document.getElementsByClassName('col'));
const playText = document.getElementById('playtext');
const spaces = [null, null, null, null, null, null, null, null, null];
const reset = document.getElementById('reset')

const player1 = "X";
const player2 = "O";
let p1 = document.getElementById('player1');
let p2 = document.getElementById('player2');

let currentPlayer = player1;
console.log(cols);
cols.forEach((box) => {
    box.addEventListener("click", boxClicked);
})

function boxClicked(e) {
    const id = e.target.id;
    console.log(id);
    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;
        if (playerHasWon()) {
            if (currentPlayer == player1) {
                p1.style.color = '#f8f9fa';
                p2.style.color = 'transparent';
                playText.innerHTML = `<h1 style="font-size: 4rem;">---- <span style ="color:blue;">Player 1</span> Wins! ----</h1>`;
            }
            if (currentPlayer == player2) {
                p2.style.color = '#f8f9fa';
                p1.style.color = 'transparent';
                playText.innerHTML = `<h1 style="font-size: 4rem;">---- <span style ="color:red;">Player 2</span> Wins! ----</h1>`;
            }
        }
        if (currentPlayer == player2) {
            currentPlayer = player1;
        } else {
            currentPlayer = player2;
        }
    }
}

function playerHasWon() {
    if (spaces[0] === currentPlayer) {
        if (spaces[1] === currentPlayer && spaces[2] === currentPlayer) {
            console.log(`${currentPlayer} wins up top`);
            return true;
        }
        if (spaces[3] === currentPlayer && spaces[6] === currentPlayer) {
            console.log(`${currentPlayer} wins on the left`);
            return true;
        }
        if (spaces[4] === currentPlayer && spaces[8] === currentPlayer) {
            console.log(`${currentPlayer} wins on the diagonal`);
            return true;
        }
    }
    //from bottom check up and across
    if (spaces[8] === currentPlayer) {
        if (spaces[2] === currentPlayer && spaces[5] === currentPlayer) {
            console.log(`${currentPlayer} wins on the right`);
            return true;
        }
        if (spaces[7] === currentPlayer && spaces[6] === currentPlayer) {
            console.log(`${currentPlayer} wins on the bottom`);
            return true;
        }
    }
    //from middle check middle vertical and middle horizontal
    if (spaces[4] === currentPlayer) {
        if (spaces[3] === currentPlayer && spaces[5] === currentPlayer) {
            console.log(`${currentPlayer} wins on the middle horizontal`);
            return true;
        }
        if (spaces[1] === currentPlayer && spaces[7] === currentPlayer) {
            console.log(`${currentPlayer} wins on the middle vertical`);
            return true;
        }
        if (spaces[2] === currentPlayer && spaces[6] === currentPlayer) {
            console.log(`${currentPlayer} wins on the middle horizontal`);
            return true;
        }
    }
}
reset.addEventListener("click", () => {
    spaces.forEach((space, index) => {
        spaces[index] = null;
    });
    cols.forEach((box) => {
        box.innerText = "";
    });
    playText.innerHTML = `Let's Play!!`;
    p1.style.color = '';
    p2.style.color = '';
    currentPlayer = player1;

});