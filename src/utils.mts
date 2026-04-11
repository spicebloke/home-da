import { sleep } from "@digital-alchemy/core";

import dayjs from "dayjs";

import advancedFormat from "dayjs/plugin/advancedFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import * as fs from 'fs';


dayjs.extend(advancedFormat);
dayjs.extend(dayOfYear);
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export function toggleIcons(entity, on: string, off: string) {
  entity.onUpdate(() => {
    entity.icon = entity.is_on ? on : off;
  });
}

export function isRealEvent(newState, oldState) {
  return !(["unavailable", "unknown"].includes(newState) || oldState === "unavailable")
}


export function createDelayer(entityName) {
  let timer: SleepReturn | undefined;
  
  return async function runAfterDelay(seconds: number, entity) {
		console.log('runafterdelay start ' + entityName)
		entity.turn_on();


    if (timer) {
      timer.kill();
    }
    
    timer = sleep( seconds * 1000 );
    await timer;

    //await action();
		entity.turn_off();
	
		console.log('runafterdelay action ' + entityName);

    timer = undefined;
  };
}





export async function onWaitOff(entity, howlong, desc) {

	let timer: SleepReturn;

	console.log('onwaitoff ' + desc);

  // some logic
	entity.turn_on();


  timer?.kill("stop"); // stop previous
  timer = sleep(howlong * 1000); // create new
  await timer;
	
  //logger.info("timer was not cancelled after 24h");
	console.log('onwaitoff done ' + desc);
	
	entity.turn_off();

  timer = undefined;
}


/**
 * Determines if an entity has just been turned on.
 *
 * @param newState - The current state of the entity (should be a string, e.g., "on" or "off").
 * @param oldState - The previous state of the entity (should be a string, e.g., "on" or "off").
 * @returns {boolean} True if the entity changed from "off" to "on", otherwise false.
 *
 * @example
 * turnedOn("on", "off"); // returns true
 * turnedOn("on", "on");  // returns false
 */
export function turnedOn(newState: string, oldState: string): boolean {
  return newState === "on" && oldState === "off"
}


export function writeFile(data: string, filename: string) {


 fs.writeFile(filename, data, 'utf8', (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('File written successfully');
    }
 });

}
 

