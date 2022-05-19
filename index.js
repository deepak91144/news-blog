const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const postRoutes = require("./routes/Post");
const categoryRoutes = require("./routes/Category");
const autherRoutes = require("./routes/Auther");
const authRoutes = require("./routes/Auth");
const pushNotificationRoutes = require("./routes/PushNotification");
// getting port number from env file
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
// requring body-parser to extract data from request body
app.use(bodyParser.json());
// including all routes here
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", postRoutes);
app.use("/api", categoryRoutes);
app.use("/api", autherRoutes);
app.use("/api", authRoutes);
app.use("/api", pushNotificationRoutes);
// make the application listen to the port
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
