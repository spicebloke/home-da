import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer, turnedOn, isRealEvent } from "./utils.mts";
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { Time } from "@digital-alchemy/automation";
import duration from "dayjs/plugin/duration";

    
dayjs.extend(duration);

class EnergyAccumulator {
  private lastTimestamp: number | null = null;
  private lastPower: number | null = null;
  private totalKWh = 0;

  update(powerWatts: number, timestamp: number = Date.now()): number {
    if (this.lastTimestamp !== null && this.lastPower !== null) {
      const deltaMs = timestamp - this.lastTimestamp;

      // Use previous power for the interval
      this.totalKWh += this.lastPower * deltaMs / 3_600_000_000;
    }

    this.lastTimestamp = timestamp;
    this.lastPower = powerWatts;

    return this.totalKWh;
  }

  getTotalKWh(): number {
    return this.totalKWh;
  }

  reset(): void {
    this.lastTimestamp = null;
    this.lastPower = null;
    this.totalKWh = 0;
  }
};

export function Energy({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {


const elecTariff = hass.refBy.id("sensor.cvs_elec_tariff");
const meterReading = hass.refBy.id("sensor.elec_reading_main");
const hotWater = hass.refBy.id("sensor.elec_reading_chauffe_eau");

const solar1 = hass.refBy.id("sensor.elec_reading_solar1");
const solar2 = hass.refBy.id("sensor.elec_reading_solar2");

const solar1power = hass.refBy.id("sensor.elec_power_solar1");
const solar2power = hass.refBy.id("sensor.elec_power_solar2");

/*
let prvReading = 0
let prvCost = 0
let prvReadingWater = 0
let prvCostWater = 0
  
*/


const todayCost = synapse.sensor({ context, name: "Elec Cost Today", device_class: "monetary", unit_of_measurement: "EUR" });
const todayCostWater = synapse.sensor({ context, name: "Elec Cost Today Water", device_class: "monetary", unit_of_measurement: "EUR" });

const todayCostSolar1 = synapse.sensor({ context, name: "Elec Cost Today Solar1", device_class: "monetary", unit_of_measurement: "EUR" });
const todayCostSolar2 = synapse.sensor({ context, name: "Elec Cost Today Solar2", device_class: "monetary", unit_of_measurement: "EUR" });

//button.onUpdate(({ state, attributes: { event_type } }, { state: oldState }) => {


const solarNet = synapse.sensor({
  context,
  name: "Solar Net",
  device_class: "power",
  unit_of_measurement: "W",
  state: 0
});

const clive1 = synapse.sensor({
  context,
  name: "Clive Solar1",
  device_class: "energy",
  unit_of_measurement: "kWh", 
  state: 0
});
const clive2 = synapse.sensor({
  context,
  name: "Clive Solar2",
  device_class: "energy",
  unit_of_measurement: "kWh", 
  state: 0
});

const clive1energy = new EnergyAccumulator();

clive1energy.update(0); 
const clive2energy = new EnergyAccumulator();

clive2energy.update(0); 


solar1power.onUpdate(({ state }) => {
  logger.info(state);
  solarNet.state = toFloat(solar1power.state) + toFloat(solar2power.state)

clive1.state = clive1energy.update(solar1power.state); 


});
solar2power.onUpdate(({ state }) => {
  logger.info(state);
  solarNet.state = toFloat(solar1power.state) + toFloat(solar2power.state)
clive2.state = clive2energy.update(solar2power.state); 


});


meterReading.onUpdate(({ state, attributes: { event_type } }, { state: oldState }) => {
  logger.info(state);
  if (!isRealEvent(state, oldState)) return;

  todayCost.state = todayCost.state + ((state - oldState) * elecTariff.state);

});


hotWater.onUpdate(({ state, attributes: { event_type } }, { state: oldState }) => {

if (!isRealEvent(state, oldState)) return;

  todayCostWater.state = todayCostWater.state + ((state - oldState) * elecTariff.state);

/*
  logger.info(state);

  if (!isRealEvent(state, oldState)) return;

  if (prvReadingWater != 0) {

    let diff = state - prvReadingWater
    logger.info(`water reading diff: ${diff}`);

    let cost = diff * elecTariff.state;
    prvCostWater = prvCostWater + cost
    todayCostWater.state = prvCostWater

  }

  prvReadingWater = state
*/

});


solar1.onUpdate(({ state, attributes: { event_type } }, { state: oldState }) => {
  logger.info(state);
  if (!isRealEvent(state, oldState)) return;

  todayCostSolar1.state = todayCostSolar1.state + ((state - oldState) * elecTariff.state);

});

solar2.onUpdate(({ state, attributes: { event_type } }, { state: oldState }) => {
  logger.info(state);
  if (!isRealEvent(state, oldState)) return;

  todayCostSolar2.state = todayCostSolar2.state + ((state - oldState) * elecTariff.state);

});


scheduler.cron({
  schedule: "0 0 * * *",
  exec() {
     //prvCost = 0
     //prvCostWater = 0
todayCost.state = 0
todayCostWater.state = 0
todayCostSolar1.state = 0
todayCostSolar2.state = 0
clive1energy.reset();
clive2energy.reset();

     
  }
});



  
  lifecycle.onReady(() => {

		logger.info("energy ready 2.9");
		
		hass.call.notify.mobile_app_spicepad( { "title":"Info" , "message": "Energy reloaded"});

todayCostSolar1.state = 0
todayCostSolar2.state = 0



//prvCost = toFloat(todayCost.state)
//logger.info(`prvCost: ${prvCost}`);



    
  });


const toFloat = (value: unknown): number => {
  if (value == null) return 0;
  const n = parseFloat(String(value));
  return isNaN(n) ? 0 : n;
};







}

