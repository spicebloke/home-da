import dayjs from "dayjs";
import { toggleIcons , writeFile, turnedOn } from "./utils.mts";
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { Time } from "@digital-alchemy/automation";
import duration from "dayjs/plugin/duration";


dayjs.extend(duration);

export function Xanadu({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {

  
  scheduler.cron({
    schedule: CronExpression.EVERY_5_MINUTES,
    exec () {
    
      const res = await fetch(`https://hc-ping.com/bcb15f5d-896c-4403-b42d-697ec022ec3b`);
    
    }
  });
  
  lifecycle.onReady(() => {

    logger.info("xanadu ready 3.1");
    logger.info(process.env.CLIVE);

  });



}

