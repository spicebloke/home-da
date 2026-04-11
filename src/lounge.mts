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

  const homeZone = hass.refBy.id("input_button.tester");
  const officeWled = hass.refBy.id("light.tz3000_dbou1ap4_ts0505a");
  const motion = hass.refBy.id("binary_sensor.tuyatec_zn9wyqtr_rh3040");
  const spareMotion = hass.refBy.id("binary_sensor.spare_motion");
const butt = hass.refBy.id("event.bilresa_dual_button_button_2");
 
  const spareLight = hass.refBy.id("light.shellyplus1_7c87ce58f084");
 	const delay1 = createDelayer('spare');
const lamp = hass.refBy.id("light.signify_netherlands_b_v_lwa028");

const stringLights = hass.refBy.id("light.string_lights");
const stringLightsScene = hass.refBy.id("select.string_lights_scene");
const tv = hass.refBy.id("media_player.tv_2");

  //toggleIcons(ledAutomation, "mdi:led-strip-variant", "mdi:led-strip-variant-off");




const newswitch = synapse.switch({
  context,
  unique_id: "clive_test_light_synapse",
  name: "Clive Test Light",
  device_class: "outlet",
  is_on: false,
  managed: true
});

const newswitch2 = synapse.number({
  context,
  unique_id: "clive_test_number_synapse2",
  name: "Clive Test number 2",
  native_min_value: 0,
  native_max_value: 1000000,
  mode: "box"
});


const restartSmartDnsButton = synapse.button({
  context,
  name: "Reset TV Region",
  device_class: "restart",
  press() {
    logger.info("Restarting system...");


    //hass.call.music_assistant.play_media( { "media_id": "Virgin Radio" , "enqueue": "replace" , "media_type": "radio" , "entity_id": "media_player.den_2" });

    //hass.call.media_player.volume_set( { "volume_level": "0.2" , "entity_id": "media_player.den_2" });


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



/*

let value = 30;
const target = 70;
const increment = 5;
const intervalMs = 1 * 60 * 1000; // 2 minutes in milliseconds

const interval = setInterval(() => {
  value += increment;
  logger.info(`Value: ${value}`);

  if (value >= target) {
    logger.info("Target reached, stopping.");
    clearInterval(interval);
  }
}, intervalMs);

logger.info(`Starting at ${value}, incrementing by ${increment} every 2 minutes until ${target}.`);
*/


    // Perform restart logic
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


const garageDoor = hass.refBy.id("switch.garage_door_lock");


const garageLock = synapse.lock({
  context,
  name: "Garage Door Lock"
});

garageLock.onUpdate(({ state }) => {





updateWaterCosts()



  
  logger.info(state);

  if (state == 'locked') {
    garageDoor.turn_on();
  }
  if (state == 'unlocked') {
    garageDoor.turn_off();
  }


  });



lamp.onUpdate(({ state }) => {
  
  logger.info(state);

//hass.call.tts.speak( { "entity_id": "tts.piper", "cache": true, "media_player_entity_id": "media_player.kitchen", "message": "Commencing scan", "language": "en_GB"});

  
  });
  

tv.onUpdate(({ state }) => {
  
  logger.info(state);


  });


const mySwitch = hass.refBy.id("input_boolean.elec_peak_hours");

scheduler.cron({
  schedule: "40 12 * * *",
  exec: () => mySwitch.turn_off()
});
scheduler.cron({
  schedule: "40 13 * * *",
  exec: () => mySwitch.turn_on()
});
scheduler.cron({
  schedule: "10 00 * * *",
  exec: () => mySwitch.turn_off()
});
scheduler.cron({
  schedule: "10 07 * * *",
  exec: () => mySwitch.turn_on()
});



scheduler.cron({
  schedule: "43 21 * * *",
  exec() {
     
    hass.call.music_assistant.play_media( { "media_id": "Virgin Radio" , "enqueue": "replace" , "media_type": "radio" , "entity_id": "media_player.den_2" });

    hass.call.media_player.volume_set( { "volume_level": "0.02" , "entity_id": "media_player.den_2" });

let value = 0.01;
const target = 0.10;
const increment = 0.05;
const intervalMs = 1 * 60 * 1000; // 2 minutes in milliseconds

const interval = setInterval(() => {
  value += increment;
  logger.info(`Value: ${value}`);
  hass.call.media_player.volume_set( { "volume_level": value, "entity_id": "media_player.den_2" });

  if (value >= target) {
    logger.info("Target reached, stopping.");
    clearInterval(interval);
  }
}, intervalMs);

logger.info(`Starting at ${value}, incrementing by ${increment} every 2 minutes until ${target}.`);


  }

});



	spareMotion.onUpdate(({ state }) => {

		//logger.info(`current state is ${state}`);

		if (state === 'on') {
			//myLogic(70);
				//onWaitOff(spareLight, 70, 'spare')
			rundelay();		
		}


  });


automation.solar.onEvent({
  eventName: "nightEnd",
  exec() {
    hass.call.notify.mobile_app_spicepad( { "title":"info" , "message": "night end"});
hass.call.notify.mobile_app_spicephone( { "title":"info" , "message": "night end"});
  }
});


automation.solar.onEvent({
  eventName: "nightStart",
  exec() {
    hass.call.notify.mobile_app_spicepad( { "title":"info" , "message": "night start"});
hass.call.notify.mobile_app_spicephone( { "title":"info" , "message": "night start"});


    
  }
});


automation.solar.onEvent({
  eventName: "sunsetStart",
  exec() {
    hass.call.notify.mobile_app_spicepad( { "title":"info" , "message": "sunset start"});
hass.call.notify.mobile_app_spicephone( { "title":"info" , "message": "sunset start"});
  }
});
automation.solar.onEvent({
  eventName: "dusk",
  exec() {

stringLights.turn_on();
    stringLightsScene.select_option({ option: "Spring" });

    hass.call.notify.mobile_app_spicepad( { "title":"info" , "message": "dusk"});
hass.call.notify.mobile_app_spicephone( { "title":"info" , "message": "dusk"});
  }
});
automation.solar.onEvent({
  eventName: "sunset",
  exec() {
    hass.call.notify.mobile_app_spicepad( { "title":"info" , "message": "sunset"});
hass.call.notify.mobile_app_spicephone( { "title":"info" , "message": "sunset"});
  }
});


async function rundelay() {
	await delay1(300, spareLight);		

}
	

  
  homeZone.onUpdate(({ state }) => {
       logger.info("pressed! new version7");



//			myLogic();

       let milli = dayjs.duration(2, 'minutes').asMilliseconds();

       logger.info(milli.toString());

       //officeWled.toggle();
       
       //writeFile("clive.txt",state);

hass.refBy.id("input_boolean.elec_peak_hours").turn_on()
//et oldstate = hass.states.get("sensor.elec_reading_chauffe_eau");
//logger.info(`current state is ${ent.state}`);
//ent.state = 'off'

    
  });

  motion.onUpdate(({ state }) => {
  
  logger.info(state);
  
  });
  
  
butt.onUpdate(({ state }) => {
  
  logger.info(state);
  
  });
  

  // Slightly more resillient state syncs at boot
  lifecycle.onReady(() => {

logger.info("ready 2.2");
    //const holidayLights = hass.refBy.label("holiday_lights");
    //if (holidayLights.some(light => light.state === "on")) {
      //holidayLightSwitch.is_on = true;
    //}
  });
}

