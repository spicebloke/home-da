import { Database } from "bun:sqlite";

import { readFileSync } from "fs"

import { join } from "path"


export function Apply(){
	
	let db = new Database(process.env.DB);
	
	db.close();
	
    db = new Database(process.env.DB);
	
	

try {

  // Read the SQL file


const sqlPath = join(import.meta.dir, "schema.sql")

const sql = readFileSync(sqlPath, "utf8")

  // Run everything in one go

  db.exec(sql)

  console.log("Schema applied successfully")

} catch (err) {

  console.error("Failed to apply schema:", err)

} finally {

  db.close()

}

}