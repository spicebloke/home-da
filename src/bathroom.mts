import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer, turnedOn, incrementOverTime } from "./utils.mts";
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { Time } from "@digital-alchemy/automation";
import duration from "dayjs/plugin/duration";


dayjs.extend(duration);

export function Bathroom({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {


  const bathroomLight = hass.refBy.id("light.sonoff_01minizb");
  const bathroomMotion = hass.refBy.id("binary_sensor.bath_motion");

  const showerSensor = hass.refBy.id("sensor.bathroom_humidity_change");




const temperature = synapse.sensor({
  context,
  name: "Wongr Groceries",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 22.5
});





showerSensor.onUpdate(({ state }) => {

logger.info(`bathroom current state is ${state}`);
    //logger.info(`bathroom prev state is ${old_state.state}`);

    //hass.call.notify.mobile_app_spicepad( { "title":"Home" , "message": "Shower"});

});


  
  lifecycle.onReady(() => {

		logger.info("bathroom ready 2.5");
		
		
		const cancel = incrementOverTime({
  startValue: 0,
  endValue: 100,
  step: 10,
  totalTimeMs: 2000,
  onStep: (value) => logger.info(`Current value: ${value}`),
  onComplete: () => logger.info("Done!"),
});


  });



}

