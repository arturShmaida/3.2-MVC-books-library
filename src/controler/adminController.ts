import { type NextFunction, type Request, type Response } from "express";
import path from "path";
import { createRecord, getRecords, getRecord } from "../model/bd.js"

export const AdminController = {
    handleAdminPageRenderRequest: async function <Request extends { query: { offset: number, search?: string, limit?: number } }>
        (req: Request, res: Response) {
            try {
                let pathToPage = path.join(__dirname + "../../../src/view/pages/admin-page");
               
    
                
    
    
             
    
           
           
                res.render(pathToPage);
            } catch (err) {
                console.log(err)
                res.render(path.join(__dirname + "../../../src/view/pages/page-not-found"));
            }
    }
}