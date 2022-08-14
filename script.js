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
    function checkGameOver(gameBoard = board) {
        for(let [a, b, c] of winCases) {
            let mark = gameBoard[a];
            if(mark !== null && gameBoard[b] === mark && gameBoard[c] === mark) {
                return {winner: true, winnerMark: mark, squares: [a, b, c], gameOver: true}
            }
        }
        if(gameBoard.some(spot => spot === null)) return {winner: false, gameOver: false}
        else return {tie: true, winner: false, gameOver: true}
    }
    function getWinCases() {
        return [...winCases]
    }

    return {
        getBoard,
        addMark,
        clearBoard,
        checkGameOver,
        winCases,
    }
})();

const displayController = (function() {
    let players;
    let currentPlayer;
    let gameOver = true;
    let xWonRounds = 0;
    let oWonRounds = 0;

    //cacheDOM 
    const squareElements = Array.from(document.querySelectorAll('.square'));
    const xMark = document.querySelector('#x-mark-template').textContent;
    const circleMark = document.querySelector('#circle-mark-template').textContent;
    const restartBtn = document.querySelector('.restart');
    const xCounterEl = document.querySelector('#x-counter');
    const oCounterEl = document.querySelector('#o-counter');
    const boardEl = document.querySelector('.game-board');
    const msgDisplayElement = document.querySelector('.msg-display .text');

    //bindEvents
    squareElements.forEach((square, i) => square.addEventListener('click', () => drawMark(i, currentPlayer.mark)));
    restartBtn.addEventListener('click', function() {
        startNewRound();
        resetCounters();
    });
    boardEl.addEventListener('click', function(e) {
        if(gameOver) {
            startNewRound();
            e.stopPropagation();
        }
    }, {capture: true});

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
        if(winnerMark) {
            if(winnerMark === 'x') xWonRounds++
            else oWonRounds++
            updateCounters();
        }
        displayMsg(`${winnerMark.toUpperCase()} wins this round`);
    }
    function displayMsg(msg) {
        msgDisplayElement.textContent = msg;
        msgDisplayElement.classList.add('visible');
    }
    function hideMsg() {
        msgDisplayElement.classList.remove('visible');
    }
    function startNewRound() {
        gameBoard.clearBoard();
        eraseMarks();
        gameOver = false;
        hideMsg();
        currentPlayer = players[0];
    }
    function resetCounters() {
        xWonRounds = 0;
        oWonRounds = 0;
        updateCounters();
    }
    function updateCounters() {
        xCounterEl.textContent = xWonRounds;
        oCounterEl.textContent = oWonRounds;
    }
    function announceTie() {
        displayMsg('It\'s a tie')
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

const AIPlayer = (function() {
    let playerMark = 'x';
    let oppntMark = 'o';

    function calculateUtility(boardState) {
        let utility = 0;

        for(let adjacentCells of gameBoard.winCases) {
            let markCounter = 0;
            let oppntCounter = 0;
            let emptyCells = 0;
            adjacentCells.forEach(cell => {
                if(boardState[cell] === playerMark) markCounter++;
                else if(boardState[cell] === oppntMark) oppntCounter++;
                else emptyCells++;
            });

            if(emptyCells === 3) continue 
            else if(markCounter === 3) utility += 1000;
            else if(oppntCounter === 2 && markCounter === 1) utility += 100;
            else if(markCounter === 2 && emptyCells === 1) utility += 10;
            else if(markCounter === 1 && emptyCells === 2) utility += 1;
            else if(markCounter === 1 && oppntCounter === 1 && emptyCells === 1) utility += 0.1;
        }

        return utility;1
    }

    function getNextMove(currentBoard) {
        const bestMove = {
            index: null,
            utility: 0,
        }

        currentBoard.forEach((cell, index) => {
            if(cell != null) return;

            let potentialMove = [...currentBoard];
            potentialMove[index] = playerMark;

            let potentialUtility = calculateUtility(potentialMove);
            if(bestMove.index === null || potentialUtility > bestMove.utility) {
                [bestMove.index, bestMove.utility] = [index, potentialUtility];
            } 
        });

        return bestMove;
    }

    return {
        getNextMove,
    }
})();