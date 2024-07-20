window.onload = function() {
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
};