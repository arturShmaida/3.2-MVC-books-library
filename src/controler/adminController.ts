import { type NextFunction, type Request, type Response } from "express";

import {  getBookRecords, markRecordAsDeleted, createBookRecord } from "../model/libraryModel.js"
import {  getBasePath, getImageType } from "../utils/utils.js";
import { View } from "../view/view.js";
export const AdminController = {
    handleAdminPageRequest: async function <Request extends { query: { page: number } }>
        (req: Request, res: Response) {
        try {
            let requestedPage = req.query.page
            if (!requestedPage) {
                requestedPage = 1;
            }
            let itemsLoadLimit = 10;
            let offset = (requestedPage - 1) * itemsLoadLimit
            let totalBooks = await getBookRecords();


            let books = totalBooks.splice(offset, itemsLoadLimit)
            let drawInfo = { totalBooks, itemsLoadLimit }
            View.renderAdminPage(books, drawInfo, res);
        } catch (err) {
            console.log(err)
            View.renderPageNotFound(res)
        }
    },
    handleNewItemCreationRequest: async function
        (req: Request, res: Response) {
        try {
            console.log(req.baseUrl)

            console.log(req.body)

            console.log(req.body.authorOne)
            const files = req.files;
            if (!files || !files.image) {
                return res.status(400).send({ error: "No Image sent" })
            }
            const { image } = files;
            if (Array.isArray(image)) {
                return res.status(400).send({ error: "Accept only one image per request" })
            }
            if (!/^image/.test(image.mimetype)) {

            }
            let imageType = getImageType(image.name);
            if (imageType === "") {
                return res.status(400).send({ error: "Unsupported image type" })
            }
            console.log("no error with image")

            const {
                title,
                year,
                description,
                authorOne,
                authorTwo,
                authorThree

            } = req.body;
            let authors: string[] = [authorOne]

            authorTwo ? authors.push(authorTwo) : 0;
            authorThree ? authors.push(authorThree) : 0;

            let bookId = await createBookRecord({ title, description, year, authors })
            console.log(image);

            if (!!bookId) {
                image.mv(getBasePath() + "/resourses/img/books/" + bookId + imageType)
            }
            res.status(201).send({ success: true })
            console.log("book added succesfuly")
        } catch (err) {
            console.log(err)
            res.status(500).send({ err })
        }
    },
    handleItemMarkAsDeleteRequest: async function (req: Request, res: Response) {
        const { book_id } = req.params;

        console.log("book id to delete: " + book_id)
        console.log(req.params)
        console.log(req.params.book_id)

        try {
            let success = await markRecordAsDeleted(Number(book_id));
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