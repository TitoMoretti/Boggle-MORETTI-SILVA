var nameInput = document.getElementById('nameId');
var emailInput = document.getElementById('emailId');
var messageInput = document.getElementById('messageId');
var submitButton = document.getElementById('submitId');
var modal = document.querySelector('#modal');
var modalTitle = document.querySelector('#modal h2');
var modalMessage = document.querySelector('#modal p');
var modalOK = document.querySelector('.okBtn');
var modalNo = document.querySelector('.noBtn');
var closeBtn = document.querySelector('.closeBtn');
var form = document.querySelector('form');

//Llena los campos del formulario con los datos guardados en el localStorage.
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

//Validación del Nombre.
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

//Limpia el campo de Nombre.
nameInput.addEventListener('focus', function(event) {
    event.target.value = '';
    focusError(event.target);
});

//Validación del Email.
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

//Limpia el campo de Email.
emailInput.addEventListener('focus', function(event) {
    event.target.value = '';
    focusError(event.target);
});

//Validación del Mensaje.
messageInput.addEventListener('blur', checkMessage);
function checkMessage(){
    var message = messageInput.value;
    if(message === ''){
        errorMessage(messageInput, 'El campo del Mensaje no puede estar vacio.')
        return false;
    }
    else{
        var regex = /^[a-zA-Z0-9\s]{5,}$/;
        if (!regex.test(message)) {
            errorMessage(messageInput, 'El campo del Mensaje debe tener al menos 5 caracteres.')
            return false;
        }
        else{
            return true;
        }
    }
}

//Limpia el campo de Mensaje.
messageInput.addEventListener('focus', function(event) {
    focusError(event.target);
});

//Validación del Formulario.
var success = false;
submitButton.addEventListener('click', function(event) {
    if(nameInput.value === '' || emailInput === '' || messageInput === ''){
        event.preventDefault();
        success = false;
        localStorage.removeItem('userData');
        contentModal('Error', 'Por favor complete todos los campos.');
    } else {
        if(!checkName()){
            event.preventDefault();
            success = false;
            errorValidación(nameInput);
        }
        else{
            if(!checkEmail()){
                event.preventDefault();
                success = false;
                errorValidación(emailInput);
            }
            else{
                if(!checkMessage()){
                    event.preventDefault();
                    success = false;
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
                    contentModal('Todo parece correcto!', 'Está a punto de enviar el siguiente mensaje: "' + messageInput.value + '". ¿Desea continuar "' + nameInput.value + '"?');
                }
            }
        }  
    }
});

//Limpia el campo de error.
function focusError(input){
    errorMessage(input, ' ');
}

//Muestra el mensaje de error.
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

//Muestra el mensaje de error en el modal.
function errorValidación(input){
    localStorage.removeItem('userData');
    var errorElement = document.getElementById('error' + input.id);
    var mensaje = errorElement.textContent + ' Por favor, verifique el campo correspondiente y vuelva a intentarlo.';
    contentModal('Error', mensaje);
}

//Muestra el modal.
function contentModal(título, mensaje){
    modal.style.display = 'block';
    modalTitle.textContent = título;
    modalMessage.textContent = mensaje;
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

//Envía el mensaje.
modalOK.addEventListener('click', function() {
    form.method="post";
    form.action="mailto:bogglemorettisilva@gmail.com?SUBJECT=Consulta Boggle&body=" + messageInput.value + "&cc=" + emailInput.value + "";
    form.submit();    
    closeModal();
    messageInput.value = '';
});

//Cancela el envío del mensaje.
modalNo.addEventListener('click', function() {
    closeModal();
    localStorage.removeItem('userData');
});

//Cierra el modal.
closeBtn.addEventListener('click', closeModal);

function closeModal(){
    modal.style.display = 'none';
}