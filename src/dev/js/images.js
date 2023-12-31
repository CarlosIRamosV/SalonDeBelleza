import {getImageRoute, getImagesRoute, getToken, removeToken} from "../../public/js/api.config.js";

window.addEventListener("load", function () {
    document.getElementById("file").onchange = function () {
        let imag = document.getElementById("file").files[0];
        let blob = new Blob([imag], {type: imag.type});
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            let image = {
                image: reader.result
            }
            fetch(getImagesRoute(), {
                method: 'POST',
                body: JSON.stringify(image),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    document.getElementById("uuid").innerText = data.id;
                    document.getElementById("hash").innerText = data.hash;
                    document.getElementById("url").innerText = getImageRoute(data.id);
                    document.getElementById("img").src = getImageRoute(data.id);
                })
                .catch(error => console.error('Error al enviar datos:', error));
        }
    }

    document.getElementById("remove_token").onclick = function () {
        removeToken();
    }
});