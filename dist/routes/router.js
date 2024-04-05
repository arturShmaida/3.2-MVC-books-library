"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controler/userController");
const adminController_1 = require("../controler/adminController");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const path_1 = __importDefault(require("path"));
exports.router = express_1.default.Router();
exports.authRouter = express_1.default.Router();
exports.authRouter
    .use("/admin", (0, express_basic_auth_1.default)({
    users: { 'admin': 'pass' },
    challenge: true
}))
    .get('/admin/?', adminController_1.AdminController.handleAdminPageRequest)
    .post('/admin/api/v1/bookUpload', adminController_1.AdminController.handleNewItemCreationRequest)
    .get("/admin/api/v1/books/delete/:book_id", adminController_1.AdminController.handleItemMarkAsDeleteRequest);
exports.router
    .get("/?", userController_1.UserController.handleLibraryRenderRequest)
    .get("/book/:book_id", userController_1.UserController.handleBookRequest)
    .patch("/book/:book_id", userController_1.UserController.handleBookClicksIncrement)
    // .use("/static", express.static(path.join(__dirname + "../../../src/view/public")))
    // .use("/static", express.static(path.join(__dirname + "../../../src/view/public")))
    // .use("/static", express.static(path.join(__dirname + "../../../dist/view/public")))
    .use("/static", express_1.default.static(path_1.default.join(__dirname + "../../../resourses"), { fallthrough: false }));
