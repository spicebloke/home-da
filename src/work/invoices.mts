

import { Database } from "bun:sqlite";
import crypto from "crypto";
   


/*

const db = new Database("calendar5.db");

db.exec(`



CREATE TABLE IF NOT EXISTS invoices (
  inv TEXT PRIMARY KEY,
  amount REAL,
  method TEXT,
  paid TEXT,        -- epoch ms
  worker TEXT,
  title TEXT,
  client TEXT,
  hash TEXT NOT NULL
);
`);


db.exec(`

CREATE INDEX IF NOT EXISTS idx_invoices_paid ON invoices(paid);
`);

*/


//const ret = db.query(`SELECT * from invoices where paid is null`).all();
//console.log(ret);







export interface InvoiceSource {
  note: {
    amt: number;
    inv: string;
    method: string;
    paid: string;   // ISO date
    worker: string;
  };
  title: string;
}








function extractClient(title: string): string | null {
  const parts = title.split(",");

  if (parts.length < 2) return null;

  return parts[1].trim();
}




function hashInvoice(i: InvoiceSource) {
  return crypto
    .createHash("md5")
    .update(
      JSON.stringify({
        amt: i.note.amt,
        inv: i.note.inv,
        method: i.note.method,
        paid: i.note.paid,
        worker: i.note.worker,
        title: i.title
      })
    )
    .digest("hex");
}











function prepareInvoiceStatements(db: Database) {
  return {
    getHash: db.query(`SELECT hash FROM invoices WHERE inv = ?`),

    insert: db.query(`
      INSERT INTO invoices (
        inv, amount, method, paid, worker, title, client, hash
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `),

    update: db.query(`
      UPDATE invoices SET
        amount = ?, method = ?, paid = ?, worker = ?, title = ?, client = ?, hash = ?
      WHERE inv = ?
    `),

    deleteMissing: db.query(`
      DELETE FROM invoices
      WHERE inv NOT IN (SELECT value FROM json_each(?))
    `)
  };
}












export function syncInvoices(db: Database, data: InvoiceSource[]): boolean {
  const stmts = prepareInvoiceStatements(db);

  const ids: string[] = [];
  let changed = false;

  const tx = db.transaction(() => {
    for (const item of data) {
      const inv = item.note.inv;
      const hash = hashInvoice(item);

      ids.push(inv);

      const existing = stmts.getHash.get(inv) as { hash: string } | null;

      const paidMs = item.note.paid
        ? new Date(item.note.paid).getTime()
        : null;

      if (!existing) {
        stmts.insert.run(
          inv,
          item.note.amt,
          item.note.method,
          item.note.paid,
          item.note.worker,
          item.title,
          extractClient(item.title),
          hash
        );
        changed = true;
      } else if (existing.hash !== hash) {
        stmts.update.run(
          item.note.amt,
          item.note.method,
          item.note.paid,
          item.note.worker,
          item.title,
          extractClient(item.title),
          hash,
          inv
        );
        changed = true;
      }
    }

    // 🧹 remove deleted invoices
    const result = stmts.deleteMissing.run(JSON.stringify(ids));
    if (result.changes > 0) changed = true;
  });

  tx();
  return changed;
}





