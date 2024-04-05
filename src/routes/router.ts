import express from 'express';
import { UserController } from '../controler/userController';
import { AdminController } from '../controler/adminController';
import basicAuth from 'express-basic-auth';
import path from 'path';

export const router = express.Router();
export const authRouter = express.Router();

authRouter
    .use("/admin",basicAuth({
        users: { 'admin': 'pass' },
        challenge: true
    }))
    .get('/admin/?', AdminController.handleAdminPageRequest)
    .post('/admin/api/v1/bookUpload', AdminController.handleNewItemCreationRequest)
    .get("/admin/api/v1/books/delete/:book_id", AdminController.handleItemMarkAsDeleteRequest);

router
    .get("/?", UserController.handleLibraryRenderRequest)
    .get("/book/:book_id", UserController.handleBookRequest)
    .patch("/book/:book_id", UserController.handleBookClicksIncrement)
    // .use("/static", express.static(path.join(__dirname + "../../../src/view/public")))
    // .use("/static", express.static(path.join(__dirname + "../../../src/view/public")))
    // .use("/static", express.static(path.join(__dirname + "../../../dist/view/public")))
    .use("/static", express.static(path.join(__dirname + "../../../resourses"), { fallthrough: false }));


