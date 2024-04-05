import { type Request, type Response } from "express";
import path from "path";
import { getBookRecords, getBookRecord, incrementRecord } from "../model/libraryModel.js";
import { View } from "../view/view.js";
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


export const UserController = {

    handleLibraryRenderRequest: async function <Request extends { query: { offset: number, search?: string, limit?: number } }>
        (req: Request, res: Response) {
        let { offset, search, limit } = req.query;
        if (limit === undefined) limit = 20;
        if (offset === undefined || offset < 0) offset = 0;

        try {
            
            let totalBooks = await getBookRecords(search);  
            let booksTotalCount: number = totalBooks.length;
            
            if(booksTotalCount < (offset - 1)) {
                offset = 0;
            }
            let books = totalBooks.splice(offset, limit)         
            let drawInfo = {booksTotalCount, offset,search, limit };

            View.renderLibraryPage(books, drawInfo, res)
        } catch (err) {
            console.log(err)
            View.renderPageNotFound(res,search)
        }
    },
    handleBookRequest: async function (req: Request, res: Response) {
        const { book_id } = req.params;
        // Look up for this object on DB

        try {
            let bookPacket= await getBookRecord(Number(book_id));
            console.log("bookPacket")
            
            console.log(bookPacket)
            if ((Array.isArray(bookPacket) && bookPacket.length !== 0)) {
                console.log(typeof bookPacket)
                console.log(bookPacket)
                incrementRecord("views", Number(book_id));
                View.renderBookPage(bookPacket, res)
            } else {
                View.renderPageNotFound(res)
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




