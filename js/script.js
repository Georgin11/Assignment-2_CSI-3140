let dice = [0, 0, 0, 0, 0];
let rollCount = 0;
const maxRolls = 3;
let scores = {
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
};

document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-button');
    const scoreButton = document.getElementById('score-button');
    rollButton.addEventListener('click', rollDice);
    scoreButton.addEventListener('click', () => showScoringOptions());
    updateDice();
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
    }
    if (rollCount === maxRolls) {
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

function showScoringOptions() {
    const categories = Object.keys(scores);
    const availableCategories = categories.filter(cat => scores[cat] === null);

    const scoreOptions = availableCategories.map(cat => {
        return {
            category: cat,
            score: calculateScore(cat)
        };
    });

    let choice = prompt("Choose a category to score:\n" + scoreOptions.map(opt => `${opt.category}: ${opt.score}`).join('\n'));
    
    if (choice && availableCategories.includes(choice)) {
        scores[choice] = calculateScore(choice);
        updateScoreboard();
        resetTurn();
    } else {
        alert("Invalid choice. Please choose an available category.");
    }
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
    for (let category in scores) {
        if (scores[category] !== null) {
            document.getElementById(`score-${category}`).textContent = scores[category];
        }
    }
    document.getElementById('total-score').textContent = Object.values(scores).reduce((a, b) => a + (b || 0), 0);
}

function resetTurn() {
    rollCount = 0;
    dice = [0, 0, 0, 0, 0];
    updateDice();
    const diceElements = document.querySelectorAll('.dice');
    diceElements.forEach(die => die.classList.remove('held'));
    document.getElementById('score-button').disabled = true;
}
