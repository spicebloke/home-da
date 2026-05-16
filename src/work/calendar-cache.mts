import { Database } from "bun:sqlite";
import crypto from "crypto";

function hashEvent(e: any) {

  return crypto
    .createHash("md5")
    .update(JSON.stringify(e))
    .digest("hex");
}





export async function syncEventsFromFirebase(
  db: Database,
  url: string
) {
  const res = await fetch(url);
  const data = await res.json();

  const events: any[] = Object.values(data || {});
//console.log(events)
  const earliest = events.reduce((min, e) =>
    new Date(e.start) < new Date(min.start) ? e : min
  );

console.log(earliest.start); // "2024-03-29T17:00:00.000Z"


  const existing = new Map<string, string>();

  for (const row of db.query(`
    SELECT id, hash FROM events
  `).all() as any[]) {
    existing.set(row.id, row.hash);
  }

  const seen = new Set<string>();
  var changes = false

  const insert = db.query(`
    INSERT INTO events (
      id, start, end,
      title, location, description, hash
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const update = db.query(`
    UPDATE events SET
      start = ?, end = ?,
      title = ?, location = ?, description = ?, hash = ?
    WHERE id = ?
  `);

  const tx = db.transaction(() => {
    for (const e of events) {
      const id = String(e.id);
      const h = hashEvent(e);

      seen.add(id);

      if (!existing.has(id)) {
        // ➕ insert
        insert.run(
          id,
          e.start,
          e.end,
          e.title,
          e.location ?? null,
          e.description ?? null,
          h
        );
        changes = true
      } else if (existing.get(id) !== h) {
        // 🔄 update
        update.run(
          e.start,
          e.end,
          e.title,
          e.location ?? null,
          e.description ?? null,
          h,
          id
        );
        changes = true
      }
    }

    // ❌ delete removed events
    for (const id of existing.keys()) {
      if (!seen.has(id)) {
        db.query(`DELETE FROM events WHERE id = ? and start >= ?`).run(id, earliest.start );
      }
    }
  });

  tx();


  return changes
}

