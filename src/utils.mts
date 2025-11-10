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
 

