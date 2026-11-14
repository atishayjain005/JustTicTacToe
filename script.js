const cols = Array.from(document.querySelectorAll('#main .col'));
const playText = document.getElementById('playtext');
const reset = document.getElementById('reset');
const spaces = Array(9).fill(null);
const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
let currentPlayer = 'X';
let finished = false;

cols.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (finished || spaces[index]) return;
        spaces[index] = currentPlayer;
        box.textContent = currentPlayer;
        box.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${currentPlayer}`);
        const winningLine = winningLines.find(line => line.every(i => spaces[i] === currentPlayer));
        if (winningLine) {
            finished = true;
            winningLine.forEach(i => {
                cols[i].classList.add('winning');
                cols[i].setAttribute('aria-label', `${cols[i].getAttribute('aria-label')}, winning square`);
            });
            playText.textContent = `Player ${currentPlayer === 'X' ? 1 : 2} (${currentPlayer}) wins!`;
        } else if (spaces.every(Boolean)) {
            finished = true;
            playText.textContent = "It's a draw!";
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            playText.textContent = `Player ${currentPlayer === 'X' ? 1 : 2} (${currentPlayer}) to play`;
        }
    });
});

reset.addEventListener('click', () => {
    spaces.fill(null);
    cols.forEach((box, index) => {
        box.textContent = '';
        box.classList.remove('winning');
        box.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: empty`);
    });
    currentPlayer = 'X';
    finished = false;
    playText.textContent = 'Player 1 (X) to play';
    cols[0].focus();
});
playText.textContent = 'Player 1 (X) to play';
