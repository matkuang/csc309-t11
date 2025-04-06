const express = require("express");
const routes = require("./routes");
const cors = require('cors');
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use('', routes);

module.exports = app;