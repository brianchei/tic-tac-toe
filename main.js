function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for(i = 0; i < rows; i++) {
        board[i] = [];
        for(j = 0; j < columns; j++) {
            let cell = Cell();
            board[i][j] = cell;
            cell.setLocation(i, j);
        }
    }

    function getBoard() {
        return board;
    }

    function updateBoard(location, player) {
        if(!location) {
            return;
        }
        if(board[location[0]][location[2]].getValue() != '') {
            return false;
        }
        board[location[0]][location[2]].setValue(player.value);
        return true;
    }

    function eraseBoard() {
        for(row of board) {
            for(cell of row) {
                cell.setValue('');
            }
        }
        return board;
    }

    function printBoard() {
        let boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        return(boardWithCellValues);
    }

    return {getBoard, updateBoard, eraseBoard, printBoard};
}

function Cell() {
    let value = '';
    let location = [];

    function setValue(newValue) {
        value = newValue;
    }

    function getValue() {
        return value;
    }

    function setLocation(x, y) {
        location.push(x, y)
    }

    function getLocation() {
        return location;
    }

    return {setValue, getValue, setLocation, getLocation};
}

function GameController() {
    let playerOne = 'Player 1';
    let playerTwo = 'Player 2';
    let board = Gameboard();
    let gameOver = false;
    let winner;

    let players = [
        {
            name: playerOne,
            value: 'X',
        },
        {
            name: playerTwo,
            value: 'O',
        }
    ]

    let activePlayer = players[0];

    function changePlayerName(playerOneName, playerTwoName) {
        players[0].name = playerOneName;
        players[1].name = playerTwoName;
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function switchActivePlayer() {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    function printRound() {
        console.log(board.printBoard());
        console.log(`${getActivePlayer().name}'s turn`);
    }

    function playRound(location) {
        let currPlayer = getActivePlayer();
        if(board.updateBoard(location, currPlayer)) {
            // switch only if location has been played
            switchActivePlayer();
        }
        console.log(board.printBoard());
        printRound();
        if(checkWinner()) {
            return checkWinner();
        }
    }

    function resetBoard() {
        board.eraseBoard();
        activePlayer = (activePlayer === players[0]) ? players[0] : players[0];
        gameOver = false;
        winner = null;
    }

    function checkWinner() {
        let threeInRowX= 0;
        let threeInRowO = 0;

        // check winners row-wise
        for(row of board.getBoard()) {
            if (threeInRowX === 3) {
                winner = players[0].name;
                gameOver = true;
                return winner;
            } else if (threeInRowO === 3) {
                winner = players[1].name;
                gameOver = true;
                return winner;
            }

            threeInRowX= 0;
            threeInRowO = 0;

            for(cell of row) {
                if(cell.getValue() === 'X') {
                    threeInRowX++;
                } else if (cell.getValue() === 'O') {
                    threeInRowO++;
                }
            }
        }

        let threeInColumnX = 0;
        let threeInColumnO = 0;

        // check winner column-wise
        for(let i = 0; i < 3; i++) {
            if(threeInColumnX === 3) {
                winner = players[0].name;
                gameOver = true;
                return winner;
            } else if(threeInColumnO === 3) {
                winner = players[0].name;
                gameOver = true;
                return winner;
            }
            threeInColumnX = 0;
            threeInColumnO = 0;

            for(row of board.getBoard()) {
                if (row[i].getValue() === 'X') {
                    threeInColumnX++;
                } else if (row[i].getValue() === 'O') {
                    threeInColumnO++;
                }
            }
        }

        // check winner diagonally
        threeInDiagonalX = 0;
        threeInDiagonalO = 0;

        if(board.getBoard()[1][1].getValue() === 'X' 
        && ((board.getBoard()[0][0].getValue() === 'X' && board.getBoard()[2][2].getValue() === 'X') 
        || (board.getBoard()[0][2].getValue() === 'X' && board.getBoard()[2][0].getValue() === 'X'))) {
            winner = players[0].name;
            gameOver = true;
            return winner;
        } else if (board.getBoard()[1][1].getValue() === 'O' 
        && ((board.getBoard()[0][0].getValue() === 'O' && board.getBoard()[2][2].getValue() === 'O') 
        || (board.getBoard()[0][2].getValue() === 'O' && board.getBoard()[2][0].getValue() === 'O'))) {
            winner = players[1].name;
            gameOver = true;
            return winner;
        }

        // check draw
        let totalSpots = 9;

        for(row of board.getBoard()) {
            for(cell of row) {
                if(cell.getValue() != '') {
                    totalSpots--;
                }
            }
        }

        if(totalSpots === 0) {
            winner = 'TIE';
        }

        if (winner) {
            gameOver = true;
        }
        
        return winner;
    }

    function checkGameOver() {
        return gameOver;
    }

    function getWinner() {
        return winner;
    }

    printRound();
    return {playRound, changePlayerName, getActivePlayer, getBoard: board.getBoard(), resetBoard, checkGameOver, getWinner};
}

function ScreenController() {
    let gameController = GameController();

    // initialize dom elements
    let reset = document.querySelector('.reset');
    let turn = document.querySelector('.turn');
    let gameboard = document.querySelector('.gameboard');
    const submitForm = document.querySelector('.submit');
    const closeForm = document.querySelector('.close-form');

    // winner switch
    let winner = gameController.getWinner();

    function updateScreen() {
        // update winner
        winner = gameController.getWinner();
        // erase screen
        while(gameboard.firstChild) {
            gameboard.removeChild(gameboard.firstChild);
        }
        // get game information
        let board = gameController.getBoard;
        let activePlayer = gameController.getActivePlayer();

        // render turn/win information
        if (winner) {
            turn.textContent = gameController.getWinner() + " has won!";
            // disable gameboard
            gameboard.removeEventListener('click', clickHandler);
        } else {
            turn.textContent = activePlayer.name + "'s turn";
            gameboard.addEventListener('click', clickHandler);
        }

        // print to screen
        for(row of board) {
            for(cell of row) {
                let currCell = document.createElement('div');
                currCell.classList.add('cell');
                currCell.textContent = cell.getValue();
                currCell.dataset.location = cell.getLocation();
                // add class for color marker
                if(cell.getValue() === 'X') {
                    currCell.classList.add('X');
                } else if(cell.getValue() === 'O') {
                    currCell.classList.add('O');
                }

                gameboard.appendChild(currCell);
            }
        }
    }

    function clickHandler(e) {
        // click target
        let clickTarget = e.target;
        let location = clickTarget.dataset.location;

        // modal
        const modal = document.querySelector('.modal');
        const modalOverlay = document.querySelector('.modal-overlay');

        // board
        let board = gameController.getBoard;
        // check if valid target or reset
        if(clickTarget.className === 'reset') {
            gameController.resetBoard();
            updateScreen();
            return;
        } else if(clickTarget.className === 'close-form') {
            modal.close();
            modalOverlay.remove();
            return;
        } else if(clickTarget.className === 'submit') {
            const form = document.querySelector('form');
            const formData = new FormData(form);
            let playerOne = formData.get('player-one');
            let playerTwo = formData.get('player-two');

            modalOverlay.remove();
            gameController.changePlayerName(playerOne, playerTwo);
            updateScreen();
            return;
        } else if(clickTarget.className != 'cell') {
            return;
        }

        // update screen
        winner = gameController.playRound(location);
        updateScreen();
    }

    submitForm.addEventListener('click', clickHandler);
    closeForm.addEventListener('click', clickHandler);
    reset.addEventListener('click', clickHandler);

    // add only if game isn't already over
    if(!gameController.checkGameOver()) {
        gameboard.addEventListener('click', clickHandler);
    }

    // initial render
    updateScreen();
}

ScreenController();