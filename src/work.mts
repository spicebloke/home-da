import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer,  renderApexToPng } from "./utils.mts";
import { CronExpression,  TServiceParams } from "@digital-alchemy/core";
import duration from "dayjs/plugin/duration";

import path from "path";

dayjs.extend(duration);

export function Work({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {



const restartSmartDnsButton = synapse.button({
  context,
  name: "Work button",
  async press() {
    hass.call.notify.mobile_app_spicepad( { "title":"Info" , "message": "Work button 2"});
	
	
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
        20,
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


  await renderApexToPng(options, "chart9.png");

  logger.info("Chart saved to:");



  }
});




  lifecycle.onReady(() => {

    logger.info("work ready 1.0");

	logger.info(`Directory name is ${__dirname}`);
	
	logger.info(path.resolve("./chart3.png"));
  });
}

