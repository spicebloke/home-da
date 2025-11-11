import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import dayjs from "dayjs";
import { toggleIcons , writeFile } from "./utils.mts";

export function Lounge({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {

  const homeZone = hass.refBy.id("input_button.tester");
  const officeWled = hass.refBy.id("light.tz3000_dbou1ap4_ts0505a");
  const motion = hass.refBy.id("binary_sensor.tuyatec_zn9wyqtr_rh3040");
  

  //toggleIcons(ledAutomation, "mdi:led-strip-variant", "mdi:led-strip-variant-off");

  
  homeZone.onUpdate(({ state }) => {
       logger.info("pressed! new version");
       
       //officeWled.toggle();
       
       //writeFile("clive.txt",state);
    
  });

  motion.onUpdate(({ state }) => {
  
  logger.info(state);
  
  });
  
  

  // Slightly more resillient state syncs at boot
  lifecycle.onReady(() => {

logger.info("ready");
    //const holidayLights = hass.refBy.label("holiday_lights");
    //if (holidayLights.some(light => light.state === "on")) {
      //holidayLightSwitch.is_on = true;
    //}
  });
}

