var orderAlpha = document.getElementById('orderAlpha');
var orderScore = document.getElementById('regularOrder');
var orderDate = document.getElementById('orderDate');
var ranking = document.querySelector('.ranking');

window.onload = function() {
    updateScores('orderScore');
};

//Actualiza la tabla de puntuación.
function updateScores (condition) {
    ranking.innerHTML = '<tr><th>Usuario</th><th>Puntaje</th><th>Fecha y Hora</th></tr>';
    var scores = JSON.parse(localStorage.getItem('scores')) || [];
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
        scores.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
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