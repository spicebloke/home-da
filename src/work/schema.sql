

/*

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

CREATE INDEX IF NOT EXISTS idx_invoices_paid ON invoices(paid);

CREATE TABLE IF NOT EXISTS clients (
  code TEXT ,
  worker TEXT
)

*/

/*
create view eventsview as SELECT *, 
json_extract( substr(description, instr(description, '{')), '$.inv') inv,
json_extract( substr(description, instr(description, '{')), '$.rate') rate,
json_extract( substr(description, instr(description, '{')), '$.amt') amt,
(strftime('%s', end) - strftime('%s', start)) / 60.0  as dur,
iif( upper( substr(description, 1, 7) ) == 'DEBOURS',1,0) as debours
from events 
*/



/* drop view alljobs; */


create view alljobs as
SELECT  
  e.start,
  e.end,
  substr(e.start,1,10) as dte,
  e.title as client,
  e.location,
  e.description,
  e.inv,
  (e.rate * e.dur ) / 60 as amt,
  e.rate,
  e.dur,
  i.method,
  i.paid,
  i.worker,
  e.debours,
  substr(description, 0, instr(description, '{')) as desc,
  substr(i.paid,1,4) as pay_year,
  substr(i.paid,6,2) as pay_month,
  (CAST(strftime('%m', i.paid) AS INTEGER) + 2) / 3 AS pay_qtr,
  substr(e.start,1,4) as  val_year,
  substr(e.start,6,2) as val_month,
  (CAST(strftime('%m', e.start) AS INTEGER) + 2) / 3 AS val_qtr

FROM eventsview e

LEFT JOIN invoices i
ON e.inv = i.inv;


drop view jobs;

create view jobs as
	select * from alljobs
	where debours == 0;
