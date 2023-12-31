import {getUserRoute} from "../api.config.js";

window.addEventListener("load", () => {
    document.getElementById("cuenta").addEventListener("submit", () => {
        event.preventDefault();

        //VARIABLES PARA EL JSON
        var name = document.getElementById("nombre").value.trim();
        var last_name = document.getElementById("apellidos").value.trim();
        var birth_date = document.getElementById("nacimiento").value.trim();
        var masc = document.getElementById("masculino").value.trim();
        var fem = document.getElementById("femenino").value.trim();
        var phone = document.getElementById("telefono").value.trim();
        var email = document.getElementById("correo").value.trim();
        var password = document.getElementById("contraseña").value.trim();

        //SELECCIONAR SEXO
        var sex
        if (masc === "on") {
            sex = "Male";
        } else if (fem === "on") {
            sex = "Female";
        } else {
            sex = "Other";
        }

        //VARIABLES PARA CONFIRMAR CONTRASE;A
        var confpass = document.getElementById("contraseña").value;
        var confpass2 = document.getElementById("cContraseña").value;

        //CONFIRMAR CONTRASEÑA
        if (confpass !== confpass2) {
            alert('Las contraseñas no coinciden');
            return false;
        }

        //MODELO JSON PARA ENVIAR

        let date = new Date(birth_date);
        let user = {
            name: name,
            last_name: last_name,
            birth_date: date.getTime().toString(),
            sex: sex,
            phone: phone,
            email: email,
            password: password
        }

        //ENVIAR CUENTA
        fetch(getUserRoute(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(() => {
                window.location.href = "./in.html";
            })
    });
});