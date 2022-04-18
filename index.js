const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const postRoutes = require("./routes/Post");
const categoryRoutes = require("./routes/Category");
const autherRoutes = require("./routes/Auther");
const authRoutes = require("./routes/Auth");
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", postRoutes);
app.use("/api", categoryRoutes);
app.use("/api", autherRoutes);
app.use("/api", authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
