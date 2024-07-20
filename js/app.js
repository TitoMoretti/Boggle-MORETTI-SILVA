var countdown;
var timeLeft = 3 * 60;
var isPaused = false;
var gameStarted = false;
var timerDisplay = document.getElementById('timer');
var startButton = document.getElementById('startButton');
var controlButtons = document.getElementById('controlButtons');
var pauseButton = document.getElementById('pauseButton');
var resetButton = document.getElementById('resetButton');
var currentWord = document.getElementById('currentWord');
var totalPoints = document.getElementById('totalPoints');
var shuffleButton = document.getElementById('shuffle');
var dice = document.getElementById('dice');
var letterDivs = dice.getElementsByClassName('letter');
var scoreTable = document.getElementById('scoreTable');
var rows = scoreTable.getElementsByTagName('tr');
var cancelWord = document.getElementById('cancel');
var submitWord = document.getElementById('submit');
var modal = document.querySelector('#modal');
var modalTitle = document.querySelector('#modal h2');
var modalMessage = document.querySelector('#modal p');
var modalOK = document.querySelector('.okBtn');
var modalNo = document.querySelector('.noBtn');
var userId = document.getElementById('userId');

//Prepara el juego para ser jugado.
window.onload = function() {
    updateScores();
    resetGame();
};

//Actualiza la tabla de puntuación.
function updateScores () {
    var scoreTable = document.querySelector('.scoreTable');
    scoreTable.innerHTML = '<tr><th>Usuario</th><th>Puntaje</th></tr>';
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

//Inicio del juego.
startButton.addEventListener('click', function() {
    startButton.classList.add('hidden');
    controlButtons.classList.remove('hidden');
    isPaused = false;
    startTimer();
    gameStarted = true;
    shuffleBoard();
    emptyTable();
});

//Inicio del temporizador.
function startTimer() {
    countdown = setInterval(() => {
        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdown);
            timerDisplay.textContent = '00:00';
            if(parseInt(totalPoints.textContent) > 0){
                contentModal('Fin del juego', 'Se acabó el tiempo y usted ha obtenido "' + totalPoints.textContent + '" puntos!!! ¿Desea enviar su puntaje?');
            }
            else{
                contentModal('Fin del juego', 'Se acabó el tiempo. No ha obtenido puntos suficientes para enviar su puntaje. Por favor, inténtelo de nuevo.');
            }
        }
    }, 1000);
}

//Baraja las letras.
shuffleButton.addEventListener('click', shuffleBoard);
function shuffleBoard() {
    if(!isPaused && gameStarted){
        for (var i = 0; i < letterDivs.length; i++) {
            var letterDiv = letterDivs[i];
            var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var randomIndex = Math.floor(Math.random() * letters.length);
            var randomLetter = letters[randomIndex];
            letterDiv.textContent = randomLetter;
        }
        changeColor();
        currentWord.textContent = '';
    }
}

//Limpia la tabla del usuario.
function emptyTable() {
    totalPoints.textContent = '0';
    if(rows.length > 2){
        var lenght = rows.length;
        for (var i = 2; i < lenght; i++) {
            scoreTable.removeChild(rows[2]);
        }
    }
}

//Pausa el juego.
pauseButton.addEventListener('click', function() {
    if (isPaused) {
        startTimer();
        pauseButton.textContent = 'Pausar';
        for (var i = 0; i < letterDivs.length; i++) {
            letterDivs[i].style.color = 'white';
        }
    } else {
        for (var i = 0; i < letterDivs.length; i++) {
            letterDivs[i].style.backgroundColor = '#f36900';
            letterDivs[i].style.color = letterDivs[i].style.backgroundColor;
        }
        currentWord.textContent = '';
        clearInterval(countdown);
        pauseButton.textContent = 'Continuar';
    }
    isPaused = !isPaused;
});

//Reinicia el juego.
resetButton.addEventListener('click', resetGame);
function resetGame() {
    clearInterval(countdown);
    timeLeft = 3 * 60;
    timerDisplay.textContent = '03:00';
    startButton.classList.remove('hidden');
    controlButtons.classList.add('hidden');
    isPaused = true;
    pauseButton.textContent = 'Pausar';
    currentWord.textContent = '';
    changeColor();
    gameStarted = false;
    emptyBoard();
    emptyTable();
}

//Cambia el color de fondo de las letras.
function changeColor() {
    for (var i = 0; i < letterDivs.length; i++) {
        letterDivs[i].style.backgroundColor = '#f36900';
    }
}

//Limpia el tablero de letras.
function emptyBoard() {
    for (var i = 0; i < letterDivs.length; i++) {
        var letterDiv = letterDivs[i];
        letterDiv.textContent = '';
    }
}

//Agregar o quitar letras de la palabra actual.
document.addEventListener('DOMContentLoaded', function() {
    for (var i = 0; i < letterDivs.length; i++) {
        letterDivs[i].addEventListener('click', function() {            
            if(!isPaused) {
                if(this.style.backgroundColor === 'black'){
                    this.style.backgroundColor = '#f36900';
                    currentWord.textContent = currentWord.textContent.replace(this.textContent, '');
                }
                else {
                    this.style.backgroundColor = 'black';
                    currentWord.textContent += this.textContent;
                }
            }          
        });
    }
});

//Borrar la palabra actual.
cancelWord.addEventListener('click', function() {
    currentWord.textContent = '';
    changeColor();
});

//Enviar la palabra actual y verificar la misma.
submitWord.addEventListener('click', function() {
    changeColor();
    if (currentWord.textContent.length >= 3) {        
        var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + currentWord.textContent;
        fetch(url)
        .then(response => {
            if(response.status === 404){
                currentWord.textContent = '';
            }
            else{
                var repeated = false;
                for (var i = 2; i < rows.length; i++) {
                    if(rows[i].getElementsByTagName('td')[0].textContent === currentWord.textContent){
                        repeated = true;
                    }
                }
                if(repeated){
                    currentWord.textContent = '';
                }
                else{
                    var newRow = document.createElement('tr');
                    var wordCell = document.createElement('td');
                    var scoreCell = document.createElement('td');
                    wordCell.textContent = currentWord.textContent;
                    scoreCell.textContent = calculateScore(currentWord.textContent);
                    totalPoints.textContent = parseInt(totalPoints.textContent) + parseInt(scoreCell.textContent);
                    newRow.appendChild(wordCell);
                    newRow.appendChild(scoreCell);
                    scoreTable.appendChild(newRow);
                    currentWord.textContent = '';
                }
            }
        })
        .catch(() => { 
            currentWord.textContent = '';
        });
    }
    else{
        currentWord.textContent = '';
    }
});

//Calcula la puntuación de la palabra.
function calculateScore(word) {
    var length = word.length;
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

//Muestra el modal.
function contentModal(título, mensaje){
    modal.style.display = 'block';
    modalTitle.textContent = título;
    modalMessage.textContent = mensaje;
    modalOK.style.display = 'block';
    modalNo.style.display = 'block';
}

//Envía el puntaje del usuario.
modalOK.addEventListener('click', function() {
    if(parseInt(totalPoints.textContent) > 0){
        if (userId.value && totalPoints.textContent) {
            var scores = JSON.parse(localStorage.getItem('scores')) || [];
            var newScore = {
                userId: userId.value,
                points: totalPoints.textContent
            };
            scores.push(newScore);
            localStorage.setItem('scores', JSON.stringify(scores));
            updateScores();
        }
    }
    resetGame();
    closeModal();
});

//Cierra el modal.
function closeModal(){
    modal.style.display = 'none';
}

//No envía el puntaje del usuario.
modalNo.addEventListener('click', function() {
    closeModal();
    window.location.href = 'index.html';
});