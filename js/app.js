window.onload = function() {
    updateScores();
    resetGame();
    initializeTimeSelect();
};

function initializeTimeSelect() {
    const timeSelect = document.getElementById('timeSelect');
    timeSelect.addEventListener('change', function() {
        if (!gameStarted) {
            timeLeft = parseInt(this.value) * 60;
            updateTimerDisplay();
        }
    });
}
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


function updateScores () {
    var scoreTable = document.querySelector('.scoreTable');
    scoreTable.innerHTML = '<tr><th>Nombre de Usuario</th><th>Puntaje</th></tr>';
    var scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.sort(function(a, b) {
        return b.points - a.points;
    });
    scores.forEach(function(score) {
        var row = document.createElement('tr');
        var nameCell = document.createElement('td');
        var scoreCell = document.createElement('td');

        nameCell.textContent = score.userId;
        scoreCell.textContent = score.points;

        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        scoreTable.appendChild(row);
    });
}

let countdown;
let timeLeft = 3 * 60;
let isPaused = false;
let gameStarted = false;
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const controlButtons = document.getElementById('controlButtons');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

startButton.addEventListener('click', function() {
    startButton.classList.add('hidden');
    controlButtons.classList.remove('hidden');
    isPaused = false;
    startTimer();
    gameStarted = true;
    shuffleBoard();
    document.getElementById('currentWord').textContent = '';
    emptyTable();
    document.getElementById('timeSelect').disabled = true;
});

pauseButton.addEventListener('click', function() {
    if (isPaused) {
        startTimer();
        pauseButton.textContent = 'Pausar';
        const letters = document.getElementsByClassName('letter');
        for (let i = 0; i < letters.length; i++) {
            letters[i].style.color = 'white';
        }
    } else {
        const letters = document.getElementsByClassName('letter');
        for (let i = 0; i < letters.length; i++) {
            letters[i].style.backgroundColor = '#f36900';
            letters[i].style.color = letters[i].style.backgroundColor;
        }
        document.getElementById('currentWord').textContent = '';
        clearInterval(countdown);
        pauseButton.textContent = 'Continuar';
    }
    isPaused = !isPaused;
});
resetButton.addEventListener('click', resetGame);

function resetGame() {
    clearInterval(countdown);
    const selectedTime = parseInt(document.getElementById('timeSelect').value) * 60;
    timeLeft = selectedTime;
    updateTimerDisplay();
    startButton.classList.remove('hidden');
    controlButtons.classList.add('hidden');
    isPaused = true;
    pauseButton.textContent = 'Pausar';
    document.getElementById('currentWord').textContent = '';
    changeColor();
    gameStarted = false;
    emptyBoard();
    emptyTable();
    document.getElementById('timeSelect').disabled = false;
}
function startTimer() {
    countdown = setInterval(function() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdown);
            timerDisplay.textContent = '00:00';
            var totalPoints = document.getElementById('totalPoints').textContent;
            if(parseInt(totalPoints) > 0){
                contentModal('Fin del juego', 'Se acabó el tiempo y usted ha obtenido ' + totalPoints + '. ¿Desea enviar su puntaje?');
            }
            else{
                contentModal('Fin del juego', 'Se acabó el tiempo. No ha obtenido puntos suficientes para enviar su puntaje. Por favor, inténtelo de nuevo.');
            }
        }
    }, 1000);
}

var shuffleButton = document.getElementById('shuffle');
shuffleButton.addEventListener('click', shuffleBoard);
function shuffleBoard() {
    if(!isPaused && gameStarted){
        const dice = document.getElementById('dice');
        const letterDivs = dice.getElementsByClassName('letter');
        for (let i = 0; i < letterDivs.length; i++) {
            const letterDiv = letterDivs[i];
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const randomIndex = Math.floor(Math.random() * letters.length);
            const randomLetter = letters[randomIndex];
            letterDiv.textContent = randomLetter;
        }
        changeColor();
        document.getElementById('currentWord').textContent = '';
    }
}

function emptyBoard() {
    const dice = document.getElementById('dice');
    const letterDivs = dice.getElementsByClassName('letter');
    for (let i = 0; i < letterDivs.length; i++) {
        const letterDiv = letterDivs[i];
        letterDiv.textContent = '';
    }
}

function emptyTable() {
    const totalPoints = document.getElementById('totalPoints');
    totalPoints.textContent = '0';
    const scoreTable = document.getElementById('scoreTable');
    const rows = scoreTable.getElementsByTagName('tr');
    if(rows.length > 2){
        var lenght = rows.length;
        for (let i = 2; i < lenght; i++) {
            scoreTable.removeChild(rows[2]);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const letters = document.getElementsByClassName('letter');
    for (let i = 0; i < letters.length; i++) {
        letters[i].addEventListener('click', function() {            
            if(!isPaused) {
                if(this.style.backgroundColor === 'black'){
                    this.style.backgroundColor = '#f36900';
                    document.getElementById('currentWord').textContent = document.getElementById('currentWord').textContent.replace(this.textContent, '');
                }
                else {
                    this.style.backgroundColor = 'black';
                    document.getElementById('currentWord').textContent += this.textContent;
                }
            }          
        });
    }
});

function changeColor() {
    const letters = document.getElementsByClassName('letter');
    for (let i = 0; i < letters.length; i++) {
        letters[i].style.backgroundColor = '#f36900';
    }
}

var cancelWord = document.getElementById('cancel');
cancelWord.addEventListener('click', function() {
    document.getElementById('currentWord').textContent = '';
    changeColor();
});

var submitWord = document.getElementById('submit');
submitWord.addEventListener('click', function() {
    const currentWord = document.getElementById('currentWord').textContent;
    changeColor();
    if (currentWord.length >= 3) {        
        var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + currentWord;
        fetch(url)
        .then(response => {
            if(response.status === 404){
                document.getElementById('currentWord').textContent = '';
            }
            else{
                var scoreTable = document.getElementById('scoreTable');
                var rows = scoreTable.getElementsByTagName('tr');
                var repeated = false;
                for (let i = 2; i < rows.length; i++) {
                    if(rows[i].getElementsByTagName('td')[0].textContent === currentWord){
                        repeated = true;
                    }
                }
                if(repeated){
                    document.getElementById('currentWord').textContent = '';
                }
                else{
                    const currentWord = document.getElementById('currentWord').textContent;
                    const totalPoints = document.getElementById('totalPoints');
                    const newRow = document.createElement('tr');
                    const wordCell = document.createElement('td');
                    const scoreCell = document.createElement('td');
                    wordCell.textContent = currentWord;
                    scoreCell.textContent = calculateScore(currentWord);
                    totalPoints.textContent = parseInt(totalPoints.textContent) + parseInt(scoreCell.textContent);
                    newRow.appendChild(wordCell);
                    newRow.appendChild(scoreCell);
                    scoreTable.appendChild(newRow);
                    document.getElementById('currentWord').textContent = '';
                    function calculateScore(word) {
                        let length = word.length;
                        if (length === 3 || length === 4) {
                            return 1;
                        } else if (length === 5) {
                            return 2;
                        } else if (length === 6) {
                            return 3;
                        } else if (length === 7) {
                            return 5;
                        } else if (length >= 8) {
                            return 11;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        })
        .catch(() => { 
            document.getElementById('currentWord').textContent = '';
        });
    }
    else{
        document.getElementById('currentWord').textContent = '';
    }
});

function contentModal(título, mensaje){
    var modal = document.querySelector('#modal');
    modal.style.display = 'block';
    var modalTitle = document.querySelector('#modal h2');
    modalTitle.textContent = título;
    var modalMessage = document.querySelector('#modal p');
    modalMessage.textContent = mensaje;
    var modalOK = document.querySelector('.okBtn');
    var modalNo = document.querySelector('.noBtn');
    modalOK.style.display = 'block';
    modalNo.style.display = 'block';
}
var okButton = document.querySelector('.okBtn');
okButton.addEventListener('click', function() {
    const userId = document.getElementById('userId').value;
    const totalPoints = document.getElementById('totalPoints').textContent;
    if(parseInt(totalPoints) > 0){
        if (userId && totalPoints) {
            const scores = JSON.parse(localStorage.getItem('scores')) || [];
            const newScore = {
                userId: userId,
                points: totalPoints
            };
            scores.push(newScore);
            localStorage.setItem('scores', JSON.stringify(scores));
            updateScores();
        }
    }
    resetGame();
    closeModal();
});
var noButton = document.querySelector('.noBtn');
noButton.addEventListener('click', function() {
    closeModal();
    window.location.href = 'index.html';
});
function closeModal(){
    var modal = document.querySelector('#modal');
    modal.style.display = 'none';
}