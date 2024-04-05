import { getPool } from "./bd"
import { RowDataPacket, ResultSetHeader } from "mysql2";

import { parseSqlFile, prepareStringForQuery } from "../utils/utils"

enum tableNameType {
    books = 'books',
    authors = "authors",
    id_pairs = "id_pairs"
}
type tableNameStrings = keyof typeof tableNameType

export async function getBookRecords(searchString?: string) {
    let pool = await getPool() 
    let preparedString = prepareStringForQuery(searchString)
    if (typeof searchString !== "undefined") {
        const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM books where concat_ws(title,author,description) like 
    ?  and is_delete = 0;`, [preparedString])
        return rows
    }

    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM books WHERE is_delete = 0`)
    return rows;
}
// Get any record by id 
export async function getBookRecord( id: number) {
    let pool =  await getPool();

    let queryRecord = await parseSqlFile("queryBook")

    const [rows] = await pool.execute(queryRecord, [id])

    return rows;
}

export async function incrementRecord(increment: "views" | "clicks", id: number) {
    let pool = await getPool();
    let queryBooksFields = await parseSqlFile("queryBooksViewsAndClicks");
    const [rows] = await pool.execute<RowDataPacket[]>(queryBooksFields, [id]);
    let success = false;
    try {
        switch (increment) {
            case "clicks": {
                if(typeof rows[0].clicks !== "undefined") {
                    let newClicks = `${rows[0].clicks + 1}`
                  
                    let incrementBookClicks = await parseSqlFile("incrementBookClicks");
                    let resultClicks = await pool.execute<RowDataPacket[]>(incrementBookClicks, [newClicks, id]);
                    success = true;
                }
                break;
            }
            case "views": {
                if (typeof rows[0].views !== "undefined") {
                    let newViews = `${rows[0].views + 1}`
                    let incrementBookViews = await parseSqlFile("incrementBookViews");
                    let resultViews = await pool.execute<RowDataPacket[]>(incrementBookViews, [newViews, id]);
                    success = true;
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
export async function createRecord(tableName: tableNameStrings, id: number, name: string | number) {
    let { firstColName, secondColName } = getTableFields(tableName)

    let pool = await getPool()
    let result = await pool.query<ResultSetHeader>(`INSERT INTO ?? (${firstColName},${secondColName}) 
        VALUES (?,?)`, [tableName, id, name]);
    return result[0];

}

export async function createBookRecord(book: { title: number, description: string, year: number, authors: string[] }) {
    try {
        let pool = await getPool();
        let authorsConcatString;
        if (book.authors.length > 1) {
            authorsConcatString = book.authors.reduce((prevAuthor, currentAuthor) => {
                return prevAuthor + ", " + currentAuthor;
            })
        } else {
            authorsConcatString = book.authors[0];
        }

        let result = await pool.query<ResultSetHeader>('INSERT INTO `books` (`title`,`description`,`year`,`author`) VALUES (?,?,?,?)', [book.title, book.description, book.year, authorsConcatString])

        let bookId = result[0].insertId;
        let authorsId: number[] = [];
        for (let author of book.authors) {
            let authorId = (await createAuthorRecord(author)).insertId;
            authorsId.push(authorId);
        }

        let affectedRows: number = 0;
        for (let authorId of authorsId) {
            affectedRows = (await createRecord("id_pairs", bookId, authorId)).affectedRows
        }


      
        if (affectedRows > 0) {
            console.log("Book connection were created")
            return bookId;
        } else {
            console.log("Book record failed to get created")
        }
    } catch (err) {
        console.log("Error during creation of the Book")
        console.log(err)
        return false;
    }
    return false;
}

export async function createAuthorRecord(name: string) {
    let pool = await getPool();
    let result = await pool.query<ResultSetHeader>('INSERT INTO `authors` (authors_name) VALUES (?)', [name]);
    return result[0];

}

export async function markRecordAsDeleted(id: number) {
    let pool = await getPool();
    let success = false;
    try {

        let markAsDeletedQuery = "UPDATE `books` SET `is_delete` = 1 WHERE `id` = ?";
        let [ResultSetHeader] = (await pool.execute<ResultSetHeader>(markAsDeletedQuery, [id])); 
        if(ResultSetHeader.affectedRows !== 0) {
            success = true;
        }
    } catch (error) {
        console.log(error)
        success = false;
    }

    return success;
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
            secondColName = "authors_name";;
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