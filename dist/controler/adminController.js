"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const libraryModel_js_1 = require("../model/libraryModel.js");
const utils_js_1 = require("../utils/utils.js");
const view_js_1 = require("../view/view.js");
exports.AdminController = {
    handleAdminPageRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let requestedPage = req.query.page;
                if (!requestedPage) {
                    requestedPage = 1;
                }
                let itemsLoadLimit = 10;
                let offset = (requestedPage - 1) * itemsLoadLimit;
                let totalBooks = yield (0, libraryModel_js_1.getBookRecords)();
                let books = totalBooks.splice(offset, itemsLoadLimit);
                let drawInfo = { totalBooks, itemsLoadLimit };
                view_js_1.View.renderAdminPage(books, drawInfo, res);
            }
            catch (err) {
                console.log(err);
                view_js_1.View.renderPageNotFound(res);
            }
        });
    },
    handleNewItemCreationRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.baseUrl);
                console.log(req.body);
                console.log(req.body.authorOne);
                const files = req.files;
                if (!files || !files.image) {
                    return res.status(400).send({ error: "No Image sent" });
                }
                const { image } = files;
                if (Array.isArray(image)) {
                    return res.status(400).send({ error: "Accept only one image per request" });
                }
                if (!/^image/.test(image.mimetype)) {
                }
                let imageType = (0, utils_js_1.getImageType)(image.name);
                if (imageType === "") {
                    return res.status(400).send({ error: "Unsupported image type" });
                }
                console.log("no error with image");
                const { title, year, description, authorOne, authorTwo, authorThree } = req.body;
                let authors = [authorOne];
                authorTwo ? authors.push(authorTwo) : 0;
                authorThree ? authors.push(authorThree) : 0;
                let bookId = yield (0, libraryModel_js_1.createBookRecord)({ title, description, year, authors });
                console.log(image);
                if (!!bookId) {
                    image.mv((0, utils_js_1.getBasePath)() + "/resourses/img/books/" + bookId + imageType);
                }
                res.status(201).send({ success: true });
                console.log("book added succesfuly");
            }
            catch (err) {
                console.log(err);
                res.status(500).send({ err });
            }
        });
    },
    handleItemMarkAsDeleteRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book_id } = req.params;
            console.log("book id to delete: " + book_id);
            console.log(req.params);
            console.log(req.params.book_id);
            try {
                let success = yield (0, libraryModel_js_1.markRecordAsDeleted)(Number(book_id));
                console.log(success);
                if (success) {
                    res.status(200).send({ success: true });
                }
                else {
                    res.status(204).send({ success: false });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).send({ err });
            }
        });
    }
};
