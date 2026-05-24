import { Database } from "bun:sqlite";
import { renderApexToPng, writeFileWWW } from ".././utils.mts";


export async function ChartVsPrv(){
	
	let db = new Database(process.env.DB);
	
	
	
	const options = 
{
  "chart": {
    "type": "line",
    "stacked": true,
    "background": "#F2F0EF",
    "offsetY": -10,
    "height": 200,
    "toolbar": { "show": false },
    "sparkline": {"enabled": false}
  },
  "stroke": {"width":0},
  "plotOptions": {

    "bar": {

      "columnWidth": "90%",

      "borderRadius": 0

    }

  },


  "theme": {
    "mode": "light"
  },
  "dataLabels": {
    "enabled": false
  },
  "yaxis": {
    "labels": {
      "show": false
    },
    "axisBorder": {
      "show": false
    },
    "axisTicks": {
      "show": false
    }
  },
  "grid": {
    "show": false,
    "padding": {
      "top": 0,
      "bottom": 0,
      "left": -80,
      "right": -100
    }
  },
  "legend": {
    "show": false
  },
  "series": [
    {
      "name": "Series 1",
      "data": [
        10,
        120,
        30
      ],
      "type": "bar"
    },
    {
      "name": "Series 2",
      "data": [
        15,
        25,
        35
      ],
      "type": "bar"
    }
  ],
  "xaxis": {
    "categories": [
      "A",
      "B",
      "C"
    ],
    "labels": {
      "show": true,
        "style": {
          "fontSize": "24px",
          "fontFamily": "Monaco",
          "fontWeight" : "bold"
        }
    },
    "axisBorder": {
      "show": false
    },
    "axisTicks": {
      "show": false
    }
  },
"colors": [
    '#D6336C',
    '#FF4081',
    '#FFB6C1',
    '#CAAA98'

  ]
}
;




var ret = db.query(`SELECT pay_year, method, round(sum(amt),0) as amt FROM jobs
WHERE pay_year >= '2023' and pay_month <= '05'  and iif( upper( substr (desc, 1, 7) ) == 'DEBOURS',1,0) == 0 group by pay_year, method ;`).all();


var ret2 = db.query(`SELECT pay_year, method, round(sum(amt),0) as amt FROM jobs
WHERE pay_year >= '2023' and pay_month == '05'  and iif( upper( substr (desc, 1, 7) ) == 'DEBOURS',1,0) == 0 group by pay_year, method ;`).all();


//var ret3 = db.query(`SELECT * FROM jobs
//WHERE pay_year >= '2026' and pay_month == '05'  order by paid ;`).all();
//console.log(ret3);


function sumArrays(...arrays: number[][]): number[] {
  return arrays[0].map((_, i) => arrays.reduce((sum, arr) => sum + arr[i], 0));
}


function getSeriesByMethod(data: PaymentRecord[], method: string) {
  const filtered = data.filter(
    (record) => record.method.toLowerCase() === method.toLowerCase()
  );
  return {
    labels: filtered.map((r) => r.pay_year),
    values: filtered.map((r) => r.amt),
  };
}

// { labels: ["2023", "2024", "2025"], values: [850, 1270, 892.5] }
const cash2 = getSeriesByMethod(ret2, "Cash");
const bank2 = getSeriesByMethod(ret2, "Bank");


options.series[1].data = cash2.values
options.series[0].data = bank2.values

//console.log(options)

const totals2 = sumArrays(cash2.values, bank2.values)

options.xaxis.categories = totals2


  await renderApexToPng(options, "chart2.png", 400,200);






const cash = getSeriesByMethod(ret, "Cash");
const bank = getSeriesByMethod(ret, "Bank");


options.series[1].data = cash.values
options.series[0].data = bank.values


//console.log(options)

const totals = sumArrays(cash.values, bank.values)

options.xaxis.categories = totals


  await renderApexToPng(options, "chart.png", 400,200);









var ret4 = db.query(`SELECT strftime('%W', start) as pay_year , 
 strftime('%Y', start) as method,
sum( dur / 60) as amt
FROM jobs 
WHERE start >= '2025-01-01' 
/* and strftime('%W', dte) <= strftime('%W', date('now')) */
and strftime('%W', dte) != '00'
and worker =='Clive'
group by strftime('%W', start) , strftime('%Y', start) ;`).all();



const cash4 = getSeriesByMethod(ret4, "2026");
const bank4 = getSeriesByMethod(ret4, "2025");

const totals4: Record<string, number> = {}

for (const row of ret4) {
  totals4[row.method] ??= 0
  totals4[row.method] += Math.round(row.amt)
};



options.series[0].data = cash4.values
options.series[1].data = bank4.values


//options.series[1].type = "line"

options.xaxis.categories = bank4.labels
options.xaxis.labels.show = false
options.chart.stacked = false
options.chart.height = 100
options.chart.sparkline.enabled = true
options.dataLabels.enabled = false
options.grid.padding.left = 0
options.grid.padding.right = 0
options.series[1].color = options.colors[2]

options.annotations = {

  yaxis: [

    {

      y: 7,

      borderColor: "#ff0000",

    },

  ],

};

options.subtitle =  {
  text: totals4['2026'] + '/' + totals4['2025'],
  align: "right",
  offsetY: 0,
  style: {
    fontSize: "14px"
  }
};


  await renderApexToPng(options, "chart3.png", 600,100);

  
  var ret5 = db.query(`select json_group_array(

    json_object(

        'desc', client, 'amt1', amt1, 'amt2', amt2

    )

) as clients

from ( select client, 
sum(iif(inv like '%0000', amt, 0)) as amt1,
sum(iif(inv not like '%0000', amt, 0)) as amt2
    from jobs
  where paid is null
group by client)`).get();

writeFileWWW(JSON.stringify(ret5.clients),"debtors.json");

  //await renderApexToPng(options, "chart9ab.png");



}

