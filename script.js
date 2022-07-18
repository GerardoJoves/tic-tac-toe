const gameBoard = (function() {
    let board = [];

    function getBoard() {
        return board;
    }
    function addMark(index, mark) {
        if(board[index] === undefined) {
            board[index] = mark;
            return true;
        } else return false;
    }
    function resetBoard() {
        board = [];
    }

    return {
        getBoard,
        addMark,
        resetBoard,
    }
})();

const displayController = (function() {
    let players;
    let currentPlayer;
    //cacheDOM 
    const squareElements = Array.from(document.querySelectorAll('.square'));
    //bindEvents
    squareElements.forEach((square, i) => square.addEventListener('click', () => drawMark(i, currentPlayer.mark)))

    function render(board) {
        squareElements.forEach((square, i) => square.textContent = board[i] ?? '');
    }
    function drawMark(index, mark) { 
        if(gameBoard.addMark(index, mark)) {
            render(gameBoard.getBoard());
            changeTurn();
        }
    }
    function setPlayers(player1, player2) {
        players = [player1, player2];
        currentPlayer = players[0];
    }
    function changeTurn() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    return {
        drawMark,
        setPlayers,
    }
})();

displayController.setPlayers({mark: 'X'}, {mark: 'O'})
