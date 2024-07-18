let dice = [0, 0, 0, 0, 0];
let rollCount = 0;
const maxRolls = 3;
let currentPlayer = 1;
let scores = {
    player1: {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeKind: null,
        fourKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null
    },
    player2: {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeKind: null,
        fourKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-button');
    rollButton.addEventListener('click', rollDice);
    updateDice();
    updatePlayerTurn();
    addScoreboardListeners();
});

function rollDice() {
    if (rollCount < maxRolls) {
        for (let i = 0; i < dice.length; i++) {
            if (!document.getElementById(`die${i + 1}`).classList.contains('held')) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        rollCount++;
        updateDice();
        calculateAndDisplayScores();
    }
}

function updateDice() {
    for (let i = 0; i < dice.length; i++) {
        const die = document.getElementById(`die${i + 1}`);
        die.textContent = dice[i];
        die.addEventListener('click', () => toggleHold(die, i));
    }
}

function toggleHold(die, index) {
    die.classList.toggle('held');
}

function addScoreboardListeners() {
    const scoreCells = document.querySelectorAll('.score-cell');
    scoreCells.forEach(cell => {
        cell.addEventListener('click', () => scoreCategory(cell));
    });
}

function scoreCategory(cell) {
    const [player, , category] = cell.id.split('-');
    if (scores[player][category] === null) {
        const score = calculateScore(category);
        scores[player][category] = score;
        document.getElementById(`${player}-${category}-value`).textContent = score;
        updateScoreboard();
        switchPlayer();
    } else {
        alert("This category has already been scored.");
    }
}

function calculateAndDisplayScores() {
    const categories = Object.keys(scores['player' + currentPlayer]);
    categories.forEach(category => {
        if (scores['player' + currentPlayer][category] === null) {
            document.getElementById(`p${currentPlayer}-score-${category}`).textContent = calculateScore(category);
        }
    });
}

function calculateScore(category) {
    switch (category) {
        case 'ones': return dice.filter(die => die === 1).length * 1;
        case 'twos': return dice.filter(die => die === 2).length * 2;
        case 'threes': return dice.filter(die => die === 3).length * 3;
        case 'fours': return dice.filter(die => die === 4).length * 4;
        case 'fives': return dice.filter(die => die === 5).length * 5;
        case 'sixes': return dice.filter(die => die === 6).length * 6;
        case 'threeKind': return hasNOfAKind(3) ? dice.reduce((a, b) => a + b, 0) : 0;
        case 'fourKind': return hasNOfAKind(4) ? dice.reduce((a, b) => a + b, 0) : 0;
        case 'fullHouse': return hasFullHouse() ? 25 : 0;
        case 'smallStraight': return hasSmallStraight() ? 30 : 0;
        case 'largeStraight': return hasLargeStraight() ? 40 : 0;
        case 'yahtzee': return hasNOfAKind(5) ? 50 : 0;
        case 'chance': return dice.reduce((a, b) => a + b, 0);
        default: return 0;
    }
}

function hasNOfAKind(n) {
    const counts = {};
    dice.forEach(die => counts[die] = (counts[die] || 0) + 1);
    return Object.values(counts).some(count => count >= n);
}

function hasFullHouse() {
    const counts = {};
    dice.forEach(die => counts[die] = (counts[die] || 0) + 1);
    const values = Object.values(counts);
    return values.includes(3) && values.includes(2);
}

function hasSmallStraight() {
    const straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];
    return straights.some(straight => straight.every(num => dice.includes(num)));
}

function hasLargeStraight() {
    const straights = [
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6]
    ];
    return straights.some(straight => straight.every(num => dice.includes(num)));
}

function updateScoreboard() {
    for (let player = 1; player <= 2; player++) {
        for (let category in scores['player' + player]) {
            if (scores['player' + player][category] !== null) {
                document.getElementById(`p${player}-score-${category}`).textContent = scores['player' + player][category];
            }
        }
        document.getElementById(`p${player}-total-score`).textContent = Object.values(scores['player' + player]).reduce((a, b) => a + (b || 0), 0);
    }
}

function switchPlayer() {
    rollCount = 0;
    dice = [0, 0, 0, 0, 0];
    updateDice();
    const diceElements = document.querySelectorAll('.dice');
    diceElements.forEach(die => die.classList.remove('held'));

    if (Object.values(scores['player1']).every(score => score !== null) && Object.values(scores['player2']).every(score => score !== null)) {
        declareWinner();
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerTurn();
    }
}

function updatePlayerTurn() {
    document.getElementById('player-turn').textContent = `Player ${currentPlayer}'s turn`;
}

function declareWinner() {
    const player1Score = Object.values(scores.player1).reduce((a, b) => a + (b || 0), 0);
    const player2Score = Object.values(scores.player2).reduce((a, b) => a + (b || 0), 0);
    if (player1Score > player2Score) {
        alert(`Player 1 wins with ${player1Score} points!`);
    } else if (player2Score > player1Score) {
        alert(`Player 2 wins with ${player2Score} points!`);
    } else {
        alert(`It's a tie with ${player1Score} points each!`);
    }
}
