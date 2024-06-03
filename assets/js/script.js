// Variables
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = 0;
let pedidoNumero = Math.floor(Math.random() * 1000) + 1; // Genera un número aleatorio entre 1 y 1000 para el pedido
let nombreApellido;
const METODOS_PAGO = ["Visa", "Mastercard", "Retirar"];


const PRODUCTOS = [
  { nombre: "Camisa Estampada",
  descripcion: "Negra con estampas en gris. Talle Unico",
  precio: 11999, 
  imagen: "./assets/image/camisa.webp" },
  {
    nombre: "Remera algodón",
    descripcion: "Blanca con estampa negra 'Actitud'",
    precio: 7399,
    imagen: "./assets/image/remera_algodon.webp",
  },
  {
    nombre: "Remera Jersey",
    descripcion: "Color tiza, lisa. Talle Unico",
    precio: 7399,
    imagen: "./assets/image/rem_jersey.webp",
  },
  {
    nombre: "Pantalón Jean",
    descripcion: "Negro, entallado, chupin. Talle Unico",
    precio: 16999,
    imagen: "./assets/image/pant_jean.webp",
  },
  {
    nombre: "Pantalón Gabardina",
    descripcion: "Verde militar, cargo. Talle Unico",
    precio: 18299,
    imagen: "./assets/image/pant_gabardina.webp",
  },
  { nombre: "Zapato de vestir casual",
    descripcion: "Acordonado, cuero brillante, cuero vacuno",
    precio: 4999,
    imagen: "./assets/image/zapato.webp" },
  {
    nombre: "Zapatilla Dc Pensford",
    descripcion: "SS Le botita, con abrojo",
    precio: 34999,
    imagen: "./assets/image/zapatilla.webp",
  },
  {
    nombre: "Gorra Trucker ajustable",
    descripcion: "Modelo sin eleccion, segun disponibilidad",
    precio: 10499,
    imagen: "./assets/image/gorra.webp",
  },
  {
    nombre: "Cinturón de vestir",
    descripcion: "Negro, cuero, 3.5 cms de ancho, 85 al 115",
    precio: 9249,
    imagen: "./assets/image/cinturon_cuero.webp",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  document.getElementById("verCarrito").addEventListener("click", verCarrito);
  document
    .getElementById("vaciarCarrito")
    .addEventListener("click", vaciarCarrito);
  document.getElementById("procesarPedido").addEventListener("click", () => {
    let modal = new bootstrap.Modal(document.getElementById("pagoModal"));
    modal.show();
  });
  document
    .getElementById("formPago")
    .addEventListener("submit", procesarPedido);
  document
    .getElementById("metodoPago")
    .addEventListener("change", toggleDatosTarjeta);
});

function mostrarToast(mensaje) {
  const toastContainer = document.getElementById("toast-container");
  // Eliminar toasts anteriores
  while (toastContainer.firstChild) {
    toastContainer.removeChild(toastContainer.firstChild);
  }

  const toastId = `toast-${Date.now()}`;
  const toastHTML = `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-body">
              ${mensaje}
          </div>
      </div>`;
  toastContainer.innerHTML = toastHTML; // Reemplazar el contenido existente con el nuevo toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}


function mostrarProductos() {
  const productosDiv = document.getElementById("productos");
  productosDiv.innerHTML = "";
  PRODUCTOS.forEach((producto, index) => {
    const productoHTML = `
          <div class="col-md-4 card-product">
              <div class="card">
                  <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                  <div class="card-body">
                      <h5 class="card-title">${producto.nombre}</h5>
                      <p class="card-text">${producto.descripcion}</p>
                      <p class="card-text">$${producto.precio}</p>
                      <div class="text-center">
                          <button class="btn btn-info" onclick="agregarProducto(${index})">
                              <i class="bi bi-cart-check"></i>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      `;
    productosDiv.innerHTML += productoHTML;
  });
}

function agregarProducto(index) {
  carrito.push(PRODUCTOS[index]);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarToast("Producto agregado al carrito");
}

function verCarrito() {
  const carritoUl = document.getElementById("carrito");
  carritoUl.innerHTML = "";
  total = 0;
  carrito.forEach((producto, index) => {
    const productoHTML = ` <li class="list-group-item d-flex justify-content-between align-items-center"> ${producto.nombre} - $${producto.precio} <button class="btn btn-danger btn-sm" data-bs-dismiss="modal" onclick="eliminarDelCarrito(${index})">Eliminar</button> </li> `;
    carritoUl.innerHTML += productoHTML;
    total += producto.precio;
  });
  document.getElementById("totalCarrito").innerText = total;
  let modal = new bootstrap.Modal(document.getElementById("carritoModal"));
  modal.show();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  verCarrito();
  mostrarToast("El producto ha sido eliminado del carrito.");
}

function vaciarCarrito() {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarToast("El carrito ha sido vaciado");
  let modalElement = document.getElementById("carritoModal");
  let modal = bootstrap.Modal.getInstance(modalElement);

}

function procesarPedido(event) {
  event.preventDefault();
  let nombreApellido = document.getElementById("nombreApellido").value;
  let dni = document.getElementById("dni").value;
  let metodoPago = document.getElementById("metodoPago").value;
  let numeroTarjeta = document.getElementById("numeroTarjeta").value;
  let fechaVencimiento = document.getElementById("fechaVencimiento").value;
  let codigoSeguridad = document.getElementById("codigoSeguridad").value;
  let dniTitular = document.getElementById("dniTitular").value;

  if (metodoPago === "Visa" || metodoPago === "Mastercard") {
    if (
      !numeroTarjeta ||
      !fechaVencimiento ||
      !codigoSeguridad ||
      !dniTitular
    ) {
      mostrarToast("Por favor, complete todos los campos de la tarjeta.");
      return;
    }
  }

  
  vaciarCarrito();
  let modalElement = document.getElementById("pagoModal");
  let modalPago = bootstrap.Modal.getInstance(modalElement);
  modalPago.hide();
  mostrarToast(`Pedido procesado con éxito. Número de pedido: ${pedidoNumero}.`);
  modal.hide();
}

function toggleDatosTarjeta() {
  const metodoPago = document.getElementById("metodoPago").value;
  const datosTarjetaDiv = document.getElementById("datosTarjeta");

  if (metodoPago === "Visa" || metodoPago === "Mastercard") {
    datosTarjetaDiv.classList.remove("d-none");
  } else {
    datosTarjetaDiv.classList.add("d-none");
  }
}
