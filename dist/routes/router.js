"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controler/userController");
exports.router = express_1.default.Router();
exports.router
    .get("/?", userController_1.UserController.handleLibraryRenderRequest)
    .get("/book/:book_id", userController_1.UserController.handleBookRequest)
    .patch("/book/:book_id", userController_1.UserController.handleBookClicksIncrement);
// .get('/api/v1/',LibraryController.handleLibraryRequest)
// .get('/admin/api/v1/',LibraryController.handleLibraryRequest)
