'use strict';

var countdown;
var timeLeft = 3 * 60;
var isPaused = false;
var gameStarted = false;

var timerSelect = document.getElementById('timerSelect');
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
var orderAlpha = document.getElementById('orderAlpha');
var orderScore = document.getElementById('regularOrder');
var orderDate = document.getElementById('orderDate');
var scoreMessage = document.getElementById('scoreMessage');
var scoreTable = document.getElementById('scoreTable');
var rows = scoreTable.getElementsByTagName('tr');
var cancelWord = document.getElementById('cancel');
var submitWord = document.getElementById('submit');
var ranking = document.querySelector('.ranking');
var modal = document.querySelector('#modal');
var modalTitle = document.querySelector('#modal h2');
var modalMessage = document.querySelector('#modal p');
var userLabel = document.querySelector('#modal label')
var userId = document.getElementById('userId');
var modalWarning = document.getElementById('modalWarning');
var closeBtn = document.querySelector('.closeBtn');
var modalOK = document.querySelector('.okBtn');
var modalNo = document.querySelector('.noBtn');
var userId = document.getElementById('userId');
var messageSign = document.getElementById('messageSign');

//Prepara el juego para ser jugado.
window.onload = function() {
    updateScores('orderScore');
    resetGame();
    allowButtons(false);
};

//Actualiza el temporizador basado en la selección del usuario.
timerSelect.addEventListener('change', function() {
    if (!gameStarted) {
        timeLeft = parseInt(timerSelect.value) * 60;
        timerDisplay.textContent = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;
    }
});

//Actualiza la tabla de puntuación.
function updateScores (condition) {
    var scores = JSON.parse(localStorage.getItem('scores')) || [];
    ranking.innerHTML = '<tr><th>Usuario</th><th>Puntaje</th><th>Fecha y Hora</th></tr>';
    if(condition === 'orderAlpha'){
        scores.sort(function(a, b) {
            return a.userId.localeCompare(b.userId);
        });
    }
    if(condition === 'orderScore'){
        scores.sort(function(a, b) {
            return b.points - a.points;
        });
    }
    if(condition === 'orderDate'){
        scores.sort(({date: a}, {date: b}) => a < b ? -1 : a > b ? 1 : 0);
    }
    scores.forEach(function(score) {
        var row = document.createElement('tr');
        var nameCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        var dateCell = document.createElement('td');
        nameCell.textContent = score.userId;
        scoreCell.textContent = score.points;
        dateCell.textContent = score.date;
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        row.appendChild(dateCell);
        ranking.appendChild(row);
    });
}

//Ordena la tabla de puntuación.
orderAlpha.addEventListener('click', function() {
    updateScores('orderAlpha');
});
orderScore.addEventListener('click', function() {
    updateScores('orderScore');
});
orderDate.addEventListener('click', function() {
    updateScores('orderDate');
});

//Inicio del juego.
startButton.addEventListener('click', function() {
    scoreMessage.style.display = 'none';
    startButton.classList.add('hidden');
    controlButtons.classList.remove('hidden');
    isPaused = false;
    cleanMessageSign();
    startTimer();
    gameStarted = true;
    shuffleBoard();
    allowButtons(true);
    emptyTable();
    timerSelect.disabled = true;
});

//Inicio del temporizador.
function startTimer() {
    countdown = setInterval(() => {
        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;        
        if (timeLeft <= 10) {
            timerDisplay.style.color = 'red';
            timerDisplay.style.fontWeight = 'bold';
        } else {
            timerDisplay.style.color = '';
            timerDisplay.style.fontWeight = '';
        }
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdown);
            timerDisplay.textContent = '00:00';
            if(parseInt(totalPoints.textContent) > 0){
                contentModal('Fin del juego', 'Se acabó el tiempo y usted ha obtenido "' + totalPoints.textContent + '" puntos!!! Si desea enviar su puntaje, por favor, ingrese su nombre de usuario y haga clic en "Si". De lo contrario, haga clic en "No". Gracias por jugar!!!');
            }
            else{
                contentModal('Fin del juego', 'Se acabó el tiempo. No ha obtenido ningún punto. Por favor, inténtelo de nuevo.');
            }
        }
    }, 1000);
}

//Baraja las letras.
shuffleButton.addEventListener('click', shuffleBoard);
function shuffleBoard() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(!isPaused && gameStarted){
        for (var i = 0; i < letterDivs.length; i++) {
            var letterDiv = letterDivs[i];
            var randomIndex = Math.floor(Math.random() * letters.length);
            var randomLetter = letters[randomIndex];
            letterDiv.textContent = randomLetter;
            letterDiv.style.color = 'white';
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

//Habilita o deshabilita los botones del juego.
function allowButtons(allowed) {
    if(allowed){
        shuffleButton.disabled = false;
        cancelWord.disabled = false; 
        submitWord.disabled = false;
    } else {
        shuffleButton.disabled = true;
        cancelWord.disabled = true; 
        submitWord.disabled = true;
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
        allowButtons(true);
    } else {
        for (var i = 0; i < letterDivs.length; i++) {
            letterDivs[i].style.backgroundColor = '#f36900';
            letterDivs[i].style.color = letterDivs[i].style.backgroundColor;
        }
        currentWord.textContent = '';
        clearInterval(countdown);
        pauseButton.textContent = 'Continuar';
        allowButtons(false);
    }
    isPaused = !isPaused;
});

//Reinicia el juego.
resetButton.addEventListener('click', resetGame);
function resetGame() {
    clearInterval(countdown);
    timeLeft = parseInt(timerSelect.value) * 60;
    timerDisplay.textContent = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;
    startButton.classList.remove('hidden');
    controlButtons.classList.add('hidden');
    isPaused = true;
    pauseButton.textContent = 'Pausar';
    currentWord.textContent = '';
    timerDisplay.style.color = '';
    timerDisplay.style.fontWeight = '';
    cleanMessageSign();
    changeColor();
    gameStarted = false;
    emptyBoard();
    allowButtons(false);
    emptyTable();
    timerSelect.disabled = false;
}

//Cambia el color de fondo de las letras.
function changeColor() {
    for (var i = 0; i < letterDivs.length; i++) {
        letterDivs[i].style.backgroundColor = '#f36900';
        letterDivs[i].style.fontWeight = 'normal';
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
    var originalColor;
    for (var i = 0; i < letterDivs.length; i++) {
        letterDivs[i].addEventListener('click', function() {            
            if(!isPaused) {
                if(this.style.backgroundColor === 'black'){
                    changeColor();
                    this.style.backgroundColor = '#f36900';
                    currentWord.textContent = '';
                    cleanMessageSign();
                }
                else {
                    cleanMessageSign();
                    if (currentWord.textContent === '') {
                        changeColor();
                        this.style.backgroundColor = 'black';
                        currentWord.textContent += this.textContent;
                        this.style.fontWeight = 'bold';
                        highlightWords(this);
                    } else {
                        for (var i = 0; i < letterDivs.length; i++) {
                            letterDivs[i].style.fontWeight = 'normal';
                        }
                        if (checkLastWord(this, originalColor)) {                            
                            this.style.backgroundColor = 'black';
                            currentWord.textContent += this.textContent;
                            this.style.fontWeight = 'bold';
                            highlightWords(this);
                        }
                        else {
                            Message(false, 'La letra seleccionada no es válida.');
                            this.style.backgroundColor = '#f36900';
                            originalColor = this.style.backgroundColor;
                        }  
                    }
                }
                originalColor = this.style.backgroundColor;
            }          
        });
        letterDivs[i].addEventListener('mouseover', function() {
            if(!isPaused){
                if(this.style.backgroundColor !== 'black'){
                    originalColor = this.style.backgroundColor;
                    this.style.backgroundColor = 'grey';
                }
            }
        });
        letterDivs[i].addEventListener('mouseout', function() {
            if(!isPaused){
                if(this.style.backgroundColor !== 'black'){
                    this.style.backgroundColor = originalColor;
                }
                originalColor = '';
            }
        });
    }
});

//Revisa la última letra seleccionada para ver si es válida.
function checkLastWord(clickedLetter, originalColor) {
    var clickedIndex = Array.from(letterDivs).indexOf(clickedLetter);
    var rows = Math.sqrt(letterDivs.length);
    var cols = rows;
    var close = false;
    if (clickedIndex >= cols) {
        var topIndex = clickedIndex - cols;
        if (letterDivs[topIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    if (clickedIndex < (rows - 1) * cols) {
        var bottomIndex = clickedIndex + cols;
        if (letterDivs[bottomIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    if (clickedIndex % cols !== 0) {
        var leftIndex = clickedIndex - 1;
        if (letterDivs[leftIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    if ((clickedIndex + 1) % cols !== 0) {
        var rightIndex = clickedIndex + 1;
        if (letterDivs[rightIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    if (clickedIndex >= cols && clickedIndex % cols !== 0) {
        var topLeftIndex = clickedIndex - cols - 1;
        if (letterDivs[topLeftIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    if (clickedIndex >= cols && (clickedIndex + 1) % cols !== 0) {
        var topRightIndex = clickedIndex - cols + 1;
        if (letterDivs[topRightIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    if (clickedIndex < (rows - 1) * cols && clickedIndex % cols !== 0) {
        var bottomLeftIndex = clickedIndex + cols - 1;
        if (letterDivs[bottomLeftIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    if (clickedIndex < (rows - 1) * cols && (clickedIndex + 1) % cols !== 0) {
        var bottomRightIndex = clickedIndex + cols + 1;
        if (letterDivs[bottomRightIndex].style.backgroundColor === 'black' && originalColor === 'red') {
            close = true;
        }
    }
    return close;
}

//Resalta las letras adyacentes a la letra seleccionada.
function highlightWords(clickedLetter) {
    var clickedIndex = Array.from(letterDivs).indexOf(clickedLetter);
    var rows = Math.sqrt(letterDivs.length);
    var cols = rows;
    for (var i = 0; i < letterDivs.length; i++) {
        if (letterDivs[i].style.backgroundColor === 'black') {
            letterDivs[i].style.backgroundColor = 'black';
        } else {
            letterDivs[i].style.backgroundColor = '#f36900';
        }
    }
    if (clickedIndex >= cols) {
        var topIndex = clickedIndex - cols;
        if(letterDivs[topIndex].style.backgroundColor !== 'black'){
            letterDivs[topIndex].style.backgroundColor = 'red';
        }
    }
    if (clickedIndex < (rows - 1) * cols) {
        var bottomIndex = clickedIndex + cols;
        if(letterDivs[bottomIndex].style.backgroundColor !== 'black'){
            letterDivs[bottomIndex].style.backgroundColor = 'red';
        }
    }
    if (clickedIndex % cols !== 0) {
        var leftIndex = clickedIndex - 1;
        if(letterDivs[leftIndex].style.backgroundColor !== 'black'){
            letterDivs[leftIndex].style.backgroundColor = 'red';
        }
    }
    if ((clickedIndex + 1) % cols !== 0) {
        var rightIndex = clickedIndex + 1;
        if(letterDivs[rightIndex].style.backgroundColor !== 'black'){
            letterDivs[rightIndex].style.backgroundColor = 'red';
        }
    }
    if (clickedIndex >= cols && clickedIndex % cols !== 0) {
        var topLeftIndex = clickedIndex - cols - 1;
        if(letterDivs[topLeftIndex].style.backgroundColor !== 'black'){
            letterDivs[topLeftIndex].style.backgroundColor = 'red';
        }
    }
    if (clickedIndex >= cols && (clickedIndex + 1) % cols !== 0) {
        var topRightIndex = clickedIndex - cols + 1;
        if(letterDivs[topRightIndex].style.backgroundColor !== 'black'){
            letterDivs[topRightIndex].style.backgroundColor = 'red';
        }
    }
    if (clickedIndex < (rows - 1) * cols && clickedIndex % cols !== 0) {
        var bottomLeftIndex = clickedIndex + cols - 1;
        if(letterDivs[bottomLeftIndex].style.backgroundColor !== 'black'){
            letterDivs[bottomLeftIndex].style.backgroundColor = 'red';
        }
    }
    if (clickedIndex < (rows - 1) * cols && (clickedIndex + 1) % cols !== 0) {
        var bottomRightIndex = clickedIndex + cols + 1;
        if(letterDivs[bottomRightIndex].style.backgroundColor !== 'black'){
            letterDivs[bottomRightIndex].style.backgroundColor = 'red';
        }
    }
}

//Borra la palabra actual.
cancelWord.addEventListener('click', function() {
    currentWord.textContent = '';
    changeColor();
});

//Envia la palabra actual y verifica la misma.
submitWord.addEventListener('click', function() {
    if (currentWord.textContent !== '') {
        if (currentWord.textContent.length >= 3) {        
            var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + currentWord.textContent;
            fetch(url)
            .then(response => {
                if(response.status === 404){
                    Message(false, 'La palabra no es una palabra válida.');
                    substrackPoint();
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
                        Message(false, 'La palabra ya ha sido insertada.');
                        substrackPoint();
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
                        for (var i = 2; i < rows.length; i++) {
                            rows[i].getElementsByTagName('td')[0].style.fontWeight = 'normal';
                        }
                        wordCell.style.fontWeight = 'bold';
                        Message(true, 'La palabra es válida. Sigue así!!!');
                        currentWord.textContent = '';
                    }
                }
            })
            .catch(() => { 
                Message(false, 'La palabra no es una palabra válida.');
                substrackPoint();
                currentWord.textContent = '';
            });
        }
        else{
            Message(false, 'La palabra debe tener al menos 3 letras.');
            substrackPoint();
            currentWord.textContent = '';
        }
    } else {
        Message(false, 'Por favor, ingrese una palabra.');
        substrackPoint();
        currentWord.textContent = '';
    }
    changeColor();
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

//Resta un punto al usuario.
function substrackPoint(){
    if(parseInt(totalPoints.textContent) === 0){
        shuffleBoard();
    } else {
        totalPoints.textContent = parseInt(totalPoints.textContent) - 1;
        var lastRow = rows[rows.length - 1];
        lastRow.getElementsByTagName('td')[1].textContent = parseInt(lastRow.getElementsByTagName('td')[1].textContent) - 1;
        if(parseInt(lastRow.getElementsByTagName('td')[1].textContent) === 0){
            scoreTable.removeChild(lastRow);
            shuffleBoard();
        }
    }
}

//Limpia el campo de error.
function cleanMessageSign(){
    messageSign.textContent = ' ';
}

//Muestra el mensaje de error.
function Message (valido, message){
    messageSign.textContent = message;
    if (!valido){
        messageSign.style.color = 'red';
    } else {
        messageSign.style.color = 'green';
    }
    messageSign.style.display = 'block';
}

//Muestra el modal.
function contentModal(título, mensaje){
    modal.style.display = 'block';
    modalTitle.textContent = título;
    modalMessage.textContent = mensaje;
    modalWarning.style.display = 'none';
    if(parseInt(totalPoints.textContent) > 0){
        userLabel.style.display = 'block';
        userId.style.display = 'block';
        userId.value = '';
        modalOK.style.display = 'block';
        modalNo.style.display = 'block';
        closeBtn.style.display = 'none';
    } else {
        userId.style.display = 'none';
        modalOK.style.display = 'none';
        modalNo.style.display = 'none';
        closeBtn.style.display = 'block';
        userLabel.style.display = 'none';
    }
}

//Verifica el campo de usuario.
userId.addEventListener('focus', function() {
    modalWarning.style.display = 'none';
});

//Envía el puntaje del usuario.
modalOK.addEventListener('click', function() {
    if (userId.value) {
        if (totalPoints.textContent) {
            scoreMessage.style.color = 'green';
            var scores = JSON.parse(localStorage.getItem('scores')) || [];
            var existingScore = scores.find(function(score) {
                return score.userId.toLowerCase() === userId.value.toLowerCase();                
            });
            if (existingScore) {
                if (parseInt(totalPoints.textContent) > parseInt(existingScore.points)) {
                    existingScore.userId = userId.value;
                    existingScore.points = totalPoints.textContent;
                    existingScore.date = new Date().toLocaleString();
                    scoreMessage.textContent = 'Ha mejorado su puntaje. Felicidades ' + existingScore.userId + '!!!';
                } else {
                    scoreMessage.style.color = 'red';
                    scoreMessage.textContent = 'No ha mejorado su puntaje. Siga intentándolo ' + existingScore.userId + '!!!';
                }
            } else {
                var newScore = {
                    userId: userId.value,
                    points: totalPoints.textContent,
                    date: new Date().toLocaleString()
                };
                scores.push(newScore);
                scoreMessage.textContent = 'Se ha registrado su puntaje!!!';
            }
            localStorage.setItem('scores', JSON.stringify(scores));
            updateScores('orderScore');
            scoreMessage.style.display = 'block';
        }
        closeModal();
    } else {
        modalWarning.textContent = 'Por favor, ingrese su nombre de usuario.';
        modalWarning.style.color = 'red';
        modalWarning.style.display = 'block';
    }
});

//Cierra el modal.
closeBtn.addEventListener('click', closeModal);

//Cierra el modal.
function closeModal(){
    resetGame();
    modal.style.display = 'none';
}

//No envía el puntaje del usuario.
modalNo.addEventListener('click', function() {
    closeModal();
    window.location.href = 'index.html';
});