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



  
  scheduler.cron({
    schedule: CronExpression.EVERY_5_MINUTES,
    async exec () {
    
      const res = await fetch(`https://hc-ping.com/bcb15f5d-896c-4403-b42d-697ec022ec3b`);
    
    
    const res2 = await fetch('http://www.e.leclerc/mag/e-leclerc-grand-pineuilh');

const data = await res2.text();


//console.log(data)
const stations = scrapeGasStations(data);
logger.info(JSON.stringify(stations, null, 2));

    
    
    
    
    }
  });
  
  lifecycle.onReady(() => {

    logger.info("xanadu ready 3.1");
    logger.info(process.env.CLIVE);
    
    
    
    
    
    
    
    
    
    
    

  });



}

