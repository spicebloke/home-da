import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer } from "./utils.mts";
import { CronExpression,  TServiceParams } from "@digital-alchemy/core";
import duration from "dayjs/plugin/duration";
import { ChartVsPrv } from "./work/chart-vs-prv.mts"
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

    await ChartVsPrv();
	//Apply();
   //logger.info(await SyncIt());
   
   hass.socket.onEvent({
  context,
  event: "da_syncit",
  async exec(data) {
    logger.info(JSON.stringify(event, null, 2));
    // ... logic

       }
    });
	
  }
});




  lifecycle.onReady(() => {

    logger.info("work ready 1.0");

	logger.info(`Directory name is ${__dirname}`);
	
	

	
	console.log("REGISTERING EVENT LISTENER")

	

	hass.onEvent("dignity_alarm", event => {

logger.info("onevent")

})

	
	
	
	hass.socket.subscribe({
    context,
    event_type: "da_syncit",
    async exec() {
      logger.info("did the house fall down?");
	 // logger.info(await SyncIt());
      },
    });
	
	//logger.info(path.resolve("./chart3.png"));
  });
}

