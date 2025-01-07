const express = require('express');
const connectToDatabase = require('./Database/dbConnection');
const router = require('./Routes/routes');
const app = express();
const CORS = require("cors");
const geoCoding = require('./Controllers/dynamicRouting');
require("dotenv").config();


app.use(CORS());

const port = process.env.PORT;
app.use(express.json());
app.use("/", router);

// connecting to database:
connectToDatabase();



app.listen(port, () => {
console.log(`server has started ${port} `);

})