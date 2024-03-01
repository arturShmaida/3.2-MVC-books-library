import { type NextFunction, type Request, type Response } from "express";
import path from "path";
import { createRecord, getRecords, getRecord, incrementRecord } from "../model/bd.js"
import { RowDataPacket } from "mysql2";
interface Book {
    id: string,
    title: string,
    author: string,
    description?: string,
    year?: string,
    pages?: number,
    date?: number | null,
    isbn?: string
};
// const testObject: Book = {
//     id: "22",
//     author: "Андрей Богуславский",
//     pages: 351,
//     title: "СИ++ И КОМПЬЮТЕРНАЯ ГРАФИКА",
//     description: "Лекции и практикум по программированию на Си++",
// }
const booksCount = 52;
export const UserController = {

    handleLibraryRenderRequest: async function <Request extends { query: { offset: number, search?: string, limit?: number } }>
        (req: Request, res: Response) {
        let { offset, search, limit } = req.query;
        if (limit === undefined) limit = 10;
        if (offset === undefined) offset = 0;
        try {
            let pathToPage = path.join(__dirname + "../../../src/view/pages/books-page");
            let totalBooks = await getRecords("books");

            let books = totalBooks.splice(offset, limit)



            let booksTotalCount: number = totalBooks.length;
            let currentCount: number = +offset + limit;

            let btnState = updatePageBtnState(currentCount, booksTotalCount)
            let previousPage = btnState[0]
            let nextPage = btnState[1]
            res.render(pathToPage, { books, previousPage, nextPage, offset });
        } catch (err) {
            console.log(err)
            res.render(path.join(__dirname + "../../../src/view/pages/page-not-found"));
        }
    },
    handleLibraryRequest: async function <Request extends { query: { offset: number, limit: number, search?: string, author?: string, year?: number } }>
        (req: Request, res: Response) {
        // seach is filter
        const { offset, search, author, year, limit } = req.query;
        console.log("offset: " + req.query.offset, "limit: " + limit);
        (!!req.query.offset) ? req.query.offset = req.query.offset : req.query.offset = 0;
        console.log("Processing request of books:")

        try {
            let books: any = await getRecords("books");


            let responseData: {
                offset: number,
                search?: string,
                author?: string,
                year?: number,
                data: {
                    books: typeof books,
                    total: {
                        amount: number
                    }
                }
                success: true | false;
            }
            // console.log(books)
            responseData = {
                ...req.query,
                data: {
                    books,
                    total: {
                        amount: booksCount
                    }
                },
                success: true
            }
            res.status(200).send(responseData);
            console.log("Ending request")
        } catch (err: any) {
            res.status(500).send({ error: err })
        }
    },
    // /books/{book_id}
    handleBookRequest: async function (req: Request, res: Response) {
        const { book_id } = req.params;
        // Look up for this object on DB

        try {
            let bookPacket: Book[] | any = await getRecord("books", Number(book_id));
            incrementRecord("views", Number(book_id));
            console.log(bookPacket)
            if (book_id) {
                res.render(path.join(__dirname + "../../../src/view/pages/book-page"), bookPacket[0]);
            } else {
                res.render(path.join(__dirname + "../../../src/view/pages/page-not-found"));
            }
        } catch (err) {
            console.log(err);
        }
    },
    handleBookClicksIncrement: async function name(req: Request, res: Response) {
        const { book_id } = req.params;
        try {
            let success = await incrementRecord("clicks", Number(book_id));
            console.log(success)
            if (success) {
                res.status(200).send({ success: true })
            } else {
                res.status(204).send({ success: false })
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({ err });
        }

    }
}

function updatePageBtnState(currentCount: number, totalCount: number) {
    let limitOnPage = 10;
    let prev = 0;
    let next = 1;
    let btnState = [false, false];
    if (currentCount < totalCount) {
        btnState[next] = true;
        if (currentCount <= limitOnPage) {
            btnState[prev] = false;
        } else {
            btnState[prev] = true;
        }
    } else if (currentCount === totalCount) {
        btnState[next] = false;
        if (currentCount <= limitOnPage) {
            btnState[prev] = false;
        }
    } else {
        btnState[next] = false;
        btnState[prev] = true;
    }
    return btnState;
}