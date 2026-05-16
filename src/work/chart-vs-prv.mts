
import { renderApexToPng } from ".././utils.mts";


export async function ChartVsPrv(){
	
	const options = 
{
  "chart": {
    "type": "line",
    "stacked": true,
    "background": "#ebebd3",
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
    '#083D77',
    '#DA4167',
    '#F78764',
    '#F4D35E'

  ]
}
;


  await renderApexToPng(options, "chart9a.png");

  logger.info("Chart saved to:");



}

