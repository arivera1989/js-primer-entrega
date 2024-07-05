// Variables globales
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = 0;
let pedidoNumero = Math.floor(Math.random() * 1000) + 1; // Genera un número aleatorio entre 1 y 1000 para el pedido
let nombreApellido;

// Constante de métodos de pago
const METODOS_PAGO = ["Visa", "Mastercard", "Retirar"];

// Productos con stock simulado en data.json
let PRODUCTOS;

// Evento de carga del DOM
document.addEventListener("DOMContentLoaded", async () => {
  // Cargar productos desde data.json
  await cargarProductos();

  // Mostrar productos en la interfaz
  mostrarProductos();

  // Verificar si el botón del carrito debe mostrarse al cargar la página
  actualizarBotonCarrito();

  // Evento click en Ver Carrito
  document.getElementById("verCarrito").addEventListener("click", verCarrito);

  // Evento click en Vaciar Carrito
  document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);

  // Evento click en Procesar Pedido
  document.getElementById("procesarPedido").addEventListener("click", () => {
    let modal = new bootstrap.Modal(document.getElementById("pagoModal"));
    modal.show();
  });

  // Evento submit del formulario de pago
  document.getElementById("formPago").addEventListener("submit", procesarPedido);

  // Evento cambio de método de pago
  document.getElementById("metodoPago").addEventListener("change", toggleDatosTarjeta);
});

// Función para mostrar un toast
function mostrarToast(mensaje, color) {
  const toastContainer = document.getElementById("toast-container");
  // Eliminar toasts anteriores
  while (toastContainer.firstChild) {
    toastContainer.removeChild(toastContainer.firstChild);
  }

  if(color == 'verde'){
    color = 'bg-success-subtle text-success-emphasis';
  }else if(color == 'rojo'){
    color = 'bg-danger-subtle text-danger-emphasis';
  }

  const toastId = `toast-${Date.now()}`;
  const toastHTML = `
    <div id="${toastId}" class="toast ${color}" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-body">
        ${mensaje}
      </div>
    </div>`;
  toastContainer.innerHTML = toastHTML; // Reemplazar el contenido existente con el nuevo toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Función para cargar productos desde data.json
async function cargarProductos() {
  const response = await fetch('data.json');
  PRODUCTOS = await response.json();
}

// Función para mostrar productos en la interfaz
function mostrarProductos() {
  const productosDiv = document.getElementById("productos");
  productosDiv.innerHTML = "";
  PRODUCTOS.forEach((producto, index) => {
    const productoEnCarrito = carrito.find(item => item.nombre === producto.nombre);
    const cantidad = productoEnCarrito ? productoEnCarrito.cantidad : 0;
    const productoHTML = `
      <div class="col-md-4 card-product">
        <div class="card">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text">$${producto.precio}</p>
            <div class="text-center">
              <button class="btn btn-custom" onclick="agregarProducto(${index})" ${producto.stock === 0 ? 'disabled' : ''}>
                <i class="bi bi-cart-check"></i>
                ${cantidad > 0 ? `<span class="badge bg-primary">${cantidad}</span>` : ''}
              </button>
              ${producto.stock === 0 ? '<p class="text-danger mt-2 fw-bold">Sin stock disponible</p>' : ''}
            </div>
          </div>
        </div>
      </div>`;
    productosDiv.innerHTML += productoHTML;
  });
}

// Función para agregar un producto al carrito
async function agregarProducto(index) {
  const producto = PRODUCTOS[index];
  const productoEnCarrito = carrito.find(item => item.nombre === producto.nombre);

  if (productoEnCarrito) {
    // Verificar si hay suficiente stock para agregar una unidad más
    if (productoEnCarrito.cantidad < producto.stock) {
      productoEnCarrito.cantidad += 1;
      mostrarToast("Producto agregado al carrito", "verde");
    } else {
      mostrarToast("No hay más stock disponible de este producto.", "rojo");
    }
  } else {
    // Verificar si hay stock disponible para agregar el producto
    if (producto.stock > 0) {
      carrito.push({ ...producto, cantidad: 1 });
      mostrarToast("Producto agregado al carrito", "verde");
    } else {
      mostrarToast("No hay más stock disponible de este producto.", "rojo");
    }
  }

  // Si se modificó el carrito, actualizar localStorage y la interfaz
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarProductos();
  actualizarBotonCarrito();
}

// Función para ver el carrito
function verCarrito() {
  const carritoUl = document.getElementById("carrito");
  carritoUl.innerHTML = "";
  total = 0;
  carrito.forEach((producto, index) => {
    const productoHTML = ` 
      <li class="list-group-item d-flex justify-content-between align-items-center"> 
        ${producto.nombre} - $${producto.precio} (Cantidad: ${producto.cantidad}) 
        <button class="btn btn-danger btn-sm" data-bs-dismiss="modal" onclick="eliminarDelCarrito(${index})">Eliminar</button> 
      </li> `;
    carritoUl.innerHTML += productoHTML;
    total += producto.precio * producto.cantidad;
  });
  document.getElementById("totalCarrito").innerText = total;
  let modal = new bootstrap.Modal(document.getElementById("carritoModal"));
  modal.show();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
  const productoEnCarrito = carrito[index];
  if (productoEnCarrito.cantidad > 1) {
    productoEnCarrito.cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  verCarrito();
  mostrarProductos(); // Actualizar la vista de productos para reflejar la cantidad en el carrito
  mostrarToast("Producto eliminado del carrito.", "verde");
  actualizarBotonCarrito(); // Actualizar la visibilidad del botón del carrito y el contador
}

// Función para vaciar el carrito
function vaciarCarrito() {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarToast("El carrito ha sido vaciado", "verde");
  mostrarProductos(); // Actualizar la vista de productos para reflejar la cantidad en el carrito
  actualizarBotonCarrito(); // Actualizar la visibilidad del botón del carrito y el contador
  let modalElement = document.getElementById("carritoModal");
  let modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();
}

// Función para procesar un pedido
async function procesarPedido(event) {
  event.preventDefault();
  let nombreApellido = document.getElementById("nombreApellido").value;
  let dni = document.getElementById("dni").value;
  let metodoPago = document.getElementById("metodoPago").value;
  let numeroTarjeta = document.getElementById("numeroTarjeta").value;
  let fechaVencimiento = document.getElementById("fechaVencimiento").value;
  let codigoSeguridad = document.getElementById("codigoSeguridad").value;
  let dniTitular = document.getElementById("dniTitular").value;

  if (metodoPago === "Visa" || metodoPago === "Mastercard") {
    if (!numeroTarjeta || !fechaVencimiento || !codigoSeguridad || !dniTitular) {
      mostrarToast("Por favor, complete todos los campos de la tarjeta.", "rojo");
      return;
    }
  }

  // Reducir el stock en data.json según los productos comprados
  for (const producto of carrito) {
    await actualizarStockEnJson(producto.nombre, -producto.cantidad);
  }

  vaciarCarrito();
  let modalElement = document.getElementById("pagoModal");
  let modalPago = bootstrap.Modal.getInstance(modalElement);
  modalPago.hide();
  mostrarToast(`Pedido procesado con éxito. Número de pedido: ${pedidoNumero}.`, "verde");
  modal.hide();
}

// Función para actualizar el stock en data.json
async function actualizarStockEnJson(nombreProducto, cantidad) {
  const response = await fetch('data.json');
  let data = await response.json();

  const producto = data.find(item => item.nombre === nombreProducto);
  if (producto) {
    producto.stock = Math.max(producto.stock + cantidad, 0); // Asegura que el stock no sea negativo
  }

  await fetch('data.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

// Función para actualizar la visibilidad del botón del carrito y el contador
function actualizarBotonCarrito() {
  const botonCarrito = document.getElementById("verCarrito");
  const contadorCarrito = document.getElementById("contadorCarrito");

  if (carrito.length > 0) {
    botonCarrito.style.display = "block";
    contadorCarrito.style.display = "block";
    contadorCarrito.innerText = carrito.length;
  } else {
    botonCarrito.style.display = "none";
    contadorCarrito.style.display = "none";
    contadorCarrito.innerText = "";
  }
}

// Función para mostrar u ocultar los campos de datos de tarjeta según el método de pago seleccionado
function toggleDatosTarjeta() {
  const metodoPago = document.getElementById("metodoPago").value;
  const datosTarjetaDiv = document.getElementById("datosTarjeta");

  if (METODOS_PAGO.includes(metodoPago)) {
    datosTarjetaDiv.style.display = "block";
  } else {
    datosTarjetaDiv.style.display = "none";
  }
}
