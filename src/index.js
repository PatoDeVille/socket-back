// importamos express y luego lo usamos para crear una app
const express = require("express");
const app = express();

// importamos dotenv para poder gestionar variables de entorno y configuramos
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.port || 3005;

// importamos la configuracion del socket
const { configurePrivateSocket, configurePublicSocket } = require("./socket");

require("./mongo");

cors = require("cors");

//Le decimos a nuestra app, que vamos recibir peticiones donde el Body contiene texto en formato JSON.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const generalRouter = require("./routers");

app.use(cors());

//Le decimos a nuestra app, que "utilize" el router GENERAL. Esto es equivalente a haber definido todos nuestros endpoints directamente sobre el objeto app como vimos en clase.
app.use(generalRouter);

//a partir de este punto y gracias a la linea escrita mas arriba, si llega alguna peticion que empieze por /todo, está se redirige hacia todoRouter.

const server = app.listen(port, () => {
  console.log(`Server is up and running in port ${port} ⚡`);
});

exports.io = configurePublicSocket(server);
exports.ioPrivate = configurePrivateSocket(server);
