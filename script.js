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

startGame();

function startGame() {
    document.querySelector('.endgame').style.display = 'none';
    board = Array.from(Array(9).keys());
    cells.forEach(cell => {
            cell.innerText = '';
            cell.style.removeProperty('background-color');
            cell.addEventListener('click', turnClick, false);
        }
    )
}

function turnClick(square) {
    turn(square.target.id, huPlayer);
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
    wonCombo.forEach(i => {
            document.getElementById(i).style.backgroundColor = 'green';
        }
    );
    cells.forEach(cell => {
            cell.removeEventListener('click', turnClick, false);
        }
    )
}
