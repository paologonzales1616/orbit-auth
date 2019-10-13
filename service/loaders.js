const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");

module.exports = server => {
  server.use(morgan("dev"));
  server.use(helmet());
  server.use(cors());
  server.use(bodyParser.json());
  console.log("Middlewares loaded...");
};
