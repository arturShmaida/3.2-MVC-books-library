import fs from "fs";
import path from "path";


export async function parseSqlFile(sqlFileName: string) {
    let basePath: string = getBasePath();
    let query = (fs.readFileSync(path.join(basePath + "/src/model/sqlPresets/" + sqlFileName + ".sql",), "utf-8")).toString()
        .replace(/(\r\n|\n|\r)/gm," ")
        .replace(/\s+/g,' ');
    return query;
}

export function getBasePath() {
    return process.cwd();
}
