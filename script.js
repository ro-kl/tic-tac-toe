let board;
const huPlayer = 'O';
const aiPlayer = 'X';
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
const cells = document.querySelectorAll('.cell');
let over = true;

startGame();

function startGame() {
    over = false;
    board = Array.from(Array(9).keys());
    cells.forEach(cell => {
            cell.innerText = '';
            cell.style.removeProperty('background-color');
            cell.addEventListener('click', turnClick, false);
        }
    )
}

function turnClick(square) {
    if (typeof board[square.target.id] === 'number' && !over) {
        turn(square.target.id, huPlayer);
        if (!checkTie() && !over) turn(bestSpot(), aiPlayer)
    }
}

function checkTie() {
    if (emptySquares().length === 0) {
        over = true;
        cells.forEach(c => {
            c.removeEventListener('click', turnClick, false);
            return true;
        })
    }
    return false;
}

function bestSpot() {
    return minmax(board, aiPlayer).index;
}

function minmax(newBoard, player) {
    let availableSpot = emptySquares(newBoard);
    if (checkWon(newBoard, player).length > 0) {
        return {score: -10};
    } else if (checkWon(newBoard, aiPlayer).length > 0) {
        return {score: 20};
    } else if (availableSpot.length === 0) {
        return {score: 0};
    }
    let moves = [];
    for (let i = 0; i < availableSpot.length; i++) {
        let move = {};
        move.index = newBoard[availableSpot[i]];
        newBoard[availableSpot[i]] = player;

        if (player === aiPlayer) {
            let result = minmax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            let result = minmax(newBoard, aiPlayer);
            move.score = result.score;
        }
        newBoard[availableSpot[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function emptySquares() {
    return board.filter(s => typeof s == 'number');
}

function turn(id, player) {
    board[id] = player;
    document.getElementById(id).innerText = player;
    let wonCombo = checkWon(board, player);
    wonCombo.length > 0 ? gameOver(wonCombo) : '';
}

function checkWon(board, player) {
    let checkedIndex = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === player) checkedIndex.push((i));
    }
    let matches = [];
    combos.forEach(combo => {
        if (checkedIndex.includes(combo[0]) &&
            checkedIndex.includes(combo[1]) &&
            checkedIndex.includes(combo[2])) {
            matches = combo;
        }
    });
    return matches;
}

function gameOver(wonCombo) {
    over = true;
    wonCombo.forEach(i => {
            document.getElementById(i).style.backgroundColor = 'green';
        }
    );
    cells.forEach(cell => {
            cell.removeEventListener('click', turnClick, false);
        }
    )
}
