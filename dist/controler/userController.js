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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const path_1 = __importDefault(require("path"));
const bd_js_1 = require("../model/bd.js");
;
// const testObject: Book = {
//     id: "22",
//     author: "Андрей Богуславский",
//     pages: 351,
//     title: "СИ++ И КОМПЬЮТЕРНАЯ ГРАФИКА",
//     description: "Лекции и практикум по программированию на Си++",
// }
const booksCount = 52;
exports.UserController = {
    handleLibraryRenderRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { offset, search, limit } = req.query;
            if (limit === undefined)
                limit = 10;
            if (offset === undefined)
                offset = 0;
            try {
                let pathToPage = path_1.default.join(__dirname + "../../../src/view/pages/books-page");
                let totalBooks = yield (0, bd_js_1.getRecords)("books");
                let books = totalBooks.splice(offset, limit);
                let booksTotalCount = totalBooks.length;
                let currentCount = +offset + limit;
                let btnState = updatePageBtnState(currentCount, booksTotalCount);
                let previousPage = btnState[0];
                let nextPage = btnState[1];
                res.render(pathToPage, { books, previousPage, nextPage, offset });
            }
            catch (err) {
                console.log(err);
                res.render(path_1.default.join(__dirname + "../../../src/view/pages/page-not-found"));
            }
        });
    },
    handleLibraryRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // seach is filter
            const { offset, search, author, year, limit } = req.query;
            console.log("offset: " + req.query.offset, "limit: " + limit);
            (!!req.query.offset) ? req.query.offset = req.query.offset : req.query.offset = 0;
            console.log("Processing request of books:");
            try {
                let books = yield (0, bd_js_1.getRecords)("books");
                let responseData;
                // console.log(books)
                responseData = Object.assign(Object.assign({}, req.query), { data: {
                        books,
                        total: {
                            amount: booksCount
                        }
                    }, success: true });
                res.status(200).send(responseData);
                console.log("Ending request");
            }
            catch (err) {
                res.status(500).send({ error: err });
            }
        });
    },
    // /books/{book_id}
    handleBookRequest: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book_id } = req.params;
            // Look up for this object on DB
            try {
                let bookPacket = yield (0, bd_js_1.getRecord)("books", Number(book_id));
                (0, bd_js_1.incrementRecord)("views", Number(book_id));
                console.log(bookPacket);
                if (book_id) {
                    res.render(path_1.default.join(__dirname + "../../../src/view/pages/book-page"), bookPacket[0]);
                }
                else {
                    res.render(path_1.default.join(__dirname + "../../../src/view/pages/page-not-found"));
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
                let success = yield (0, bd_js_1.incrementRecord)("clicks", Number(book_id));
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
function updatePageBtnState(currentCount, totalCount) {
    let limitOnPage = 10;
    let prev = 0;
    let next = 1;
    let btnState = [false, false];
    if (currentCount < totalCount) {
        btnState[next] = true;
        if (currentCount <= limitOnPage) {
            btnState[prev] = false;
        }
        else {
            btnState[prev] = true;
        }
    }
    else if (currentCount === totalCount) {
        btnState[next] = false;
        if (currentCount <= limitOnPage) {
            btnState[prev] = false;
        }
    }
    else {
        btnState[next] = false;
        btnState[prev] = true;
    }
    return btnState;
}
