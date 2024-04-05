import fs from "fs";
import path from "path";



export async function parseSqlFile(sqlFileName: string) {
    let basePath: string = getBasePath();
    let query = (fs.readFileSync(path.join(basePath + "/src/model/sqlPresets/" + sqlFileName + ".sql",), "utf-8")).toString()
        .replace(/(\r\n|\n|\r)/gm, " ")
        .replace(/\s+/g, ' ');
    return query;
}

export function getBasePath() {
    return process.cwd();
}
export function getImageType(imageName: string){
    
    if(imageName.endsWith(".jpg")){
        return ".jpg";
    }
    return '';
}
export function  prepareStringForQuery(search: string | undefined) {
    if (typeof search === "undefined") {
        return;
    }
    search = search.trim();
    return `%${search}%`
}

export class PaginationHelper {
    localCollection: any[] | number;
    itemsPerPage: number;
    constructor(collection: any[]| number, itemsPerPage: number) {
        this.localCollection = collection;
        this.itemsPerPage = itemsPerPage;
    }
    /**
     * returns the number of items within the entire collection
     */
    itemCount() {
        if(typeof this.localCollection === "number") {
            return this.localCollection;
        }
        return this.localCollection.length;
    }

    isNextExist(offset: number){
        let itemIndex = offset;
        let pageIndex = this.pageIndex(itemIndex);
        return pageIndex < this.pageCount();
    }

    isPreviousExist(offset: number){
        let itemIndex = offset;
        let pageIndex = this.pageIndex(itemIndex);
        return pageIndex > 0;
    }
    /**
     * returns the number of pages
     */
    pageCount() {
        return Math.ceil(this.itemCount() / this.itemsPerPage);
    }

    /**
     * returns the number of items on the current page. page_index is zero based.
     * this method should return -1 for pageIndex values that are out of range
     */
    pageItemCount(pageIndex: number) {
        
        if (pageIndex > this.pageCount() - 1 || pageIndex < 0) {
            return -1;
        }
        if (this.itemsPerPage == this.itemCount()) {
            return this.itemsPerPage;
        }
        if (pageIndex + 1 == this.pageCount()) {

           let pageItemCount = Math.abs(this.itemCount() - (pageIndex * this.itemsPerPage));

            if (pageItemCount > this.itemsPerPage) {
                return this.itemsPerPage;
            } else {
                return pageItemCount;
            }

        } else {
            return this.itemsPerPage;
        }

    }

    /**
     * determines what page an item is on. Zero based indexes
     * this method should return -1 for itemIndex values that are out of range
     */
    pageIndex(itemIndex: number) {
       
        if (itemIndex > this.itemCount() - 1 || itemIndex < 0) {
            return -1;
        }
        let itemIndexDouble = itemIndex + 1;
        let itemsPerPageDouble = this.itemsPerPage;
        return Math.ceil(itemIndexDouble / itemsPerPageDouble) - 1;
    }
}
