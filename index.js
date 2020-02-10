const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const routes = require("./src/routes");

const app = express();

mongoose.connect(
  "mongodb://TechEngineer:engenheira@cluster0-shard-00-00-anszr.mongodb.net:27017,cluster0-shard-00-01-anszr.mongodb.net:27017,cluster0-shard-00-02-anszr.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);
