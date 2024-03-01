"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router_js_1 = require("./routes/router.js");
const dotenv_1 = __importDefault(require("dotenv"));
const bd_js_1 = require("./model/bd.js");
const morgan = require('morgan');
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(morgan('tiny'));
app.use(express_1.default.static(path_1.default.join(__dirname + "../../src/view/public")));
app.use(express_1.default.static(path_1.default.join(__dirname + "../../src/view/public")));
app.use(express_1.default.static(path_1.default.join(__dirname + "../../dist/view/public")));
app.use(router_js_1.router);
(0, bd_js_1.initDatabase)();
app.listen(port, () => {
    console.log(`Listening on port localhost:${process.env.PORT}`);
});
