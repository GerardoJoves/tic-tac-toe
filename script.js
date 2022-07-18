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
    function resetBoard() {
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
        resetBoard,
        checkGameOver,
    }
})();

const displayController = (function() {
    let players;
    let currentPlayer;
    let gameOver = false;

    //cacheDOM 
    const squareElements = Array.from(document.querySelectorAll('.square'));
    //bindEvents
    squareElements.forEach((square, i) => square.addEventListener('click', () => drawMark(i, currentPlayer.mark)))

    function render(board) {
        squareElements.forEach((square, i) => square.textContent = board[i] ?? '');
    }
    function drawMark(index, mark) { 
        if(gameOver) return
        else if(gameBoard.addMark(index, mark)) {
            render(gameBoard.getBoard());
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

    return {
        drawMark,
        setPlayers,
        render
    }
})();

displayController.setPlayers({mark: 'X'}, {mark: 'O'});
