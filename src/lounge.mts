import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer } from "./utils.mts";
import { CronExpression,  TServiceParams } from "@digital-alchemy/core";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function Lounge({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {

  const officeWled = hass.refBy.id("light.tz3000_dbou1ap4_ts0505a");
  const motion = hass.refBy.id("binary_sensor.tuyatec_zn9wyqtr_rh3040");
  const spareMotion = hass.refBy.id("binary_sensor.spare_motion");
  const butt = hass.refBy.id("event.bilresa_dual_button_button_2");
 
  const spareLight = hass.refBy.id("light.shellyplus1_7c87ce58f084");
  const delay1 = createDelayer('spare');
  const lamp = hass.refBy.id("light.signify_netherlands_b_v_lwa028");

  const tv = hass.refBy.id("media_player.tv_2");



const restartSmartDnsButton = synapse.button({
  context,
  name: "Reset TV Region",
  device_class: "restart",
  press() {
    logger.info("Restarting system...");


/*
const { exec } = require('child_process');

const cmd = 'npx node-hp-scan-to single-scan -a 192.168.6.137 -o ceb8978917a32bf8c0ad64235ea78f89aef11d08 -d . -s http://192.168.6.41:8000/api/documents/post_document/'
exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
*/

  }
});


  async function updateWaterCosts() {

    const data = await hass.call.recorder.get_statistics({
        statistic_ids: ["sensor.elec_reading_main"],
        start_time: dayjs().startOf("hour").toISOString(),
        period: "hour",
        types: ["change"],
      });

    logger.info(data);

  };


  

  lamp.onUpdate(({ state }) => {
  
    logger.info(state);

    //hass.call.tts.speak( { "entity_id": "tts.piper", "cache": true, "media_player_entity_id": "media_player.kitchen", "message": "Commencing scan", "language": "en_GB"});

  });
  

  tv.onUpdate(({ state }) => {
  
    logger.info(state);

  });


  spareMotion.onUpdate(async ({ state }) => {

	if (state === 'on') {

      await delay1(300, spareLight);		 
	}

  });


  motion.onUpdate(({ state }) => {
  
    logger.info(state);
  
  });
  
  
  butt.onUpdate(({ state }) => {
  
    logger.info(state);
  
  });
  


  lifecycle.onReady(() => {

    logger.info("ready 2.2");

  });
}

