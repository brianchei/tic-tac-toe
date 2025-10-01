/* Pseudocode
function Gameboard
    const board = []
    const rows = 3
    const columns = 3

    for i in 3
        rows[i] = []
        for j in 3
            row[i][j] = [];

    function getBoard
        return board

    function updateBoard(value)
        cell empty?
            cell.value = value;
    function eraseBoard(board)
        for cell in board
            cell = []
    function printBoard(board)
        for i in rows
            print row

    return {getBoard, updateBoard, eraseBoard, printBoard};
    

function Cell
    let value;
    let location = [];
    function setValue(value)
        value = value

    function getValue
        return value
    
    function eraseCell
        value = null

    return {setValue, getValue, eraseCell};

function GameController
    let player1, player2
    let board
    let activePlayer

    function playRound
        eraseBoard()
        board = getBoard()
        printBoard(board)
    
    function checkWinner
        threeInRow = 0
        for i in row
            threeInRow = 3 ? return player : continue
            for j in column
                if Cell.getValue != 0
                    threeInRow++

    function declareWinner(player)
        print(player has won!)

    function switchActivePlayer
        activePlayer = player1 ? player2 : player1
*/

function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for(i = 0; i < rows; i++) {
        board[i] = [];
        for(j = 0; j < columns; j++) {
            let cell = Cell();
            board[i][j] = Cell();
            cell.setLocation(i, j);
        }
    }

    function getBoard() {
        return board;
    }

    function updateBoard(location, player) {
        board[location[0]][location[1]].setValue(player.value);
    }

    function eraseBoard() {
        for(row of board) {
            for(cell of row) {
                cell.setValue(0);
                cell.value = 0;
            }
        }
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
        location.push(location)
    }

    function getLocation() {
        return location;
    }

    return {setValue, getValue, setLocation, getLocation, location};
}

function GameController() {
    let playerOne = 'Player 1';
    let playerTwo = 'Player 2';
    let board = Gameboard();

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
        if(checkWinner()) {
            return checkWinner();
        }
        board.updateBoard(location, getActivePlayer());
        console.log(board.printBoard());
        switchActivePlayer();
        printRound();
    }

    function checkWinner() {
        let winner;

        let threeInRowX= 0;
        let threeInRowO = 0;

        // check winners row-wise
        for(row of board.getBoard()) {
            if (threeInRowX === 3) {
                winner = playerOne;
                declareWinner(winner);
                return winner;
            } else if (threeInRowO === 3) {
                winner = playerTwo;
                declareWinner(winner);
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
                winner = playerOne;
            } else if(threeInColumnO === 3) {
                winner = playerTwo;
            }
            threeInColumnX = 0;
            threeInColumnX = 0;

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
            winner = playerOne;
            declareWinner(winner);
            return winner;
        } else if (board.getBoard()[1][1].getValue() === 'O' 
        && ((board.getBoard()[0][0].getValue() === 'O' && board.getBoard()[2][2].getValue() === 'O') 
        || (board.getBoard()[0][2].getValue() === 'O' && board.getBoard()[2][0].getValue() === 'O'))) {
            winner = playerTwo;
            declareWinner(winner);
            return winner;
        }

        if (winner) {
            declareWinner(winner);
        }
        
        return winner;
    }

    function declareWinner(player) {
        console.log(player + ' has won!')
    }

    printRound();
    return {playRound, getActivePlayer};
}

