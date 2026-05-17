import { Database } from "bun:sqlite";

import { readFileSync } from "fs"




export function Apply(){
	
	let db = new Database(process.env.DB);
	
	db.close();
	
    db = new Database(process.env.DB);
	
	

try {

  // Read the SQL file

  const sql = readFileSync("./schema.sql", "utf8")

  // Run everything in one go

  db.exec(sql)

  console.log("Schema applied successfully")

} catch (err) {

  console.error("Failed to apply schema:", err)

} finally {

  db.close()

}

}