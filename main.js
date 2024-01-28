const GameBoard = (() => {
    const gameboard = [];

    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            row.push(' ');
        }
        gameboard.push(row);
    }

    const checkWinner = () => {
        for (let i = 0; i < 3; i++) {
            if (gameboard[i][0] !== ' ' && gameboard[i][0] === gameboard[i][1] && gameboard[i][0] === gameboard[i][2]) {
                return gameboard[i][0]; 
            }
        }

        for (let j = 0; j < 3; j++) {
            if (gameboard[0][j] !== ' ' && gameboard[0][j] === gameboard[1][j] && gameboard[0][j] === gameboard[2][j]) {
                return gameboard[0][j]; 
            }
        }

        if (gameboard[0][0] !== ' ' && gameboard[0][0] === gameboard[1][1] && gameboard[0][0] === gameboard[2][2]) {
            return gameboard[0][0]; 
        }
        if (gameboard[0][2] !== ' ' && gameboard[0][2] === gameboard[1][1] && gameboard[0][2] === gameboard[2][0]) {
            return gameboard[0][2]; 
        }
        return null;
    };

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameboard[i][j] !== ' ') {
                    gameboard[i][j] = ' ';
                }
            }
        }
    };

    return {
        getGameBoard: () => gameboard,
        updateCell: (row, column, mark) => {
            if (gameboard[row][column] === ' ') {
                gameboard[row][column] = mark;
                return true;
            }
            return false;
        },
        checkWinner,
        resetBoard,
    };
})();

const Player = (mark) => mark;

let player1 = Player("x");
let player2 = Player("o");

const MainGame = ((GameBoard, player1, player2) => {
    let currentPlayer = player1;
    let player1Points = 0;
    let player2Points = 0;
    let round = 1;
    let spaces = 9;

    const playerOne = document.querySelector(".player1");
    const playerTwo = document.querySelector(".player2");
    const cells = document.querySelectorAll(".cell");
    const span = document.querySelector("#round");
    const modal = document.getElementById("myModal");
    const winnerMessage = document.getElementById("winnerMessage");
    const currPlayer = document.querySelector(".current-player");
    const closeBtn = document.querySelector(".close");
    const restartBtn = document.querySelector("#restartBtn");

    const updateRoundDisplay = () => {
        if (round <=3){
            span.textContent = round;
        }else if (round===4){
            span.textContent = "3";
        }
    };

    const updatePlayerIndicators = () => {
        playerOne.textContent = player1Points;
        playerTwo.textContent = player2Points;
    };

    const clearCells = () => {
        cells.forEach((cell) => {
            cell.textContent = '';
        });
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const makeMove = (row, column, cell) => {
        if (round <= 3) {
            const moveResult = GameBoard.updateCell(row, column, currentPlayer);
            if (moveResult) {
                cell.textContent = currentPlayer;
                currPlayer.textContent = currentPlayer;
                const winner = GameBoard.checkWinner();
                spaces--;
                if (!winner && spaces > 0) {
                    switchPlayer();
                } else {
                    if (winner === "x") {
                        player1Points++;
                        playerOne.textContent = player1Points;
                        currentPlayer = player2;
                        currPlayer.textContent = currentPlayer;
                        winnerMessage.textContent = `Player X wins Round ${round}!`;
                    } else if (winner === "o") {
                        player2Points++;
                        playerTwo.textContent = player2Points;
                        currentPlayer = player1;
                        currPlayer.textContent = currentPlayer;
                        winnerMessage.textContent = `Player O wins Round ${round}!`;
                    } else {
                        winnerMessage.textContent = "It's a tie!";
                    }
                    modal.style.display = "block";
                    closeBtn.onclick = function () {
                        modal.style.display = "none";
                    };
                    window.onclick = function (event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    };
                    setTimeout(() => {
                        clearCells();
                        spaces = 9; 
                        round++;
                        updateRoundDisplay();
                        GameBoard.resetBoard();
                    }, 1500);
                }
            }else {
                winnerMessage.textContent = 'Invalid move. Cell is already occupied.';
            }
        }if (round === 4) {
            
            if (player1Points > player2Points) {
                winnerMessage.textContent = `x wins!!! ${player1Points} points`;
            } else if (player2Points > player1Points) {
                winnerMessage.textContent = `o wins!! ${player2Points} points`;
            } else {
                winnerMessage.textContent = "It's a tie!!";
            }
        }
    };
    function resetGame() {
        cells.forEach(cell => {
            cell.removeEventListener("click", cellClickHandler);
        });

        clearCells();
        GameBoard.resetBoard();
        currentPlayer = player1;
        player1Points = 0;
        player2Points = 0;
        round = 1;
        updateRoundDisplay();
        updatePlayerIndicators();

        cells.forEach(cell => {
            cell.addEventListener("click", cellClickHandler);
        });
    }

    function cellClickHandler() {
        const index = parseInt(this.id);
        let row, col;

        if (index === 1) {
            row = 0;
            col = 0;
        } else if (index === 2) {
            row = 0;
            col = 1;
        } else if (index === 3) {
            row = 0;
            col = 2;
        } else if (index === 4) {
            row = 1;
            col = 0;
        } else if (index === 5) {
            row = 1;
            col = 1;
        } else if (index === 6) {
            row = 1;
            col = 2;
        } else if (index === 7) {
            row = 2;
            col = 0;
        } else if (index === 8) {
            row = 2;
            col = 1;
        } else if (index === 9) {
            row = 2;
            col = 2;
        }

        makeMove(row, col, this);
    }
    restartBtn.addEventListener("click", resetGame);

    // Initialize the game by attaching event listeners to cells
    cells.forEach(cell => {
        cell.addEventListener("click", cellClickHandler);
    });

})(GameBoard, player1, player2);

