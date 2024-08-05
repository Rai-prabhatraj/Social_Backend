const { config } = require("dotenv");
const express = require('express');
const mongoose = require('mongoose');
const connectDatabase = require('./src/db/database'); 

config();
connectDatabase();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, ()=>{
    console.log(`Server started successfully in ${NODE_ENV} at PORT - ${PORT}`)
})
