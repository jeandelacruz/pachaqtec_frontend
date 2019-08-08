//Variables
const inputName = document.getElementById('name'),
    inputEmail = document.getElementById('email'),
    inputMessage = document.getElementById('message');
btnSend = document.getElementById('send');
btnReset = document.getElementById('reset');
formMail = document.getElementById('enviar-mail');
boxError = document.getElementById('boxError');
boxErrorText = document.getElementById('boxErrorText');


//Listeners	

eventListener();

function eventListener() {
    document.addEventListener('DOMContentLoaded', inicioApp);

    //Campos formularios
    inputName.addEventListener('blur', validarCampos);
    inputEmail.addEventListener('blur', validarCampos);
    inputMessage.addEventListener('blur', validarCampos);

    //Envio Formulario
    btnSend.addEventListener('click', enviarFormulario);
    btnReset.addEventListener('click', resetFormulario);
}


//Funciones

function inicioApp() {
    btnSend.disabled = true;
    boxError.style.display = 'none';
}

function validarCampos() {
    if (inputEmail.value && inputMessage.value && inputMessage.value || checkEmail(inputEmail.value)) btnSend.disabled = false;
    validarLongitud(this);
}

function checkEmail(val) {
    if (!val.match(/\S+@\S+\.\S+/)) return false;
    if (val.indexOf(' ') != -1 || val.indexOf('..') != -1) return false;
    return true;
}

function enviarFormulario(e) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    boxError.style.display = 'none';

    axios.post('http://127.0.0.1:3000/v1/mail/send', jsonToFormEncoded({
        email: inputEmail.value,
        name: inputName.value,
        comment: inputMessage.value
    }))
        .then(result => {
            let success = result.data;
            let response = success.response;
            alert(response.systemMessage);
            resetFormulario();
            spinner.style.display = 'none';
        })
        .catch(e => {
            spinner.style.display = 'none';
            boxError.style.display = 'block';
            console.dir(e)
            let error = e.response.data;
            let response = error.response;
            let validateRequest = response.requestValidate;
            let errorMessage = response.systemMessage;
            let elementDiv = document.createElement('div')
            if (!validateRequest) {
                errorMessage.map(item => elementDiv.innerHTML += `<p>${item.msg}</p>`);
                return boxErrorText.appendChild(elementDiv);
            }
            elementDiv.innerHTML = `<p>${errorMessage}</p>`;
            return boxErrorText.appendChild(elementDiv);
        });

    e.preventDefault();
}

function resetFormulario(e) {
    inputMessage.value = '';
    inputName.value = '';
    inputEmail.value = '';
    btnSend.disabled = true;
    e.preventDefault();
}

function validarLongitud(campo) {
    if (campo.value.length > 0) {
        campo.style.borderBottomColor = 'green';
        campo.classList.remove('error');
    } else {
        campo.style.borderBottomColor = 'red';
        campo.classList.add('error');
    }
    boxError.style.display = 'none';
}

function jsonToFormEncoded(obj) {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}
