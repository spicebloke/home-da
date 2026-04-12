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

  const hotWater = hass.refBy.id("sensor.chauffeur_eau_power");

  const showerSensor = hass.refBy.id("sensor.bathroom_humidity_change");
  const delay2 = createDelayer('bathroom');

  let allowNotifyWater = true

const temperature = synapse.sensor({
  context,
  name: "Wongr Groceries",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 22.5
});


  bathroomLight.onUpdate(({ state }) => {
    //hass.call.notify.mobile_app_spicephone( { "title":"The title" , "message": "the messge"});

  });

  bathroomMotion.onUpdate(async ({ state }) => {

	logger.info(`current state is ${state}`);

	if (state === 'on') {
	  await delay2(900, bathroomLight);		
	}

  });

/*
  async function rundelay() {
	await delay2(900, bathroomLight);		
  }
*/


  showerSensor.onUpdate(({ state }) => {

    logger.info(`bathroom current state is ${state}`);

  });


  hotWater.onUpdate(({ state }) => {

    if ( state < 300 && allowNotifyWater ) {
      hass.call.notify.mobile_app_spicepad( { "title":"Info" , "message": "Hot water ready"});
      allowNotifyWater = false;
    }

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

