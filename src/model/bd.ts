import mysql, { RowDataPacket } from "mysql2";

import dotenv from 'dotenv';
import { parseSqlFile } from "../utils/utils"

dotenv.config()
enum tableNameType {
    books = 'books',
    authors = "authors",
    id_pairs = "id_pairs"
}
type tableNameStrings = keyof typeof tableNameType

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
}).promise();

export async function getRecords(tableName: tableNameStrings) {


    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ??`, [tableName])
    console.log(rows)
    return rows;
}

// Get any record by id 
export async function getRecord(tableName: tableNameStrings, id: number) {
    let { firstColName } = getTableFields(tableName)
    let queryRecord = await parseSqlFile("queryBook")
    console.log("queryRecord")
    // const [rows] = await pool.execute(queryRecord, [tableName, firstColName, id])
    const [rows] = await pool.execute(queryRecord, [id])

    return rows;
}
export async function createRecord(tableName: tableNameStrings, id: number, name: string | number) {
    let { firstColName, secondColName } = getTableFields(tableName)

    await pool.query(`INSERT INTO ?? (${firstColName},${secondColName}) 
        VALUES (?,?)`, [tableName, id, name])

}
export async function incrementRecord(increment: "views" | "clicks", id: number) {
    let queryBooksFields = await parseSqlFile("queryBooksViewsAndClicks");
    const [rows] = await pool.execute<RowDataPacket[]>(queryBooksFields, [id]);
    let success = true;
    try {
        switch (increment) {
            case "clicks": {
                if (rows[0].clicks) {
                    console.log("oldClicks: " + rows[0].clicks)
                    let newClicks = `${rows[0].clicks + 1}`
                    console.log("newClicks: " + newClicks)
                    let incrementBookClicks = await parseSqlFile("incrementBookClicks");
                    await pool.execute<RowDataPacket[]>(incrementBookClicks, [newClicks, id]);
                }
                break;
            }
            case "views": {
                if (rows[0].views) {
                    let newViews = `${rows[0].views + 1}`
                    let incrementBookViews = await parseSqlFile("incrementBookViews");

                    await pool.execute<RowDataPacket[]>(incrementBookViews, [newViews, id]);
                }
                break;
            }
        }
    } catch (error) {
        console.log(error)
        success = false;
    }

    return success;
}

export async function prefilTheDatabase() {
    try {
        let queryAuthors = await parseSqlFile("prefilAuthors")
        let queryBooks = await parseSqlFile("prefilBooks")
        let queryPairs = await parseSqlFile("prefilPairs")

        await pool.execute(queryAuthors)
        await pool.execute(queryBooks)
        await pool.execute(queryPairs)
    } catch (err) {
        console.log(err)
    }
}

export async function initDatabase() {
    console.group("initDatabase: ")
    let allTablesExist = await checkIfTableExist();
    console.log("allTablesExist")
    if (!allTablesExist) {
        await deleteTables();
        await createTables();

        await prefilTheDatabase();
    }
    console.groupEnd();
}
async function checkIfTableExist() {
    let areTablesExists = true;
    try {
        let dbName = process.env.DB_DATABASE;
        let sqlRequest = await parseSqlFile("isTableExists");
        console.log(`${sqlRequest}
        "dbName: "${dbName}`)
        let authorsExist = await pool.execute(sqlRequest, [dbName, `authors`])
        let booksExist = await pool.execute(sqlRequest, [dbName, `books`])
        let pairsExist = await pool.execute(sqlRequest, [dbName, `id_pairs`])

        if (!authorsExist || !booksExist || !pairsExist) {
            areTablesExists = false;
            console.log(`tables not exist: authorsExist:${authorsExist} booksExist:${booksExist} pairsExist: ${pairsExist} `)
        }

    } catch (error) {
        console.log(error)
    }
    return areTablesExists;
}

async function deleteTables() {
    let result
    try {
        let dropIfExists = await parseSqlFile("dropTableIfExist");
        result = await pool.execute(dropIfExists, ["authors", "books", "id_pairs"])
        console.log("deleteTables fires")
        console.log("Dropped tables: " + result)
    } catch (error) {
        console.log(error);
        console.log(result);
        throw error;
    }

}
async function createTables() {
    try {
        let createBookTableRq = await parseSqlFile("createBookTable");
        let createAutorsTable = await parseSqlFile("createAuthorsTable");
        let createPairsTable = await parseSqlFile("createPairsTable");

        await pool.execute<RowDataPacket[]>(createBookTableRq)
        await pool.execute<RowDataPacket[]>(createAutorsTable)
        await pool.execute<RowDataPacket[]>(createPairsTable)
        console.log("createTables fires")
    } catch (error) {
        console.log(error)
        throw error;

    }
    return true;
}




function getTableFields(tableName: tableNameStrings) {
    let firstColName: string;
    let secondColName: string;
    switch (tableName) {
        case "books": {
            firstColName = "id";
            secondColName = "book_title";
            break;
        }
        case "authors": {
            firstColName = "authors_id";
            secondColName = "authors_title";;
            break;
        }
        case "id_pairs": {
            firstColName = "book_id";
            secondColName = "authors_id";;
            break;
        }
    }

    return { firstColName, secondColName };

}