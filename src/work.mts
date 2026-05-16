import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer } from "./utils.mts";
import { CronExpression,  TServiceParams } from "@digital-alchemy/core";
import duration from "dayjs/plugin/duration";

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
  press() {
    hass.call.notify.mobile_app_spicepad( { "title":"Info" , "message": "Work button"});

  }
});




  lifecycle.onReady(() => {

    logger.info("work ready 1.0");

	logger.info(`Directory name is ${__dirname}`);
	
	logger.info(path.resolve("./chart3.png"));
  });
}

