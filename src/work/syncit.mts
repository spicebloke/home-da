import { Database } from "bun:sqlite";



export function SyncIt() {
	

const db = new Database("../../calendar5.db");




var ret = db.query(`SELECT max(inv) from invoices ;`).all();

return ret;


}