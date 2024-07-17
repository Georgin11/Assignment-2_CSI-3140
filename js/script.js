let dice = [0, 0, 0, 0, 0];
let rollCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-button');
    rollButton.addEventListener('click', rollDice);
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
