require("dotenv").config();
const express = require("express");

const server = express();
const port = parseInt(process.env.PORT, 10) || 3000;
const config = require("./config/index");

const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");

// loading middlewares
require("./service/loaders")(server);

// connect to our database
require("./database/index")();

//user routes
server.use(config.prefix, userRoute);

//admin routes
server.use(config.prefix, adminRoute);

server.listen(port, () =>
  console.log(`Authentication server running on host: http://localhost:${port}`)
);
