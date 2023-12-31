import {getImageRoute, getToken, getUserRoute} from "../../api.config.js";
import previewImage from "../../lib/input/image.js";

window.addEventListener("load", () => {
    let image = document.getElementById("file");
    let preview = document.getElementById('preview');
    // Preview de la imagen
    previewImage(image, preview);


    document.getElementById("crud-form").addEventListener('submit', (ev) => {
        ev.preventDefault();
        let name = document.getElementById("nombre").value.trim();
        let phone = document.getElementById("telefono").value.trim();
        let last_name = document.getElementById("apellido").value.trim();
        let birth_date = document.getElementById("fechaNac").value.trim();
        let sex = document.getElementById("sexo").value.trim();
        let email = document.getElementById("correo").value.trim();
        let password = document.getElementById("contraseña").value.trim();


        //VARIABLES PARA CONFIRMAR CONTRASE;A
        var confpass = document.getElementById("contraseña").value;
        var confpass2 = document.getElementById("cContraseña").value;

        //CONFIRMAR CONTRASEÑA
        if (confpass != confpass2) {
            alert('Las contraseñas no coinciden');
            return false;
        }

        let new_image;

        if (image.files.length > 0) {
            new_image = image.files[0];
        } else {
            new_image = null;
        }

        let date = new Date(birth_date);
        let empleado = {
            name: name,
            last_name: last_name,
            birth_date: date.getTime().toString(),
            sex: sex,
            phone: phone,
            email: email,
            password: password
        }

        if (new_image != null) {
            let blob = new Blob([new_image], {type: new_image.type});
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                let image = {
                    image: reader.result
                }
                fetch(getImageRoute(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getToken()
                    },
                    body: JSON.stringify(image)
                })
                    .then(response => response.json())
                    .then(data => {
                        empleado.image_id = data.id;
                        new_employee(empleado);
                    })
                    .catch(error => console.error('Error al enviar datos:', error));
            }
        } else {
            new_employee(empleado);
        }
    });
});

function new_employee(user) {
    console.log(user);
    fetch(getUserRoute(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(user)
    }).then(response => response.json())
        .then(() => {
            alert("Usuario creado exitosamente");
            window.location.href = "./";
        });
}