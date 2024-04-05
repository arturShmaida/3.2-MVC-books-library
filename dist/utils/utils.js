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
exports.PaginationHelper = exports.prepareStringForQuery = exports.getImageType = exports.getBasePath = exports.parseSqlFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseSqlFile(sqlFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let basePath = getBasePath();
        let query = (fs_1.default.readFileSync(path_1.default.join(basePath + "/src/model/sqlPresets/" + sqlFileName + ".sql"), "utf-8")).toString()
            .replace(/(\r\n|\n|\r)/gm, " ")
            .replace(/\s+/g, ' ');
        return query;
    });
}
exports.parseSqlFile = parseSqlFile;
function getBasePath() {
    return process.cwd();
}
exports.getBasePath = getBasePath;
function getImageType(imageName) {
    if (imageName.endsWith(".jpg")) {
        return ".jpg";
    }
    return '';
}
exports.getImageType = getImageType;
function prepareStringForQuery(search) {
    if (typeof search === "undefined") {
        return;
    }
    search = search.trim();
    return `%${search}%`;
}
exports.prepareStringForQuery = prepareStringForQuery;
class PaginationHelper {
    constructor(collection, itemsPerPage) {
        this.localCollection = collection;
        this.itemsPerPage = itemsPerPage;
    }
    /**
     * returns the number of items within the entire collection
     */
    itemCount() {
        if (typeof this.localCollection === "number") {
            return this.localCollection;
        }
        return this.localCollection.length;
    }
    isNextExist(offset) {
        let itemIndex = offset;
        let pageIndex = this.pageIndex(itemIndex);
        return pageIndex < this.pageCount();
    }
    isPreviousExist(offset) {
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
    pageItemCount(pageIndex) {
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
            }
            else {
                return pageItemCount;
            }
        }
        else {
            return this.itemsPerPage;
        }
    }
    /**
     * determines what page an item is on. Zero based indexes
     * this method should return -1 for itemIndex values that are out of range
     */
    pageIndex(itemIndex) {
        if (itemIndex > this.itemCount() - 1 || itemIndex < 0) {
            return -1;
        }
        let itemIndexDouble = itemIndex + 1;
        let itemsPerPageDouble = this.itemsPerPage;
        return Math.ceil(itemIndexDouble / itemsPerPageDouble) - 1;
    }
}
exports.PaginationHelper = PaginationHelper;
