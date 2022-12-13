const socket = io();

socket.on("render", (data) => {
  renderTabla();
  renderCarrito();
});

function enviar_formulario() {
  const url = "/api/productos?admin=true";

  let data = {
    nombre: document.getElementById("titulo").value,
    descripcion: document.getElementById("descripcion").value,
    codigo: document.getElementById("codigo").value,
    thumbail: document.getElementById("thumbail").value,
    precio: document.getElementById("precio").value,
    stock: document.getElementById("stock").value,
  };

  let request = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, request).then(function () {
    socket.emit("actualizacion");
  });

  return false;
}

function renderTabla() {
  const tabla = document.getElementById("tBody");
  const url = "/api/productos";

  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      tabla.innerHTML = "";
      for (const pto of data) {
        let fila = document.createElement("tr");
        let aux1 = document.createElement("td");
        aux1.innerHTML = `${pto.nombre}`;
        let aux2 = document.createElement("td");
        aux2.innerHTML = `${pto.descripcion}`;
        let aux3 = document.createElement("td");
        aux3.innerHTML = `${pto.codigo}`;
        let aux4 = document.createElement("td");
        aux4.innerHTML = `${pto.stock}`;
        let aux5 = document.createElement("td");
        aux5.innerHTML = `$ ${pto.precio}`;
        let aux6 = document.createElement("td");
        aux6.innerHTML = `<img src = ${pto.thumbail} width="40"height="40">`;
        let aux7 = document.createElement("td");
        aux7.innerHTML = `<a href="javascript:agregarPtoCarrito(${pto.id})" class="btn btn-success">✓</a>`;
        let aux8 = document.createElement("td");
        aux8.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-id="${pto.id}">✎</button>`;
        let aux9 = document.createElement("td");
        aux9.innerHTML = `<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-bs-id="${pto.id}">X</button>`;
        fila.appendChild(aux1);
        fila.appendChild(aux2);
        fila.appendChild(aux3);
        fila.appendChild(aux4);
        fila.appendChild(aux5);
        fila.appendChild(aux6);
        fila.appendChild(aux7);
        fila.appendChild(aux8);
        fila.appendChild(aux9);
        tabla.appendChild(fila);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  return false;
}

function renderCarrito() {
  const url = "/api/carrito/1";
  const tabla = document.getElementById("tBodyCarrito");

  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      tabla.innerHTML = "";
      for (const pto of data) {
        let fila = document.createElement("tr");
        let aux1 = document.createElement("td");
        aux1.innerHTML = `${pto.nombre}`;
        let aux2 = document.createElement("td");
        aux2.innerHTML = `$ ${pto.precio}`;
        let aux3 = document.createElement("td");
        aux3.innerHTML = `<img src = ${pto.thumbail} width="40"height="40">`;
        let aux4 = document.createElement("td");
        aux4.innerHTML = `<a href="javascript:borrarPtoCarrito(${pto.id})" class="btn btn-danger">X</a>`;
        fila.appendChild(aux1);
        fila.appendChild(aux2);
        fila.appendChild(aux3);
        fila.appendChild(aux4);
        tabla.appendChild(fila);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  return false;
}

function borrarPtoCarrito(id) {
  const url = "/api/carrito/1/" + id;
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, request).then(function () {
    socket.emit("actualizacion");
  });
}

function agregarPtoCarrito(id) {
  const url = "/api/carrito/1/" + id;
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, request).then(function () {
    socket.emit("actualizacion");
  });
}

function mostrarFormulario() {
  var x = document.getElementById("formularioPtos");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function editarProducto() {
  let inId = document.getElementById("idM").value;
  const url = `/api/productos/${inId}?admin=true`;
  let data = {
    nombre: document.getElementById("tituloM").value,
    descripcion: document.getElementById("descripcionM").value,
    codigo: document.getElementById("codigoM").value,
    thumbail: document.getElementById("thumbailM").value,
    precio: document.getElementById("precioM").value,
    stock: document.getElementById("stockM").value,
  };

  let request = {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, request).then(function () {
    socket.emit("actualizacion");
  });

  return false;
}

function borrarProducto() {
  let inId = document.getElementById("idMB").value;
  const url = `/api/productos/${inId}?admin=true`;

  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, request).then(function () {
    socket.emit("actualizacion");
  });

  return false;
}
let myModal = document.getElementById("exampleModal");
let myModal2 = document.getElementById("exampleModal2");
myModal.addEventListener("shown.bs.modal", function (event) {
  let button = event.relatedTarget;
  let id = button.getAttribute("data-bs-id");

  let modalBodyInput = exampleModal.querySelector(".modal-body input");

  let inId = document.getElementById("idM");
  let inTitulo = document.getElementById("tituloM");
  let inDescripcion = document.getElementById("descripcionM");
  let inCodigo = document.getElementById("codigoM");
  let inThumbail = document.getElementById("thumbailM");
  let inPrecio = document.getElementById("precioM");
  let inStock = document.getElementById("stockM");

  const url = "/api/productos/" + id;
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, request)
    .then((resp) => resp.json())
    .then(function (data) {
      inId.value = data[0].id;
      inTitulo.value = data[0].nombre;
      inDescripcion.value = data[0].descripcion;
      inCodigo.value = data[0].codigo;
      inThumbail.value = data[0].thumbail;
      inPrecio.value = data[0].precio;
      inStock.value = data[0].stock;
    });
});

myModal2.addEventListener("shown.bs.modal", function (event) {
  let button = event.relatedTarget;
  let id = button.getAttribute("data-bs-id");

  let modalBodyInput = exampleModal.querySelector(".modal-body input");

  let inId = document.getElementById("idMB");

  const url = "/api/productos/" + id;
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, request)
    .then((resp) => resp.json())
    .then(function (data) {
      inId.value = data[0].id;
    });
});
