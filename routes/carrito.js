const express = require("express");
const Contenedor = require("../claseContenedor.js");

const app = express();
const { Router } = express;
const router = new Router();

let carros = new Contenedor("carritos.txt");
let productos = new Contenedor("productos.txt");

function darFecha() {
  const fecha = new Date();
  let fechaOK =
    fecha.getDate() +
    "/" +
    (fecha.getMonth() + 1) +
    " - " +
    fecha.getHours() +
    ":" +
    fecha.getMinutes() +
    ":" +
    fecha.getSeconds();
  return fechaOK;
}

router.post("/", (req, res) => {
  let carrito = {
    id: 0,
    timestamp: darFecha(),
    productos: [],
  };

  async function saveCarrito() {
    try {
      await carros.save(carrito);
      res.send({ id: carrito.id });
    } catch (error) {
      throw Error("Error en post carrito");
    }
  }
  saveCarrito();
});

router.post("/:idCarrito/:idPto", (req, res) => {
  async function agregarPtoXid() {
    try {
      let ptoId = await productos.getById(parseInt(req.params.idPto));
      if (Object.keys(ptoId).length != 0) {
        let carrito = await carros.getById(req.params.idCarrito);
        if (carrito[0]) {
          let carrosTodos = await carros.read();
          carrosTodos = JSON.parse(carrosTodos);
          let auxId = parseInt(req.params.idCarrito) - 1;
          carrito[0].productos.push(ptoId[0]);
          carrosTodos.splice(auxId, 1, carrito[0]);
          await carros.write(
            carrosTodos,
            "Producto agregado al carrito correctamente"
          );
          res.send({ carrito });
        } else {
          res.status(400);
          res.send({ error: "carrito no encontrado" });
        }
      } else {
        res.status(400);
        res.send({ error: "producto no encontrado" });
      }
    } catch (error) {
      throw Error("Error agregando pto al carrito");
    }
  }
  agregarPtoXid();
});

router.delete("/:id", (req, res) => {
  async function deletexId() {
    try {
      let flag = await carros.getById(parseInt(req.params.id));
      if (Object.keys(flag).length != 0) {
        await carros.deleteById(parseInt(req.params.id));
        res.send(await carros.getAll());
      } else {
        res.status(400);
        res.send({ error: "Carrito con ID solicitado no existe" });
      }
    } catch (error) {
      throw Error("Error borrando carro por ID");
    }
  }

  deletexId();
});

router.delete("/:idCarrito/:idPto", (req, res) => {
  async function deletePtoxid() {
    try {
      let carritoId = await carros.getById(parseInt(req.params.idCarrito));
      if (Object.keys(carritoId).length != 0) {
        let ptosCarro = carritoId[0].productos;
        let indexPto = ptosCarro.findIndex((aux) => aux.id == req.params.idPto);
        if (indexPto >= 0) {
          carritoId[0].productos.splice(indexPto, 1);

          let carrosTodos = await carros.read();
          carrosTodos = JSON.parse(carrosTodos);
          let auxId = parseInt(req.params.idCarrito) - 1;
          carrosTodos.splice(auxId, 1, carritoId[0]);
          await carros.write(
            carrosTodos,
            "Producto eliminado del carrito correctamente"
          );
          res.send(carritoId);
        } else {
          res.status(400);
          res.send({ error: "Pto con ID solicitado no existe en el carrito" });
        }
      } else {
        res.status(400);
        res.send({ error: "Carrito con ID solicitado no existe" });
      }
    } catch (error) {
      throw Error("Error borrando producto de carro por ID");
    }
  }

  deletePtoxid();
});

router.get("/:id", (req, res) => {
  async function todosPtos() {
    try {
      let carrito = await carros.getById(parseInt(req.params.id));
      if (carrito[0]) {
        ptos = carrito[0].productos;
        res.send(ptos);
      } else {
        res.status(400);
        res.send({ error: "Carrito con ID solicitado no existe" });
      }
    } catch (error) {
      throw Error("Error obteniendo todos los producto del carrito por ID");
    }
  }

  todosPtos();
});

router.get("/", (req, res) => {
  async function carrito() {
    try {
      let aux = await carros.getAll();
      res.send(aux);
    } catch {
      console.log("ERROR");
    }
  }
  carrito();
});

module.exports = router;
