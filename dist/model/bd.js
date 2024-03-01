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
exports.initDatabase = exports.prefilTheDatabase = exports.incrementRecord = exports.createRecord = exports.getRecord = exports.getRecords = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../utils/utils");
dotenv_1.default.config();
var tableNameType;
(function (tableNameType) {
    tableNameType["books"] = "books";
    tableNameType["authors"] = "authors";
    tableNameType["id_pairs"] = "id_pairs";
})(tableNameType || (tableNameType = {}));
const pool = mysql2_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
}).promise();
function getRecords(tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield pool.query(`SELECT * FROM ??`, [tableName]);
        console.log(rows);
        return rows;
    });
}
exports.getRecords = getRecords;
// Get any record by id 
function getRecord(tableName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let { firstColName } = getTableFields(tableName);
        let queryRecord = yield (0, utils_1.parseSqlFile)("queryBook");
        console.log("queryRecord");
        // const [rows] = await pool.execute(queryRecord, [tableName, firstColName, id])
        const [rows] = yield pool.execute(queryRecord, [id]);
        return rows;
    });
}
exports.getRecord = getRecord;
function createRecord(tableName, id, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let { firstColName, secondColName } = getTableFields(tableName);
        yield pool.query(`INSERT INTO ?? (${firstColName},${secondColName}) 
        VALUES (?,?)`, [tableName, id, name]);
    });
}
exports.createRecord = createRecord;
function incrementRecord(increment, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryBooksFields = yield (0, utils_1.parseSqlFile)("queryBooksViewsAndClicks");
        const [rows] = yield pool.execute(queryBooksFields, [id]);
        let success = true;
        try {
            switch (increment) {
                case "clicks": {
                    if (rows[0].clicks) {
                        console.log("oldClicks: " + rows[0].clicks);
                        let newClicks = `${rows[0].clicks + 1}`;
                        console.log("newClicks: " + newClicks);
                        let incrementBookClicks = yield (0, utils_1.parseSqlFile)("incrementBookClicks");
                        yield pool.execute(incrementBookClicks, [newClicks, id]);
                    }
                    break;
                }
                case "views": {
                    if (rows[0].views) {
                        let newViews = `${rows[0].views + 1}`;
                        let incrementBookViews = yield (0, utils_1.parseSqlFile)("incrementBookViews");
                        yield pool.execute(incrementBookViews, [newViews, id]);
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
function prefilTheDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let queryAuthors = yield (0, utils_1.parseSqlFile)("prefilAuthors");
            let queryBooks = yield (0, utils_1.parseSqlFile)("prefilBooks");
            let queryPairs = yield (0, utils_1.parseSqlFile)("prefilPairs");
            yield pool.execute(queryAuthors);
            yield pool.execute(queryBooks);
            yield pool.execute(queryPairs);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.prefilTheDatabase = prefilTheDatabase;
function initDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.group("initDatabase: ");
        let allTablesExist = yield checkIfTableExist();
        console.log("allTablesExist");
        if (!allTablesExist) {
            yield deleteTables();
            yield createTables();
            yield prefilTheDatabase();
        }
        console.groupEnd();
    });
}
exports.initDatabase = initDatabase;
function checkIfTableExist() {
    return __awaiter(this, void 0, void 0, function* () {
        let areTablesExists = true;
        try {
            let dbName = process.env.DB_DATABASE;
            let sqlRequest = yield (0, utils_1.parseSqlFile)("isTableExists");
            console.log(`${sqlRequest}
        "dbName: "${dbName}`);
            let authorsExist = yield pool.execute(sqlRequest, [dbName, `authors`]);
            let booksExist = yield pool.execute(sqlRequest, [dbName, `books`]);
            let pairsExist = yield pool.execute(sqlRequest, [dbName, `id_pairs`]);
            if (!authorsExist || !booksExist || !pairsExist) {
                areTablesExists = false;
                console.log(`tables not exist: authorsExist:${authorsExist} booksExist:${booksExist} pairsExist: ${pairsExist} `);
            }
        }
        catch (error) {
            console.log(error);
        }
        return areTablesExists;
    });
}
function deleteTables() {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            let dropIfExists = yield (0, utils_1.parseSqlFile)("dropTableIfExist");
            result = yield pool.execute(dropIfExists, ["authors", "books", "id_pairs"]);
            console.log("deleteTables fires");
            console.log("Dropped tables: " + result);
        }
        catch (error) {
            console.log(error);
            console.log(result);
            throw error;
        }
    });
}
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createBookTableRq = yield (0, utils_1.parseSqlFile)("createBookTable");
            let createAutorsTable = yield (0, utils_1.parseSqlFile)("createAuthorsTable");
            let createPairsTable = yield (0, utils_1.parseSqlFile)("createPairsTable");
            yield pool.execute(createBookTableRq);
            yield pool.execute(createAutorsTable);
            yield pool.execute(createPairsTable);
            console.log("createTables fires");
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        return true;
    });
}
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
            secondColName = "authors_title";
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
