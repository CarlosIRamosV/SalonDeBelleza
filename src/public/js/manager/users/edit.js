import {getImageRoute, getToken, getUserRoute} from "../../api.config.js";
import previewImage from "../../lib/input/image.js";

window.addEventListener('load', ev => {
    let temp
    let urlParams = new URLSearchParams(window.location.search);
    let product = urlParams.get('id');
    if (product == null) {
        window.location.href = './';
    }

    let image = document.getElementById('imagen');
    let preview = document.getElementById('preview')
    let name = document.getElementById('nombre');
    let last_name = document.getElementById('apellido');
    let type = document.getElementById('type');
    let birth_date = document.getElementById('fechaNac');
    let sex = document.getElementById('sexo');
    let phone = document.getElementById('telefono');
    let email = document.getElementById('correo');

    previewImage(image, preview)

    document.getElementById('update').addEventListener('click', () => {
        let updates = {};

        if (name.value !== temp.name) {
            updates.name = name.value;
        }

        if (last_name.value !== temp.last_name) {
            updates.last_name = last_name.value;
        }

        if (type.value !== temp.type) {
            updates.type = type.value;
        }

        if (sex.value !== temp.sex) {
            updates.sex = sex.value
        }

        if (phone.value !== temp.phone) {
            updates.phone = phone.value
        }

        if (email.value !== temp.email) {
            updates.email = email.value
        }

        let fechaCita = new Date(birth_date.value);
        if (fechaCita.getTime().toString() !== temp.birth_date) {
            updates.birth_date = fechaCita.getTime().toString();
        }

        let new_image;

        if (image.files.length > 0) {
            new_image = image.files[0];
        }

        // Check if there is any change
        if (Object.keys(updates).length === 0 && new_image == null) {
            alert('No hay cambios')
            return;
        }

        console.log(updates)

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
                    body: JSON.stringify(image),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getToken()
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        updates.image_id = data.id;
                        update(product, updates);
                    })
                    .catch(error => console.error('Error al enviar datos:', error));
            }
        } else {
            update(product, updates);
        }

    });

    fetch(getUserRoute(product), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
        }
    )
        .then(response => response.json())
        .then(data => {
            name.value = data.name;
            if (data.image_id != null) {
                preview.src = getImageRoute(data.image_id)
            }
            last_name.value = data.last_name;
            type.value = data.type;
            let date = new Date();
            date.setTime(data.birth_date);
            birth_date.value = date.toISOString().split('T')[0];
            sex.value = data.sex;
            phone.value = data.phone;
            email.value = data.email;
            temp = data;
        })
        .catch(err => console.log(err));
    if (product == null) {
        window.location.href = './';
    }

});

function update(user, data) {
    console.log(data)
    fetch(getUserRoute(user), {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            alert('Datos actualizados');
            return window.location.href = './';
        })
        .catch(err => console.log(err));
}