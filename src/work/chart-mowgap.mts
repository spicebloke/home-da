import { Database } from "bun:sqlite";
import { renderApexToPng, writeFileWWW } from ".././utils.mts";


export async function ChartMowGap(){
	
	let db = new Database(process.env.DB);
	
	
	
	
	
	const today = new Date();

function daysAgo(days) {
  return new Date(today.getTime() - days * 86400000).getTime();
}



var ret = db.query(`

WITH cuts AS (
    SELECT
        client,
        date(start) AS cut_date,

        ROW_NUMBER() OVER (
            PARTITION BY client
            ORDER BY date(start) DESC
        ) AS rn,

        LEAD(date(start)) OVER (
            PARTITION BY client
            ORDER BY date(start) DESC
        ) AS previous_cut

    FROM jobs
    WHERE dte >= '2026-03-01'
and worker == 'Clive'
      and client != 'Emma Pollett'
      AND instr(upper(description), 'MOW') != 0
),

latest AS (
    SELECT
        client,

        -- days since latest mow
        ROUND(
            julianday('now') - julianday(cut_date)
        ) AS lastCut,

        -- gap between latest mow and mow before it
        ROUND(
            julianday(cut_date) - julianday(previous_cut)
        ) AS previousGap

    FROM cuts
    WHERE rn = 1
)

SELECT json_group_array(
    json_object(
        'name', client,
        'lastCut', lastCut,
        'previousGap', previousGap
    )
) AS clients
FROM latest;




 `).get();




 
const clients = JSON.parse(ret.clients);


const series = [
  {
    name: "Previous Interval",
    data: clients.map(c => ({
      x: c.name,
      y: [
        daysAgo(c.lastCut + c.previousGap),
        daysAgo(c.lastCut)
      ]
    }))
  },
  {
    name: "Since Last Cut",
    data: clients.map(c => ({
      x: c.name,
      y: [
        daysAgo(c.lastCut),
        today.getTime()
      ]
    }))
  }
];

const options = {
  chart: {
    type: 'rangeBar',
    height: 420,
    toolbar: {
      show: false
    },
    background: '#F2F0EF'
  },

  plotOptions: {
    bar: {
      horizontal: true,
      rangeBarGroupRows: true,
      barHeight: '60%'
    }
  },
  
  dataLabels: {
    enabled: true,
	  formatter: (value, opts) => {

    const point = opts.w.config.series[opts.seriesIndex]

      .data[opts.dataPointIndex]

    const start = point.y[0]

    const end = point.y[1]

    const days = Math.round((end - start) / 86400000)

    return days.toString()
    }
  },
  
  series,

  xaxis: {
    type: 'datetime',
    max: new Date().getTime(),
    labels: {
      datetimeUTC: false
    }
  },

  stroke: {
    width: 1
  },

  fill: {
    opacity: 0.9
  },

  legend: {
    show: false
  },

  tooltip: {
    x: {
      format: 'dd'
    }
  },

  colors: [
    '#B8C0A8',
    '#6E8B74'
  ]
};



  await renderApexToPng(options, "chart4.png", 795,379);

  

  
  var ret5 = db.query(`select json_group_array(

    json_object(

        'desc', client, 'amt1', day

    )

) as clients
from ( Select client, round(julianday('now') - julianday(dte)) as day FROM jobs
    WHERE dte >= '2026-03-01'
      AND instr(upper(description), 'WEED') != 0
Order by dte desc limit 10
)`).get();

writeFileWWW(JSON.stringify(ret5.clients),"weeds.json");

  

}

