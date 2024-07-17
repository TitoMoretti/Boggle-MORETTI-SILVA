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
    isPaused = true;
    pauseButton.textContent = 'Pausar';
    document.getElementById('currentWord').textContent = '';
    changeColor();
    gameStarted = false;
    emptyBoard();
    emptyTable();
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
            contentModal('Fin del juego', 'Se acabó el tiempo. ¿Desea enviar su puntaje?');
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
                const scoreTable = document.getElementById('scoreTable');
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
        })
        .catch(error => { 
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
    closeBtn.style.display = 'none';
}
var okButton = document.querySelector('.okBtn');
okButton.addEventListener('click', function() {
    if (!document.getElementById('userId').value.trim() === '') { 
        var puntaje = document.getElementById('totalPoints').textContent;
        var nombre = document.getElementById('userId').value;
        localStorage.setItem(nombre, puntaje);  
        closeModal();
    } 
});
var noButton = document.querySelector('.noBtn');
noButton.addEventListener('click', function() {
    closeModal();
    localStorage.clear();
});
function closeModal(){
    var modal = document.querySelector('#modal');
    modal.style.display = 'none';
}