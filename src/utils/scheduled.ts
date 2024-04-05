import { CronJob, CronTime } from "cron";
import { createBackup,deleteMarkedRecordsConnections } from "../model/bd.js"
const backupScheduledJob = new CronJob(
    '* 0 1 30 1 *',
    // onTick
    () => {
        createBackup();
        console.log(`Initiated backupScheduledJob creation` + new Date().toDateString())
    },
    // onComplete
    () => {
        console.log("backupScheduledJob completed")
    },
    // start
    false,

)

const softDeleteScheduledJob = new CronJob(
    '* 0 * * * *',
    // onTic
    () => {
        deleteMarkedRecordsConnections();
        console.log(`Initiated softDeleteScheduledJob ` + new Date().toDateString())
    },
    // onComplete
    () => {
        console.log("softDeleteScheduledJob completed")
    },
    // start
    false,

)

export async function startDBScheduledJobs() {
    backupScheduledJob.start();
    softDeleteScheduledJob.start();
}