const express = require("express");
const path = require("path");
const Contenedor = require("./claseContenedor.js");

const app = express();
const PORT = process.env.PORT || 8080;

//MIDLEWARES
app.use(express.static(__dirname + '/public'));
app.use(express.json()); // body-parser
app.use(express.urlencoded());

  //ROUTES
const produtosRoute = require("./routes/productos");
app.use("/api/productos", produtosRoute);
const carritoRoute = require("./routes/carrito");
app.use("/api/carrito", carritoRoute);

  //MANEJO DE ERROR 404
app.use((req, res, next) => {
  res.status(404);
  res.send({error: -2, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no implementada`});
});

  //IO SOCKET
//Servidor HTTP
const http = require("http");
const server = http.createServer(app);

//Servidor de Socket
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket)=> {
  /*Cuando el cliente se conecto renderizo las vistas*/
  socket.emit("render", "Hola Cliente")
  socket.on("actualizacion", ()=>{
    /*Cuando hay modificaciones vuelvo a renderizar la vista para todos los clientes conectados*/
    io.sockets.emit("render", "Actualizacion") //Se puede cambiar io.sockets.emit a socket.emit para que un solo cliente vea la actualizacion del carrito
  })
})


//COMIENZO SERVIDOR
server.listen(PORT, () => {
    console.log(`Server is run on port ${server.address().port}`)
  })
  server.on('error', error => console.log(`Error en servidor ${error}`))
