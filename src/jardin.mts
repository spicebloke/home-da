import dayjs from "dayjs";
import { toggleIcons , writeFile, turnedOn } from "./utils.mts";
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { Time } from "@digital-alchemy/automation";
import duration from "dayjs/plugin/duration";


dayjs.extend(duration);

export function Jardin({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {


  const stringLights = hass.refBy.id("light.string_lights");
  const stringLightsScene = hass.refBy.id("select.string_lights_scene");
  
  
  const garageDoor = hass.refBy.id("switch.garage_door_lock");

  const garageLock = synapse.lock({
    context,
    name: "Garage Door Lock"
  });

  garageLock.onUpdate(({ state }) => {
  
    logger.info(state);

    if (state == 'locked') {
      garageDoor.turn_on();
    }
    if (state == 'unlocked') {
      garageDoor.turn_off();
    }

  });


  automation.solar.onEvent({
    eventName: "dusk",
    exec() {

      stringLights.turn_on();
      stringLightsScene.select_option({ option: "Spring" });

    }
  });
  
  scheduler.cron({
    schedule: CronExpression.EVERY_DAY_AT_3AM,
    exec: () => stringLights.turn_off(),
  });
  
  lifecycle.onReady(() => {

    logger.info("jardin ready 3.1");
    logger.info(process.env.CLIVE);

  });



}

