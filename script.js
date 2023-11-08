const gameboard = document.querySelector(".gameboard");
const infoTurn = document.querySelector(".player-turn");
const resetBtn = document.querySelector("#restartGameBtn");
const CELLS = 9;

const gamePieces = ["X", "O"];
let gameOver = false;
let userPiece;
let botPiece;
let gameCells;
let moves = 0;

window.onload = () => {
    setBoard();
    setUserPieces();
    infoTurn.textContent = `You: ${userPiece} | Bot: ${botPiece}`;
};

function setBoard() {
    for (let i = 0; i < CELLS; ++i) {
        let newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.setAttribute("onclick", `setCell(${i})`);
        gameboard.appendChild(newCell);
    }
}

function setCell(index) {
    if (gameOver) {
        return;
    }
    ++moves;
    gameCells = document.querySelectorAll(".cell");
    if (gameCells[index].textContent === "") {
        gameCells[index].textContent = userPiece;
        checkWinner();
        setPieceSound();
        if (!gameOver) {
            setTimeout(() => {
                ++moves;
                botMove();
                checkWinner();
                setPieceSound();
            }, 1500);
        }
    }
}

function setUserPieces() {
    if (gamePieces[Math.floor(Math.random() * gamePieces.length)] === gamePieces[0]) {
        userPiece = gamePieces[0];
        botPiece = gamePieces[1];
    } else {
        userPiece = gamePieces[1];
        botPiece = gamePieces[0];
    }
}

function botMove() {
    let potentialCell = gameCells[Math.floor(Math.random() * gameCells.length)];
    if (potentialCell.textContent === "") {
        potentialCell.textContent = botPiece;
    } else {
        botMove();
    }
}

const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkWinner() {
    for (let array of combos) {
        let foundUserPiece = 0;
        let foundBotPiece = 0;
        for (let index of array) {
            if (gameCells[index].textContent === userPiece) {
                ++foundUserPiece;
            } else if (gameCells[index].textContent === botPiece) {
                ++foundBotPiece;
            }
        }
        //check if each position of an array from combos have the same symbol
        if (foundUserPiece === 3) {
            infoTurn.textContent = `You won!`;
            winnerSound();
            gameOver = true;
        } else if (foundBotPiece === 3) {
            infoTurn.textContent = "Bot wins!";
            winnerSound();
            gameOver = true;
        }

        //set color for winner
        if (foundBotPiece === 3 || foundUserPiece === 3) {
            for (let i of array) {
                gameCells[i].classList.add("win");
            }
            showResetBtn();
            return; //exit the function
        } else if (moves === CELLS) {
            infoTurn.textContent = "Draw!";
            showResetBtn();
        }
    }
}

function showResetBtn() {
    setTimeout(() => {
        resetBtn.classList.remove("hidden");
    }, 1000);
}

resetBtn.addEventListener("click", function () {
    window.location.reload();
});

function setPieceSound() {
    const effect = new Audio("./audio/setPiece_click_sound.wav");
    effect.volume = 0.5;
    effect.oncanplaythrough = effect.play();
}

function winnerSound() {
    const effect = new Audio("./audio/win_effect.wav");
    effect.volume = 0.5;
    effect.oncanplaythrough = effect.play();
}
