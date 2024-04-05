"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const router_js_1 = require("./routes/router.js");
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_js_1 = require("./utils/errorHandler.js");
const scheduled_js_1 = require("./utils/scheduled.js");
const bd_js_1 = require("./model/bd.js");
const morgan_1 = __importDefault(require("morgan"));
const jsonParser = body_parser_1.default.json();
dotenv_1.default.config();
(0, bd_js_1.initDatabase)();
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use((0, morgan_1.default)('tiny'));
app.use(errorHandler_js_1.errorHandler);
app.use((0, express_fileupload_1.default)({
    limits: {
        fileSize: 10000000,
    },
    abortOnLimit: true,
}));
app.use(jsonParser);
app.use(router_js_1.router);
app.use(router_js_1.authRouter);
(0, scheduled_js_1.startDBScheduledJobs)();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port localhost:${process.env.PORT}`);
});
