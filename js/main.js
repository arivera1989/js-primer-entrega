// Variables
let carrito = [];
let total = 0;
let pedidoNumero = Math.floor(Math.random() * 1000) + 1; // Genera un número aleatorio entre 1 y 1000 para el pedido

// Constantes
const PRODUCTOS = [
  { nombre: "Camisa", precio: 11999 },
  { nombre: "Remera algodón", precio: 7399 },
  { nombre: "Remera Jersey", precio: 7399 },
  { nombre: "Pantalón Jean", precio: 16999 },
  { nombre: "Pantalón Gabardina", precio: 18299 },
  { nombre: "Zapato", precio: 4999 },
  { nombre: "Zapatilla", precio: 34999 },
  { nombre: "Gorra Trucker", precio: 10499 },
  { nombre: "Cinturón de cuero", precio: 9249 },
];

const METODOS_PAGO = ["Tarjeta Visa", "Tarjeta Mastercard", "Abonar al retirar"];

// Datos de pago
const DATOS_PAGO = {
  numeroTarjeta: "1234567890123456",
  fechaVencimiento: "12/25",
  codigoSeguridad: "123",
  dniTitular: "123456789",
};

// Función para mostrar los productos disponibles y agregar al carrito
function agregarProducto() {
  let mensaje = "¿Qué vas a llevar hoy?:\n";
  for (let i = 0; i < Math.min(PRODUCTOS.length, 5); i++) {
    mensaje += `${i + 1}. ${PRODUCTOS[i].nombre} ($${PRODUCTOS[i].precio})\n`;
  }

  if (PRODUCTOS.length > 5) {
    mensaje += "6. Ver más";
  }

  mensaje += "\n0. Salir";

  let opcion = prompt(mensaje);
  switch (opcion) {
    case "0":
      return;
    case "6":
      mostrarProductosRestantes();
      break;
    default:
      if (opcion >= 1 && opcion <= PRODUCTOS.length) {
        carrito.push(PRODUCTOS[opcion - 1]);
        total += PRODUCTOS[opcion - 1].precio;
        alert("Producto agregado al carrito");
        agregarProducto();
      } else {
        alert("Opción no válida");
        agregarProducto();
      }
  }
}

// Función para mostrar los productos restantes
function mostrarProductosRestantes() {
  let mensaje = "Productos restantes:\n";
  for (let i = 5; i < PRODUCTOS.length; i++) {
    mensaje += `${i + 1}. ${PRODUCTOS[i].nombre} ($${PRODUCTOS[i].precio})\n`;
  }
  mensaje += "0. Volver";

  let opcion = prompt(mensaje);
  switch (opcion) {
    case "0":
      agregarProducto();
      break;
    default:
      if (opcion >= 6 && opcion <= PRODUCTOS.length) {
        carrito.push(PRODUCTOS[opcion - 1]);
        total += PRODUCTOS[opcion - 1].precio;
        alert("Producto agregado al carrito");
        agregarProducto();
      } else {
        alert("Opción no válida");
        mostrarProductosRestantes();
      }
  }
}

// Función para mostrar el carrito y el total, y procesar el pago
function verCarrito() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "Carrito de compras:\n";
  carrito.forEach((producto, index) => {
    mensaje += `${index + 1}. ${producto.nombre} - $${producto.precio}\n`;
  });
  mensaje += `Total: $${total}\n\n¿Qué desea hacer?\n\n1. Pagar\n2. Vaciar carrito\n0. Cancelar pedido`;

  let opcion = prompt(mensaje);
  switch (opcion) {
    case "0":
      break;
    case "1":
      procesarPedido();
      break;
    case "2":
      vaciarCarrito();
      break;
    default:
      alert("Opción no válida");
      verCarrito();
  }
}

// Función para vaciar el carrito
function vaciarCarrito() {
  carrito = [];
  total = 0;
  alert("Carrito vaciado correctamente.");
}

// Función para procesar el pedido
function procesarPedido() {
  let nombreApellido = prompt("Ingrese su nombre y apellido:");
  let dni = prompt("Ingrese su DNI:");

  alert(`Pedido N°${pedidoNumero}\n\nDatos del pedido:\nNombre y apellido: ${nombreApellido}\nDNI: ${dni}\n\nSelecciona un método de pago:`);

  let mensaje = "";
  METODOS_PAGO.forEach((metodo, index) => {
    mensaje += `${index + 1}. ${metodo}\n`;
  });
  mensaje += "0. Cancelar pedido";

  let opcionPago = prompt(mensaje);
  switch (opcionPago) {
    case "0":
      break;
    case "1":
      procesarPago("Tarjeta Visa");
      break;
    case "2":
      procesarPago("Tarjeta Mastercard");
      break;
    case "3":
      pagarAlRetirar();
      break;
    default:
      alert("Opción no válida");
      verCarrito();
  }
}

// Función para procesar el pago con tarjeta
function procesarPago(tipoTarjeta) {
  let numeroTarjeta = prompt("Ingresá el número de tarjeta (16 dígitos):");
  let fechaVencimiento = prompt("Ingresá la fecha de vencimiento (MM/AA):");
  let codigoSeguridad = prompt("Ingresá el código de seguridad (3 dígitos):");
  let dniTitular = prompt("Ingresá el DNI del titular (9 dígitos):");

  if (
    numeroTarjeta === DATOS_PAGO.numeroTarjeta &&
    fechaVencimiento === DATOS_PAGO.fechaVencimiento &&
    codigoSeguridad === DATOS_PAGO.codigoSeguridad &&
    dniTitular === DATOS_PAGO.dniTitular
  ) {
    alert(`Tu pago fue procesado correctamente\nGracias por tu compra!\nTe esperamos mañana después de las 9:00 hs para retirar tu pedido\nRecuerda llevar el N° de pedido para retirar: ${pedidoNumero}`);
    // Vaciar el carrito
  carrito = [];
  total = 0;
  } else {
    alert("El pago no se pudo procesar, revisa que los datos sean correctos");
  }
}

// Función para pagar al retirar
function pagarAlRetirar(pedidoNumero) {
  alert(`Gracias por tu compra! Mañana después de las 9:00 hs tu pedido estará listo para retirar. Recuerda llevar el N° de pedido para retirar: ${pedidoNumero}`);
  // Vaciar el carrito
  carrito = [];
  total = 0;
}


// Función principal
function ejecutarPrograma() {
  let opcion;
  do {
    opcion = prompt("¡Bienvenido a nuestra tienda online!\n\nSelecciona una opción:\n\n1. Agregar producto\n2. Ver carrito\n0. Salir");
    switch (opcion) {
      case "1":
        agregarProducto();
        break;
      case "2":
        verCarrito();
        break;
      case "0":
        break;
      default:
        alert("Opción no válida");
    }
  } while (opcion !== "0");
}

// Ejecutar el programa al cargar la página
ejecutarPrograma();
