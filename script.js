const gameBoard = (function() {
    let board = [null, null, null, null, null, null, null, null, null];
    const winCases = [
        // numbers represent positions on the board
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function getBoard() {
        return [...board];
    }
    function addMark(index, mark) {
        if(index < 9 && board[index] === null) {
            board[index] = mark;
            return true;
        } else return false;
    }
    function clearBoard() {
        board.forEach((_, i) => board[i] = null);
    }
    function checkGameOver() {
        for(let [a, b, c] of winCases) {
            let mark = board[a];
            if(mark !== null && board[b] === mark && board[c] === mark) {
                return {winner: true, winnerMark: mark}
            }
        }
        if(board.some(spot => spot === null)) return {winner: false}
        else return {tie: true}
    }

    return {
        getBoard,
        addMark,
        clearBoard,
        checkGameOver,
    }
})();

const displayController = (function() {
    let players;
    let currentPlayer;
    let gameOver = true;

    //cacheDOM 
    const squareElements = Array.from(document.querySelectorAll('.square'));
    const xMark = document.querySelector('#x-mark-template').textContent;
    const circleMark = document.querySelector('#circle-mark-template').textContent;

    //bindEvents
    squareElements.forEach((square, i) => square.addEventListener('click', () => drawMark(i, currentPlayer.mark)))

    function eraseMarks() {
        squareElements.forEach(square => square.innerHTML = '');
    }

    function drawMark(index, mark) { 
        if(gameOver) return
        else if(gameBoard.addMark(index, mark)) {

            if(mark === 'x') squareElements[index].innerHTML = xMark;
            else if(mark === 'o') squareElements[index].innerHTML = circleMark;

            let turnInfo = gameBoard.checkGameOver();
            if(turnInfo.winner) {
                gameOver = true;
                announceWinner(turnInfo.winnerMark);
            } else if(turnInfo.tie) {
                gameOver = true;
                announceTie();
            } else changeTurn();
        }
    }
    function setPlayers(player1, player2) {
        players = [player1, player2];
        currentPlayer = players[0];
        gameOver = false;
    }
    function changeTurn() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }
    function announceWinner(winnerMark) {
        console.log(`${winnerMark} wins`)
    }
    function announceTie() {
        console.log('it\'s a tie');
    }
    function resetBoard() {
        gameBoard.clearBoard();
        eraseMarks();
        gameOver = false;
    }

    return {
        drawMark,
        setPlayers,
        resetBoard,
    }
})();

displayController.setPlayers({mark: 'x'}, {mark: 'o'});