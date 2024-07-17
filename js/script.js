let dice = [0, 0, 0, 0, 0];
let rollCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-button');
    const scoreButton = document.getElementById('score-button');
    rollButton.addEventListener('click', rollDice);
    scoreButton.addEventListener('click', scoreDice);
    updateDice();
});

function rollDice() {
    if (rollCount < 3) {
        for (let i = 0; i < dice.length; i++) {
            if (!document.getElementById(`die${i + 1}`).classList.contains('held')) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        rollCount++;
        updateDice();
    }
    if (rollCount === 3) {
        document.getElementById('score-button').disabled = false;
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

function scoreDice() {
    const categories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    categories.forEach(category => {
        const scoreElement = document.getElementById(`score-${category}`);
        if (scoreElement.textContent === '-') {
            const score = calculateScore(category);
            scoreElement.textContent = score;
        }
    });
    calculateTotalScore();
    rollCount = 0;
    document.getElementById('score-button').disabled = true;
    resetDice();
}

function calculateScore(category) {
    const categoryNumber = categories.indexOf(category) + 1;
    return dice.filter(die => die === categoryNumber).reduce((a, b) => a + b, 0);
}

function calculateTotalScore() {
    const scoreElements = document.querySelectorAll('#scoreboard td[id^="score-"]');
    let totalScore = 0;
    scoreElements.forEach(scoreElement => {
        if (scoreElement.textContent !== '-') {
            totalScore += parseInt(scoreElement.textContent);
        }
    });
    document.getElementById('total-score').textContent = totalScore;
}

function resetDice() {
    dice = [0, 0, 0, 0, 0];
    updateDice();
    const diceElements = document.querySelectorAll('.dice');
    diceElements.forEach(die => die.classList.remove('held'));
}
