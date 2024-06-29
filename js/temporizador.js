let countdown;
let timeLeft = 3 * 60; // 3 minutes in seconds
let isPaused = false;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const controlButtons = document.getElementById('controlButtons');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

startButton.addEventListener('click', function() {
    startButton.classList.add('hidden');
    controlButtons.classList.remove('hidden');
    startTimer();
});

pauseButton.addEventListener('click', function() {
    if (isPaused) {
        startTimer();
        pauseButton.textContent = 'Pausar';
    } else {
        clearInterval(countdown);
        pauseButton.textContent = 'Continuar';
    }
    isPaused = !isPaused;
});

resetButton.addEventListener('click', function() {
    clearInterval(countdown);
    timeLeft = 3 * 60;
    timerDisplay.textContent = '03:00';
    startButton.classList.remove('hidden');
    controlButtons.classList.add('hidden');
    isPaused = false;
    pauseButton.textContent = 'Pausar';
});

function startTimer() {
    countdown = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(countdown);
            timerDisplay.textContent = '00:00';
            alert('¡El tiempo ha terminado!');
        }
    }, 1000);
}