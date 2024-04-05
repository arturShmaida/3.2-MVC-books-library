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
exports.markRecordAsDeleted = exports.createAuthorRecord = exports.createBookRecord = exports.createRecord = exports.incrementRecord = exports.getBookRecord = exports.getBookRecords = void 0;
const bd_1 = require("./bd");
const utils_1 = require("../utils/utils");
var tableNameType;
(function (tableNameType) {
    tableNameType["books"] = "books";
    tableNameType["authors"] = "authors";
    tableNameType["id_pairs"] = "id_pairs";
})(tableNameType || (tableNameType = {}));
function getBookRecords(searchString) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield (0, bd_1.getPool)();
        let preparedString = (0, utils_1.prepareStringForQuery)(searchString);
        if (typeof searchString !== "undefined") {
            const [rows] = yield pool.execute(`SELECT * FROM books where concat_ws(title,author,description) like 
    ?  and is_delete = 0;`, [preparedString]);
            return rows;
        }
        const [rows] = yield pool.query(`SELECT * FROM books WHERE is_delete = 0`);
        return rows;
    });
}
exports.getBookRecords = getBookRecords;
// Get any record by id 
function getBookRecord(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield (0, bd_1.getPool)();
        let queryRecord = yield (0, utils_1.parseSqlFile)("queryBook");
        const [rows] = yield pool.execute(queryRecord, [id]);
        return rows;
    });
}
exports.getBookRecord = getBookRecord;
function incrementRecord(increment, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield (0, bd_1.getPool)();
        let queryBooksFields = yield (0, utils_1.parseSqlFile)("queryBooksViewsAndClicks");
        const [rows] = yield pool.execute(queryBooksFields, [id]);
        let success = false;
        try {
            switch (increment) {
                case "clicks": {
                    if (typeof rows[0].clicks !== "undefined") {
                        let newClicks = `${rows[0].clicks + 1}`;
                        let incrementBookClicks = yield (0, utils_1.parseSqlFile)("incrementBookClicks");
                        let resultClicks = yield pool.execute(incrementBookClicks, [newClicks, id]);
                        success = true;
                    }
                    break;
                }
                case "views": {
                    if (typeof rows[0].views !== "undefined") {
                        let newViews = `${rows[0].views + 1}`;
                        let incrementBookViews = yield (0, utils_1.parseSqlFile)("incrementBookViews");
                        let resultViews = yield pool.execute(incrementBookViews, [newViews, id]);
                        success = true;
                    }
                    break;
                }
            }
        }
        catch (error) {
            console.log(error);
            success = false;
        }
        return success;
    });
}
exports.incrementRecord = incrementRecord;
function createRecord(tableName, id, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let { firstColName, secondColName } = getTableFields(tableName);
        let pool = yield (0, bd_1.getPool)();
        let result = yield pool.query(`INSERT INTO ?? (${firstColName},${secondColName}) 
        VALUES (?,?)`, [tableName, id, name]);
        return result[0];
    });
}
exports.createRecord = createRecord;
function createBookRecord(book) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let pool = yield (0, bd_1.getPool)();
            let authorsConcatString;
            if (book.authors.length > 1) {
                authorsConcatString = book.authors.reduce((prevAuthor, currentAuthor) => {
                    return prevAuthor + ", " + currentAuthor;
                });
            }
            else {
                authorsConcatString = book.authors[0];
            }
            let result = yield pool.query('INSERT INTO `books` (`title`,`description`,`year`,`author`) VALUES (?,?,?,?)', [book.title, book.description, book.year, authorsConcatString]);
            let bookId = result[0].insertId;
            let authorsId = [];
            for (let author of book.authors) {
                let authorId = (yield createAuthorRecord(author)).insertId;
                authorsId.push(authorId);
            }
            let affectedRows = 0;
            for (let authorId of authorsId) {
                affectedRows = (yield createRecord("id_pairs", bookId, authorId)).affectedRows;
            }
            if (affectedRows > 0) {
                console.log("Book connection were created");
                return bookId;
            }
            else {
                console.log("Book record failed to get created");
            }
        }
        catch (err) {
            console.log("Error during creation of the Book");
            console.log(err);
            return false;
        }
        return false;
    });
}
exports.createBookRecord = createBookRecord;
function createAuthorRecord(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield (0, bd_1.getPool)();
        let result = yield pool.query('INSERT INTO `authors` (authors_name) VALUES (?)', [name]);
        return result[0];
    });
}
exports.createAuthorRecord = createAuthorRecord;
function markRecordAsDeleted(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let pool = yield (0, bd_1.getPool)();
        let success = false;
        try {
            let markAsDeletedQuery = "UPDATE `books` SET `is_delete` = 1 WHERE `id` = ?";
            let [ResultSetHeader] = (yield pool.execute(markAsDeletedQuery, [id]));
            if (ResultSetHeader.affectedRows !== 0) {
                success = true;
            }
        }
        catch (error) {
            console.log(error);
            success = false;
        }
        return success;
    });
}
exports.markRecordAsDeleted = markRecordAsDeleted;
function getTableFields(tableName) {
    let firstColName;
    let secondColName;
    switch (tableName) {
        case "books": {
            firstColName = "id";
            secondColName = "book_title";
            break;
        }
        case "authors": {
            firstColName = "authors_id";
            secondColName = "authors_name";
            ;
            break;
        }
        case "id_pairs": {
            firstColName = "book_id";
            secondColName = "authors_id";
            ;
            break;
        }
    }
    return { firstColName, secondColName };
}
