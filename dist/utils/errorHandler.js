"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(err, req, res, next) {
    if (typeof (err) === "string") {
        return res.status(400).send({ message: err });
    }
    return res.status(500).send({ message: err });
}
exports.errorHandler = errorHandler;
