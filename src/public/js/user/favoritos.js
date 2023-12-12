import {getFavoriteRoute, getProductRoute, getToken} from "../api.config.js";

function addFavorito(id) {
    if (document.getElementById(id).firstChild.src.match("favrell")) {
        fetch(getFavoriteRoute(id), {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            }
        })
            .then(response => response.json())
            .then(() => {
                document.getElementById(id).firstChild.src = "../../public/images/fav.png";
            })
            .catch(error => console.log(error));
    } else {
        fetch(getFavoriteRoute(), {
            method: "POST",
            body: JSON.stringify({
                "product_id": id
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            }
        })
            .then(response => response.json())
            .then(() => {
                document.getElementById(id).firstChild.src = "../../public/images/favrell.png";
            })
            .catch(error => console.log(error));

    }

}

window.addEventListener("load", () => {

    let favorites;

    if (getToken() !== null) {
        favorites = "favorites";
    }

    fetch(getProductRoute(favorites), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                let div = document.createElement("div");
                div.className = "producto";
                div.id = element.id;
                let img = document.createElement("img");
                if (element.favorite)
                    img.src = "../../public/images/favrell.png";
                else
                    img.src = "../../public/images/fav.png";
                img.alt = "icono fav";
                img.className = "fav";
                img.onclick = function () {
                    addFavorito(element.id)
                }
                div.appendChild(img);
                if (element.image != null) {
                    let imgProducto = document.createElement("img");
                    imgProducto.src = element.image_id;
                    imgProducto.alt = element.name;
                    imgProducto.className = "prod";
                    div.appendChild(imgProducto);
                }
                let nombre = document.createElement("div");
                nombre.className = "nombre";
                nombre.innerHTML = element.name;
                div.appendChild(nombre);
                let descripcion = document.createElement("div");
                descripcion.className = "descripcion";
                descripcion.innerHTML = element.description;
                div.appendChild(descripcion);
                document.getElementById("productos").appendChild(div);
            });
        });
});
