import mysql, { RowDataPacket,ResultSetHeader} from "mysql2";
import mySqlDump from "mysqldump";
import dotenv from 'dotenv';
import { parseSqlFile, getBasePath } from "../utils/utils"

dotenv.config()

const databaseName = process.env.DB_DATABASE;
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: databaseName,
    multipleStatements: true
}).promise();

export async function getPool() {
    return pool;
}

export async function getDeletedRecordsIdArray() {
    try {
        let deleteQuery = "SELECT `id` FROM `books` WHERE is_delete = 1";
        let result = await pool.execute<RowDataPacket[]>(deleteQuery)
      
        return result[0]
    } catch (err) {
        console.log("error getDeletedRecordsIdArray")
        console.log(err)
    }

}

export async function deleteMarkedRecordsConnections() {
    try {
        let bookRecordIdArray: RowDataPacket[] | undefined = await getDeletedRecordsIdArray()
        if (typeof bookRecordIdArray === "undefined") {
            return;
        }
        for (let bookId of bookRecordIdArray) {
            await deleteTheBookRecord(bookId.id);
            await deleteAuthorsIfnoMultipleConnections(bookId.id)
            await deleteTheConnection(bookId.id);
        }

    } catch (err) {
        console.log("error delete deleteMarkedRecords..")
        console.log(err)
    }
}

export async function deleteAuthorsIfnoMultipleConnections(bookId: number) {
    try {
        let auhorIdQuery = `SELECT authors_id FROM id_pairs WHERE book_id = ${bookId}`;
        let [[{ authors_id }]] = await pool.execute<RowDataPacket[]>(auhorIdQuery);
      


        let authorsNameQuery = `SELECT authors_name FROM authors WHERE authors_id = ${authors_id}`;
        let [[{ authors_name }]] = await pool.execute<RowDataPacket[]>(authorsNameQuery);

        let deleteQuery = `DELETE FROM authors WHERE authors_id = ${authors_id} AND authors_name NOT IN (SELECT author FROM  books WHERE author LIKE '${authors_name}')`
        let deleteResult = await pool.execute<RowDataPacket[]>(deleteQuery);

    } catch (err) {

        console.log(err)
    }
}

async function deleteTheConnection(bookId: number) {
    try {
        let deleteQuery = `DELETE FROM id_pairs WHERE book_id = ${bookId};`
        let deleteResult = await pool.execute<RowDataPacket[]>(deleteQuery);
      
        return deleteResult;
    } catch (err) {
        console.log("error deleteTheConnection");
        console.log(err);
    }
}

export async function deleteTheBookRecord(bookId: number) {
    try {
        let deleteQuery = `DELETE FROM books WHERE id = ${bookId};`
        let deleteResult = await pool.execute<RowDataPacket[]>(deleteQuery);
        
        return deleteResult;
    } catch (err) {
        console.log("error deleteTheBookRecord");
        console.log(err);
    }
}

export async function prefilTheDatabase() {
    try {
        let queryAuthors = await parseSqlFile("prefilAuthors")
        let queryBooks = await parseSqlFile("prefilBooks")
        let queryPairs = await parseSqlFile("prefilPairs")

        await pool.execute(queryAuthors)
        await pool.execute(queryBooks)
        await pool.execute(queryPairs)
        console.log("The database was prefilled after")
    } catch (err) {
        console.log(err)
    }
}

export async function initDatabase() { 
    
    let createDataBaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
    await pool.execute(createDataBaseQuery);
    let allTablesExist = await checkIfTableExist();
    if (!allTablesExist) {
        await deleteTables();
        await createTables();
        await prefilTheDatabase();
    }
}

async function checkIfTableExist() {
    let areTablesExists = false;
    try {
        let dbName = process.env.DB_DATABASE;
        
        let [authorsExist] = await pool.execute<ResultSetHeader[]>(`SHOW TABLES FROM ${dbName} LIKE ${'"authors"'}`)
        

        let [booksExist] =await pool.execute<ResultSetHeader[]>(`SHOW TABLES FROM ${dbName} LIKE ${'"books"'}`)
        let [pairsExist] = await pool.execute<ResultSetHeader[]>(`SHOW TABLES FROM ${dbName} LIKE ${'"id_pairs"'}`)
        

        if (authorsExist.length && booksExist.length && pairsExist.length) {
            areTablesExists = true;
        } else{
            console.log(`!checkIfTableExist: Tables found missing!`)
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
        console.log("!deleteTables: Dropping tables ")

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
        console.log(" createTables: Created Book, Author, Pairs Tables")
    } catch (error) {
        console.log(error)
        throw error;

    }
    return true;
}

export async function createBackup() {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
        console.log("Backup creation faliled do to missing .env variables")
        return;
    }

    try {
        let dupmFileName = `${getBasePath()}/dbDump/${Math.round(Date.now() / 1000)}.dump.sql`
        mySqlDump({
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            },
            dumpToFile: dupmFileName
        });

        console.log("Backup dump created successfuly!")
    } catch (err) {
        console.log("Backup creation faliled")
        console.log(err)
    }
}
