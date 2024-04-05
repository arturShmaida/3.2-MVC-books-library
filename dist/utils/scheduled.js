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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDBScheduledJobs = void 0;
const cron_1 = require("cron");
const bd_js_1 = require("../model/bd.js");
const backupScheduledJob = new cron_1.CronJob('* 0 1 30 1 *', 
// onTick
() => {
    (0, bd_js_1.createBackup)();
    console.log(`Initiated backupScheduledJob creation` + new Date().toDateString());
}, 
// onComplete
() => {
    console.log("backupScheduledJob completed");
}, 
// start
false);
const softDeleteScheduledJob = new cron_1.CronJob('* 0 * * * *', 
// onTic
() => {
    (0, bd_js_1.deleteMarkedRecordsConnections)();
    console.log(`Initiated softDeleteScheduledJob ` + new Date().toDateString());
}, 
// onComplete
() => {
    console.log("softDeleteScheduledJob completed");
}, 
// start
false);
function startDBScheduledJobs() {
    return __awaiter(this, void 0, void 0, function* () {
        backupScheduledJob.start();
        softDeleteScheduledJob.start();
    });
}
exports.startDBScheduledJobs = startDBScheduledJobs;
