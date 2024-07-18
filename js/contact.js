window.onload = function() {
    var userData = localStorage.getItem('userData');
    if (userData) {
        userData = JSON.parse(userData);
        nameInput.value = userData.name;
        emailInput.value = userData.email;
    }
    else{
        nameInput.value = '';
        emailInput.value = '';
    }
    messageInput.value = '';
};

var nameInput = document.getElementById('nameId');
nameInput.addEventListener('blur', checkName);
function checkName(){
    var name = nameInput.value;
    if(name === ''){
        errorMessage(nameInput, 'El campo del Nombre no puede estar vacio.')
        return false;
    }
    else{
        var regex = /^[a-zA-Z\s]{6,}$/;
        if (!regex.test(name)) {
            errorMessage(nameInput, 'El campo del Nombre debe tener al menos 6 caracteres sin números.')
            return false;
        }
        else{
            var space = name.indexOf(' ');
            if (space === -1){
                errorMessage(nameInput, 'El campo del Nombre debe tener al menos un espacio.')
                return false;
            }
            else{
                return true;
            }
        }
    }
}
nameInput.addEventListener('focus', function(event) {
    event.target.value = '';
    focusError(event.target);
});

var emailInput = document.getElementById('emailId');
emailInput.addEventListener('blur', checkEmail);
function checkEmail(){
    var email = emailInput.value;
    if(email === ''){
        errorMessage(emailInput, 'El campo del Email no puede estar vacio.')
        return false;
    }
    else{
        var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!regex.test(email)) {
            errorMessage(emailInput, 'El campo del Email no tiene un formato válido.')
            return false;
        }
        else{
            return true;
        } 
    }
}
emailInput.addEventListener('focus', function(event) {
    event.target.value = '';
    focusError(event.target);
});

var messageInput = document.getElementById('messageId');
messageInput.addEventListener('blur', checkMessage);
function checkMessage(){
    var message = messageInput.value;
    if(message === ''){
        errorMessage(messageInput, 'El campo del Mensaje no puede estar vacio.')
        return false;
    }
    else{
        return true;
    }
}
messageInput.addEventListener('focus', function(event) {
    focusError(event.target);
});

var submitButton = document.getElementById('submitId');
var success = false;
submitButton.addEventListener('click', function(event) {
    if(nameInput.value === '' || emailInput === '' || messageInput === ''){
        event.preventDefault();
        localStorage.removeItem('userData');
        contentModal('Error', 'Por favor complete todos los campos.');
    } else {
        if(!checkName()){
            event.preventDefault();
            errorValidación(nameInput);
        }
        else{
            if(!checkEmail()){
                event.preventDefault();
                errorValidación(emailInput);
            }
            else{
                if(!checkMessage()){
                    event.preventDefault();
                    errorValidación(messageInput);
                }
                else{
                    event.preventDefault();
                    success = true;
                    var userData = {
                        name: nameInput.value,
                        email: emailInput.value,
                    };
                    localStorage.setItem('userData', JSON.stringify(userData));
                    contentModal('Todo parece correcto!', 'Está a punto de enviar el siguiente mensaje: ' + messageInput.value + '. ¿Desea continuar?');
                }
            }
        }  
    }
});

function focusError(input){
    errorMessage(input, ' ');
}
function errorMessage (input, message){
    var errorElement = document.getElementById('error' + input.id);
    if (message){
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.display = 'block';
    } else {
        errorElement.style.display = 'none';
    }
}
function errorValidación(input){
    localStorage.removeItem('userData');
    var errorElement = document.getElementById('error' + input.id);
    var mensaje = errorElement.textContent + ' Por favor, verifique el campo correspondiente y vuelva a intentarlo.';
    contentModal('Error', mensaje);
}

function contentModal(título, mensaje){
    var modal = document.querySelector('#modal');
    modal.style.display = 'block';
    var modalTitle = document.querySelector('#modal h2');
    modalTitle.textContent = título;
    var modalMessage = document.querySelector('#modal p');
    modalMessage.textContent = mensaje;
    var modalOK = document.querySelector('.okBtn');
    var modalNo = document.querySelector('.noBtn');
    var closeBtn = document.querySelector('.closeBtn');
    if(!success){
        modalOK.style.display = 'none';
        modalNo.style.display = 'none';
        closeBtn.style.display = 'block';
    } else {
        modalOK.style.display = 'block';
        modalNo.style.display = 'block';
        closeBtn.style.display = 'none';
    }
}
var okButton = document.querySelector('.okBtn');
okButton.addEventListener('click', function() {
    var form = document.querySelector('form');
    form.action="mailto:bogglemorettisilva@gmail.com?SUBJECT=Consulta Boggle&body=" + messageInput.value + "&cc=" + emailInput.value + "";
    form.submit();    
    closeModal();
});
var noButton = document.querySelector('.noBtn');
noButton.addEventListener('click', function() {
    closeModal();
    localStorage.removeItem('userData');
});
var closeButton = document.querySelector('.closeBtn');
closeButton.addEventListener('click', function() {
    closeModal();
});
function closeModal(){
    var modal = document.querySelector('#modal');
    modal.style.display = 'none';
}