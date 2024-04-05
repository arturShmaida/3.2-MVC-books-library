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
exports.UserController = void 0;
const libraryModel_js_1 = require("../model/libraryModel.js");
const view_js_1 = require("../view/view.js");
;
exports.UserController = {
    handleLibraryRenderRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { offset, search, limit } = req.query;
            if (limit === undefined)
                limit = 20;
            if (offset === undefined || offset < 0)
                offset = 0;
            try {
                let totalBooks = yield (0, libraryModel_js_1.getBookRecords)(search);
                let booksTotalCount = totalBooks.length;
                if (booksTotalCount < (offset - 1)) {
                    offset = 0;
                }
                let books = totalBooks.splice(offset, limit);
                let drawInfo = { booksTotalCount, offset, search, limit };
                view_js_1.View.renderLibraryPage(books, drawInfo, res);
            }
            catch (err) {
                console.log(err);
                view_js_1.View.renderPageNotFound(res, search);
            }
        });
    },
    handleBookRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book_id } = req.params;
            // Look up for this object on DB
            try {
                let bookPacket = yield (0, libraryModel_js_1.getBookRecord)(Number(book_id));
                console.log("bookPacket");
                console.log(bookPacket);
                if ((Array.isArray(bookPacket) && bookPacket.length !== 0)) {
                    console.log(typeof bookPacket);
                    console.log(bookPacket);
                    (0, libraryModel_js_1.incrementRecord)("views", Number(book_id));
                    view_js_1.View.renderBookPage(bookPacket, res);
                }
                else {
                    view_js_1.View.renderPageNotFound(res);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    handleBookClicksIncrement: function name(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book_id } = req.params;
            try {
                let success = yield (0, libraryModel_js_1.incrementRecord)("clicks", Number(book_id));
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
