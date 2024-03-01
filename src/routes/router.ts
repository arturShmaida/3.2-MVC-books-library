import express from 'express';
import { UserController } from '../controler/userController';
import {AdminController } from '../controler/adminController';
export const router = express.Router();

router
    .get("/?", UserController.handleLibraryRenderRequest)
    .get("/book/:book_id", UserController.handleBookRequest)
    .patch("/book/:book_id", UserController.handleBookClicksIncrement)
    .get('/admin',AdminController.handleAdminPageRenderRequest)
    // .get('/admin/api/v1/',AdminController)
    