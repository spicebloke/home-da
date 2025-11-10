import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import dayjs from "dayjs";
import { toggleIcons } from "./utils.mts";

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

  //toggleIcons(ledAutomation, "mdi:led-strip-variant", "mdi:led-strip-variant-off");

  
  homeZone.onUpdate(({ state }) => {
       logger.info("pressed!");
    
  });

  
  
  

  // Slightly more resillient state syncs at boot
  lifecycle.onReady(() => {
    //const holidayLights = hass.refBy.label("holiday_lights");
    //if (holidayLights.some(light => light.state === "on")) {
      //holidayLightSwitch.is_on = true;
    //}
  });
}

