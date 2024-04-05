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
exports.createBackup = exports.initDatabase = exports.prefilTheDatabase = exports.deleteTheBookRecord = exports.deleteAuthorsIfnoMultipleConnections = exports.deleteMarkedRecordsConnections = exports.getDeletedRecordsIdArray = exports.getPool = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const mysqldump_1 = __importDefault(require("mysqldump"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../utils/utils");
dotenv_1.default.config();
const databaseName = process.env.DB_DATABASE;
const pool = mysql2_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: databaseName,
    multipleStatements: true
}).promise();
function getPool() {
    return __awaiter(this, void 0, void 0, function* () {
        return pool;
    });
}
exports.getPool = getPool;
function getDeletedRecordsIdArray() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let deleteQuery = "SELECT `id` FROM `books` WHERE is_delete = 1";
            let result = yield pool.execute(deleteQuery);
            return result[0];
        }
        catch (err) {
            console.log("error getDeletedRecordsIdArray");
            console.log(err);
        }
    });
}
exports.getDeletedRecordsIdArray = getDeletedRecordsIdArray;
function deleteMarkedRecordsConnections() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let bookRecordIdArray = yield getDeletedRecordsIdArray();
            if (typeof bookRecordIdArray === "undefined") {
                return;
            }
            for (let bookId of bookRecordIdArray) {
                yield deleteTheBookRecord(bookId.id);
                yield deleteAuthorsIfnoMultipleConnections(bookId.id);
                yield deleteTheConnection(bookId.id);
            }
        }
        catch (err) {
            console.log("error delete deleteMarkedRecords..");
            console.log(err);
        }
    });
}
exports.deleteMarkedRecordsConnections = deleteMarkedRecordsConnections;
function deleteAuthorsIfnoMultipleConnections(bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let auhorIdQuery = `SELECT authors_id FROM id_pairs WHERE book_id = ${bookId}`;
            let [[{ authors_id }]] = yield pool.execute(auhorIdQuery);
            let authorsNameQuery = `SELECT authors_name FROM authors WHERE authors_id = ${authors_id}`;
            let [[{ authors_name }]] = yield pool.execute(authorsNameQuery);
            let deleteQuery = `DELETE FROM authors WHERE authors_id = ${authors_id} AND authors_name NOT IN (SELECT author FROM  books WHERE author LIKE '${authors_name}')`;
            let deleteResult = yield pool.execute(deleteQuery);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteAuthorsIfnoMultipleConnections = deleteAuthorsIfnoMultipleConnections;
function deleteTheConnection(bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let deleteQuery = `DELETE FROM id_pairs WHERE book_id = ${bookId};`;
            let deleteResult = yield pool.execute(deleteQuery);
            return deleteResult;
        }
        catch (err) {
            console.log("error deleteTheConnection");
            console.log(err);
        }
    });
}
function deleteTheBookRecord(bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let deleteQuery = `DELETE FROM books WHERE id = ${bookId};`;
            let deleteResult = yield pool.execute(deleteQuery);
            return deleteResult;
        }
        catch (err) {
            console.log("error deleteTheBookRecord");
            console.log(err);
        }
    });
}
exports.deleteTheBookRecord = deleteTheBookRecord;
function prefilTheDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let queryAuthors = yield (0, utils_1.parseSqlFile)("prefilAuthors");
            let queryBooks = yield (0, utils_1.parseSqlFile)("prefilBooks");
            let queryPairs = yield (0, utils_1.parseSqlFile)("prefilPairs");
            yield pool.execute(queryAuthors);
            yield pool.execute(queryBooks);
            yield pool.execute(queryPairs);
            console.log("The database was prefilled after");
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.prefilTheDatabase = prefilTheDatabase;
function initDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let createDataBaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
        yield pool.execute(createDataBaseQuery);
        let allTablesExist = yield checkIfTableExist();
        if (!allTablesExist) {
            yield deleteTables();
            yield createTables();
            yield prefilTheDatabase();
        }
    });
}
exports.initDatabase = initDatabase;
function checkIfTableExist() {
    return __awaiter(this, void 0, void 0, function* () {
        let areTablesExists = false;
        try {
            let dbName = process.env.DB_DATABASE;
            let [authorsExist] = yield pool.execute(`SHOW TABLES FROM ${dbName} LIKE ${'"authors"'}`);
            let [booksExist] = yield pool.execute(`SHOW TABLES FROM ${dbName} LIKE ${'"books"'}`);
            let [pairsExist] = yield pool.execute(`SHOW TABLES FROM ${dbName} LIKE ${'"id_pairs"'}`);
            if (authorsExist.length && booksExist.length && pairsExist.length) {
                areTablesExists = true;
            }
            else {
                console.log(`!checkIfTableExist: Tables found missing!`);
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
            console.log("!deleteTables: Dropping tables ");
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
            console.log(" createTables: Created Book, Author, Pairs Tables");
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        return true;
    });
}
function createBackup() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
            console.log("Backup creation faliled do to missing .env variables");
            return;
        }
        try {
            let dupmFileName = `${(0, utils_1.getBasePath)()}/dbDump/${Math.round(Date.now() / 1000)}.dump.sql`;
            (0, mysqldump_1.default)({
                connection: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                },
                dumpToFile: dupmFileName
            });
            console.log("Backup dump created successfuly!");
        }
        catch (err) {
            console.log("Backup creation faliled");
            console.log(err);
        }
    });
}
exports.createBackup = createBackup;
