function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar));
}

function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave));
    return datos;
}

let productos = obtenerAlmacenamientoLocal('productos') || [];
let contenedor = document.getElementById('contenedor');

// Variables que traemos de nuestro html
const informacionCompra = document.getElementById('informacionCompra');
const contenedorCompra = document.getElementById('contenedorCompra');
const productosCompra = document.getElementById('productosCompra');
const carrito = document.getElementById('carrito');
const numero = document.getElementById('numero');
const header = document.getElementById('header');
const total = document.getElementById('total');
const body = document.body;
const x = document.getElementById('x');

// variables proyecto
let lista = [];
let valortotal = 0;

window.addEventListener("scroll", function () {
    if (contenedor.getBoundingClientRect().top < 10) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
});

window.addEventListener('load', () => {
    visualizadorProductos();
    contenedorCompra.classList.add("none");
    //contenedorCompra.classList.remove('none');
});

// Evento delegado para el botón Comprar
contenedor.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON" && event.target.classList.contains("comprar-btn")) {
        const index = parseInt(event.target.dataset.index);
        comprar(index);
    }
});

// Evento delegado para el botón Eliminar
productosCompra.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" && event.target.classList.contains("botonTrash")) {
        const index = parseInt(event.target.dataset.index);
        eliminar(index);
    }
});


function visualizadorProductos() {
    let html = "";
    for (let i = 0; i < productos.length; i++) {
        const agotadoClass = productos[i].existencia > 0 ? "" : "agotado";
        html += `
            <div>
                <img src="${productos[i].urlImagen}">
                <div class="informacion">
                    <p>${productos[i].nombre}</p>
                    <p class="precio">$${productos[i].valor}</p>
                    <button class="comprar-btn" data-index="${i}" ${agotadoClass}>Comprar</button>
                </div>
            </div>`;
    }
    contenedor.innerHTML = html;
}

function comprar(indice) {
    if (productos[indice].existencia > 0) {
        lista.push({ nombre: productos[indice].nombre, precio: productos[indice].valor });
        productos[indice].existencia -= 1;

        if (productos[indice].existencia === 0) {
            visualizadorProductos();
        }

        guardarAlmacenamientoLocal("productos", productos);
        numero.innerHTML = lista.length;
        numero.classList.add("disenoNumero");
    }
}

carrito.addEventListener("click", function () {
    body.style.overflow = "hidden";
    contenedorCompra.style.visibility = 'visible'; // Muestra el contenedor de la compra
    contenedorCompra.classList.remove('none');
    contenedorCompra.classList.add('contenedorCompra');
    informacionCompra.classList.add('informacionCompra');
    mostrarElementosLista();
});

function mostrarElementosLista() {
    productosCompra.innerHTML = "";
    valortotal = 0;
    for (let i = 0; i < lista.length; i++) {
        productosCompra.innerHTML += `
            <div class="producto-carrito">
                <p class="nombre-producto">${lista[i].nombre}</p>
                <p class="precio-producto">$${lista[i].precio}</p>
                <img class="botonTrash" data-index="${i}" src="/img/trash.png">
            </div>`;

        valortotal += parseInt(lista[i].precio);
    }
    total.innerHTML = `<p>Valor Total</p> <p><span>$${valortotal}</span></p>`;
}

function eliminar(indice) {
    const productoIndex = productos.findIndex(producto => producto.nombre === lista[indice].nombre);

    if (productoIndex !== -1) {
        productos[productoIndex].existencia += 1;
        lista.splice(indice, 1);
        guardarAlmacenamientoLocal("productos", productos);
        visualizadorProductos();
        numero.innerHTML = lista.length;

        if (lista.length === 0) {
            numero.classList.remove("disenoNumero");
        }

        mostrarElementosLista();
    }
}

x.addEventListener("click", function () {
    body.style.overflow = "auto";
    contenedorCompra.style.visibility = 'hidden'; // Oculta el contenedor de la compra
    contenedorCompra.classList.add('none');
    contenedorCompra.classList.remove('contenedorCompra');
    informacionCompra.classList.remove('informacionCompra');
});
