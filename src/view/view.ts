import { RowDataPacket } from "mysql2";
import { type Response } from "express";
import path from "path";
import { PaginationHelper } from "../utils/utils";


export const View = {
    renderLibraryPage: async function (books: RowDataPacket[], drawInfo: {booksTotalCount: number, offset: number, search?: string, limit: number }, res: Response) {
        let {booksTotalCount, offset, search, limit } = drawInfo;

        let pathToPage = path.join(__dirname + "../../../src/view/pages/books-page");
      
        let paginationHelper = new PaginationHelper(booksTotalCount, limit)
        let previousPage = paginationHelper.isPreviousExist(offset)
        let nextPage = paginationHelper.isNextExist(offset) 

        res.render(pathToPage, { books, previousPage, nextPage, offset, search });
    },
    renderBookPage: async function (bookPacket: any, res: Response,) {
        res.render(path.join(__dirname + "../../../src/view/pages/book-page"), bookPacket[0]);
    },
    renderAdminPage(books: RowDataPacket[], drawInfo: { totalBooks: RowDataPacket[], itemsLoadLimit: number }, res: Response) {

        let pathToPage = path.join(__dirname + "../../../src/view/pages/admin-page");
        let { totalBooks, itemsLoadLimit } = drawInfo;
        let pagination = new PaginationHelper(totalBooks, itemsLoadLimit)
       

        let pageCount = pagination.pageCount()
       
        res.render(pathToPage,
            {
                books,
                pageCount
            }
        );
    },
    renderPageNotFound: async function (res: Response, search?: string) {
        res.status(404);
        res.render(path.join(__dirname + "../../../src/view/pages/page-not-found"), { search });
    },
}
