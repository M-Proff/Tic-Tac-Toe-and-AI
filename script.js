// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');
    const status = document.getElementById('statusMessage');

    let board = ['', '', '', '', '', '', '', '', '']; // 9 cells
    let humanTurn = true; // Human starts
    let gameActive = true;

    // Winning combinations (indexes of board array)
    const winningConditions = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6]           // diagonals
    ];

    // Show a status message with fade in/out
    function showStatusMessage(message) {
        status.innerText = message;
        status.classList.add('show');

        // Optional: hide after 3 seconds
        clearTimeout(status.hideTimeout);
        status.hideTimeout = setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }

    // Check for winner or draw
    function checkResult() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                return board[a]; // return 'X' or 'O'
            }
        }
        if (!board.includes('')) {
            return 'draw';
        }
        return null;
    }

    // AI move (simple random empty cell)
    function aiMove() {
        if (!gameActive) return;

        let emptyIndices = board
            .map((val, idx) => val === '' ? idx : null)
            .filter(idx => idx !== null);

        if (emptyIndices.length === 0) return;

        // Simple AI: choose random empty cell
        let choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        board[choice] = 'O';
        boxes[choice].innerText = 'O';

        let result = checkResult();
        if (result === 'O') {
            gameActive = false;
            showStatusMessage("AI Wins!");
        } else if (result === 'draw') {
            gameActive = false;
            showStatusMessage("It's a Draw!");
        } else {
            humanTurn = true;
            showStatusMessage("Your Turn");
        }
    }

    // Handle human click
    function onBoxClick(e) {
        if (!gameActive || !humanTurn) return;

        const idx = Array.from(boxes).indexOf(e.target);
        if (board[idx] !== '') return;

        board[idx] = 'X';
        boxes[idx].innerText = 'X';

        let result = checkResult();
        if (result === 'X') {
            gameActive = false;
            showStatusMessage("You Win!");
        } else if (result === 'draw') {
            gameActive = false;
            showStatusMessage("It's a Draw!");
        } else {
            humanTurn = false;
            showStatusMessage("AI's Turn");
            setTimeout(aiMove, 800); // AI plays after 0.8s
        }
    }

    // Initialize game
    function init() {
        board.fill('');
        boxes.forEach(box => box.innerText = '');
        gameActive = true;
        humanTurn = true;
        showStatusMessage("Your Turn");
    }

    // Add event listeners to boxes
    boxes.forEach(box => box.addEventListener('click', onBoxClick));

    // Start game on page load
    init();
});
