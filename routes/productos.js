const express = require("express");
const Contenedor = require("../claseContenedor.js");

const app = express();
const { Router } = express;
const router = new Router();

let productos = new Contenedor("productos.txt");

//FECHA
function darFecha() {
  const fecha = new Date();
  let fechaOK = fecha.getDate() + '/' + (fecha.getMonth()+1) + ' - ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
  return fechaOK;
}
//GET TODOS LOS PRODUCTOS
router.get("/", (req, res) => {
  async function getTodos(){
    try{
      let aux = await productos.getAll();
      res.send(aux);
    }
    catch(error){
      throw Error("Error en todos los productos")
    }  
  }    
  getTodos();
});

//GET PRODUCTO POR ID
router.get("/:id", (req, res) =>{
  async function getxId(){
    try{
      let ptoId = await productos.getById(parseInt(req.params.id));
      //Me fijo si existe el PTO con el ID solicitado
      if (Object.keys(ptoId).length != 0) {
        //Pto con ID solicitado encontrado, envio respuesta
        res.send(ptoId);
      }
      //Pto con ID solicitado NO encontrado, envio error
      else{
        res.status(400);
        res.send({ error : 'producto no encontrado' });
      }
    }
    catch(error){
      throw Error("Error buscando producto por id");
    }
    
  };
  getxId();
});

//POST CON PTO NUEVO ENVIADO POR PARAMETRO
router.post("/", (req, res) => {
  //Armo un nuevo PTO con los datos recibidos por parametro y datos locales como fecha
  let { nombre, descripcion, codigo, thumbail, precio, stock } = req.body;
  let newObj = {
    id: 0,
    timestamp: darFecha(),
    nombre,
    descripcion,
    codigo,
    thumbail,
    precio,
    stock
  };

  //Agrego el producto a productos.txt
  async function savePto(){
    try {
      await productos.save(newObj);
      res.send(newObj);
      
    } catch (error) {
      throw Error("Error en post productos");
    }
  }

  //Variable admin a ser configurada mas adelante, por ahora enviada por query
  //Me fijo si es administrador o no
  if (req.query.admin == 'true') {
    savePto();
  }
  else{
    res.status(403);
    res.send({error: -1, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`});
  }
});

//PUT MODIFICANDO SEGUN ID
router.put("/:id", (req, res) =>{
  //Armo un nuevo PTO con los datos recibidos por parametro
  let { nombre, descripcion, codigo, thumbail, precio, stock } = req.body;

  async function modfPto(){
    try {
      //Busco el producto segun ID
      let ptoMod = await productos.getById(parseInt(req.params.id));
      //Me fijo si existe el PTO con el ID solicitado
      if (Object.keys(ptoMod).length != 0) {
        //Pto con ID encontrado
        //Armado de un nuevo objeto con los parametros enviados en el body, y parametros locales como fecha
        ptoMod = {
          id: parseInt(req.params.id),
          timestamp: darFecha(),
          nombre,
          descripcion,
          codigo,
          thumbail,
          precio,
          stock
        };
        //Armado de un array con todos los PTOS
        let todosPtos = await productos.read();
        todosPtos = (JSON.parse(todosPtos, null, 2));
        //Modifico el array con el PTO modificado
        let auxId = parseInt(req.params.id) - 1;
        todosPtos.splice(auxId, 1, ptoMod);
        //Escribo el archivo
        await productos.write(todosPtos, "Producto modificado correctamente");
        //Envio respuesta
        res.send(todosPtos);
      }
      //PTO con ID no encontrado, envio error
      else{
        res.send({ error : 'producto no encontrado' });
      }
    } catch (error) {
      throw Error("Error en put modificacion productos");
    }
  }

  //Variable admin a ser configurada mas adelante, por ahora enviada por query
  //Me fijo si es administrador o no
  if (req.query.admin == 'true') {
    modfPto();
  }
  else{
    res.status(403);
    res.send({error: -1, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`});
  }
});

//DELETE SEGUN ID
router.delete("/:id", (req,res) =>{
  async function deletexId(){
    try {
      //Me fijo si existe el PTO con el ID solicitado
      let flag = await productos.getById(parseInt(req.params.id));
      if (Object.keys(flag).length != 0) {
        //Pto con ID solicitado encontrado
        //Borro el PTO con el ID solicitado, y envio respuesta
        await productos.deleteById(parseInt(req.params.id));
        res.send(await productos.getAll());   
      }
      //PTO con ID no encontrado, envio error
      else{
        res.status(400);
        res.send({ error : 'producto no encontrado' });
      }
    } catch (error) {
      throw Error ("Error en el delete por id");
    }
  }

  //Variable admin a ser configurada mas adelante, por ahora enviada por query
  //Me fijo si es administrador o no
  if (req.query.admin == 'true') {
     deletexId();
  }
  else{
    res.status(403);
    res.send({error: -1, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`});
  }
});

//EXPORT MODULO ROUTER
module.exports = router;
