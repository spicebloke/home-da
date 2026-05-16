import { Database } from "bun:sqlite";
import { syncInvoices } from "./invoices.mts";


export async function SyncIt() {

	var ret = "no change"
const db = new Database(process.env.DB);


//syncEventsFromFirebase(db, process.env.JOBS_URL)


//nvoices update
const res = await fetch( `${process.env.JOBS_INV_URL}?t=${Date.now()}` , {
  headers: {
    "accept": "application/json"
  }
});

const raw = await res.json();

const list = Array.isArray(raw) ? raw : Object.values(raw ?? {});

const invoices: InvoiceSource[] = list

if (syncInvoices(db, invoices)) {
 ret = "invoices changed"
}


return ret;


//var ret = db.query(`SELECT max(inv) as invm from invoices ;`).get();

//return ret.invm;


}