import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer, turnedOn, incrementOverTime } from "./utils.mts";
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { Time } from "@digital-alchemy/automation";
import duration from "dayjs/plugin/duration";


dayjs.extend(duration);

export function Bedroom({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {


    const bathroomLight = hass.refBy.id("light.sonoff_01minizb");
  const bedroomButton = hass.refBy.id("button.ewelink_wb01_identify2");
  const bedroomLight = hass.refBy.id("light.signify_netherlands_b_v_lwa028");

	const delay1 = createDelayer('bedroom');


const meterReading = hass.refBy.id("sensor.elec_power_main");


const meterSolar1 = hass.refBy.id("sensor.elec_power_solar1");
const meterSolar2 = hass.refBy.id("sensor.elec_power_solar2");

const elecCost = hass.refBy.id("sensor.electricity_import_daily_cost");

let allowNotify = true



const meterDesc = synapse.text({
  context,
  name: "Electric use desc"
});

const solarPct = synapse.sensor({
  context,
  name: "SOLAR Percent",
  unit_of_measurement: "%",
  state: 0
});

meterReading.onUpdate(({ state }) => {

	//	logger.info(`current state is ${state}`);
//logger.info(`current state is ${elecCost.state}`);

  if ( state > 7000 && allowNotify ) {

    //hass.call.notify.mobile_app_spicephone( { "title":"Warning" , "message": "the messge"});
    hass.call.notify.mobile_app_spicepad( { "title":"Warning" , "message": "High electric"});
    allowNotify = false;

  }

  let soltot = (meterSolar1.state * -1) + meterSolar2.state
//logger.info(`current state is ${soltot}`);
  let solpct = (soltot / (meterReading.state + soltot)) * 100
  solarPct.state = Math.trunc(solpct);

  let desc = ""

  switch (true) {

    case state < -200:
      desc = "Turn something on";
      break;

    case state < 0:
      desc = "Nice";
      break;

    case state < 400:
      desc = "Ticking along nicely";
      break;

    case state < 1800:
      desc = "Stuff is in use";
      break;


    case state < 3000:
      desc = "A little high";
      break;


    default: 
      desc = "na";


  }

  meterDesc.native_value = desc;





});





bedroomLight.onUpdate((new_state, old_state) => {

		logger.info(`current state is ${new_state.state}`);
logger.info(`prev state is ${old_state.state}`);

		//if (state === 'on') {
			//myLogic(70);
				//onWaitOff(spareLight, 70, 'spare')
			//rundelay();		
//		}

 if (turnedOn(new_state.state, old_state.state)) {
  logger.info("turned on");
bedroomLight.turn_on({brightness_pct: 100});
} else {
logger.info("turned off");
//bedroomLight.turn_off();
}


});



hass.socket.onEvent({
  context,
  event: "zha_event",
  async exec(data) {

		if (data.data.device_ieee == '00:12:4b:00:29:18:e4:04') {

			if (data.data.command === 'toggle') {

				//dooit();
      bedroomLight.toggle();

//				hass.call.music_assistant.play_media( { "media_id":"radio x" , "enqueue": "replace" , "media_type": "radio" , "device_id":"0f8bd126b03cc6663159c8bc1a6d5624" });


/*
		
				if (automation.time.isBefore("AM10:30")) {
					bedroomLight.toggle({brightness_pct: 5});
					logger.info("dim")
				} else {
					logger.info("bright")
					bedroomLight.toggle({brightness_pct: 100});
				}
		*/




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

			if (data.data.command === 'on') {

				bathroomLight.toggle();

			}
		}

  },
});




  
  lifecycle.onReady(() => {

    logger.info("ready 2.5");
  });





scheduler.cron({
  schedule: "43 21 * * *",
  exec() {
     
    hass.call.music_assistant.play_media( { "media_id": "Virgin Radio" , "enqueue": "replace" , "media_type": "radio" , "entity_id": "media_player.den_2" });

    hass.call.media_player.volume_set( { "volume_level": "0.01" , "entity_id": "media_player.den_2" });
    
    let milli = dayjs.duration(2, 'minutes').asMilliseconds();
           
    const playit = incrementOverTime({
    startValue: 0.01,
    endValue: 0.10,
    step: 0.05,
    totalTimeMs: 5 * 60 * 1000,
    onStep: (value) => hass.call.media_player.volume_set( { "volume_level": value, "entity_id": "media_player.den_2" }),
    onComplete: () => logger.info("Done!"),
    });

  }
});






hass.socket.onEvent({
  context,
  event: "state_changed",
  async exec(data) {

		if (data.data.entity_id == 'event.bilresa_dual_button_button_2') {

			//if (data.data.command === 'toggle') {


logger.info(data.data.new_state.attributes.event_type)
				

			//}

			 
		}

  },
});





}

