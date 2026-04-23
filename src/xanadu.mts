import dayjs from "dayjs";
import { toggleIcons , writeFile, turnedOn } from "./utils.mts";
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { Time } from "@digital-alchemy/automation";
import duration from "dayjs/plugin/duration";
import { parse } from "node-html-parser";


dayjs.extend(duration);

export function Xanadu({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {


const gasLecGazole = synapse.sensor({
  context,
  name: "Petrol Pineuilh Gazole"
});

const gasLecE10 = synapse.sensor({
  context,
  device_class: "monetary",
  name: "Petrol Pineuilh E10"
});




interface FuelPrice {
  description: string;
  price: number;
}

interface GasStation {
  name: string;
  fuels: FuelPrice[];
}

function scrapeGasStations(html: string): GasStation[] {
  const root = parse(html);
  const slides = root.querySelectorAll('[data-gas-station]');

  return slides.map((slide) => {
    const name = slide.querySelector('.dFurz')?.text.trim() ?? '';

    const fuels = slide.querySelectorAll('li.fzCak').map((li) => ({
      description: li.querySelector('.dSEDM')?.text.trim() ?? '',
      price: parseFloat(li.querySelector('.euNiy')?.text.replace('€', '').trim() ?? '0'),

    }));

    return { name, fuels };
  });
}

function findByProperty<T, K extends keyof T>(
  arr: T[],
  key: K,
  value: T[K]
): T | undefined {
  return arr.find(item => item[key] === value);
}




  
  scheduler.cron({
    schedule: CronExpression.EVERY_5_MINUTES,
    async exec () {
    
      const res = await fetch(`https://hc-ping.com/bcb15f5d-896c-4403-b42d-697ec022ec3b`);
      
    }
  });
  

  scheduler.cron({
    schedule: CronExpression.EVERY_HOUR,
    async exec () {
    
    
      const res2 = await fetch('http://www.e.leclerc/mag/e-leclerc-grand-pineuilh');

      const data = await res2.text();
      
      const stations = scrapeGasStations(data);
      //logger.info(JSON.stringify(stations, null, 2));
      gasLecGazole.state = findByProperty( findByProperty(stations, "name", "Station Pineuilh").fuels, "description","B7/Gazole").price;
      gasLecE10.state = findByProperty( findByProperty(stations, "name", "Station Pineuilh").fuels, "description","E10/SP95").price;
  

  
    }
  });
  
  lifecycle.onReady(() => {

    logger.info("xanadu ready 3.101");
    logger.info(process.env.CLIVE);
    

  });



}

