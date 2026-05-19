import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer } from "./utils.mts";
import { CronExpression,  TServiceParams, sleep } from "@digital-alchemy/core";
import duration from "dayjs/plugin/duration";
import { ChartVsPrv } from "./work/chart-vs-prv.mts"
import { ChartMowGap } from "./work/chart-mowgap.mts"
import { SyncIt } from "./work/syncit.mts"

import { Apply } from "./work/schema.mts"




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
    hass.call.notify.mobile_app_spicepad( { "title":"Info" , "message": "Work button 3"});

    //await ChartVsPrv();
	//Apply();
   //logger.info(await SyncIt());
   
   
	
  }
});


const restartButton = synapse.button({
  context,
  name: "Update Work to DB",
  device_class: "update",
  async press() {
    logger.info("Update work to db...");
    // Perform restart logic
	
	
	logger.info(await SyncIt());
	
	await sleep({ second: 1 });
	
	await ChartVsPrv();
	
	await ChartMowGap();
	
	hass.call.notify.mobile_app_spicepad( { "title":"Info" , "message": "Work db and charts refreshed"});
  }
});



  lifecycle.onReady(() => {

    logger.info("work ready 1.0");

	logger.info(`Directory name is ${__dirname}`);
	


	
	
	//logger.info(path.resolve("./chart3.png"));
  });
}

