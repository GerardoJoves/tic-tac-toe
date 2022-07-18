const gameBoard = (function() {
    let board = [];

    function getBoard() {
        return board;
    }
    function addMark(index, mark) {
        if(board[index] === undefined) board[index] = mark;
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
    //cacheDOM 
    const squareElements = Array.from(document.querySelectorAll('.square'));

    function render(board) {
        squareElements.forEach((square, i) => square.textContent = board[i] ?? '');
    }
    function drawMark(index, mark) {
        gameBoard.addMark(index, mark);
        render(gameBoard.getBoard());
    }

    return {
        drawMark,
    }
})();
