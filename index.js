"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
require("express-async-errors");
var cors = require("cors");
var express_1 = require("express");
var app = express();
app.use(cors({
    origin: config.corsOrigin,
}));
app.use((0, express_1.json)());
//routes
app.listen(3001, '0.0.0.0', function () { return console.log('Server is running on port 3000'); });
