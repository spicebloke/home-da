import dayjs from "dayjs";
import { toggleIcons , writeFile, createDelayer, turnedOn } from "./utils.mts";
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { Time } from "@digital-alchemy/automation";
import duration from "dayjs/plugin/duration";


dayjs.extend(duration);

export function Wongr({
  automation,
  context,
  hass,
  lifecycle,
  logger,
  scheduler,
  synapse,
}: TServiceParams) {
  

let budget = {}

const budgetGroceries = synapse.sensor({
  context,
  name: "Groceries Budget",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 100
});

const actualGroceries = synapse.sensor({
  context,
  name: "Groceries Spent",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 100
});
const balanceGroceries = synapse.sensor({
  context,
  name: "Groceries Balance",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 100
});

const budgetPetrol = synapse.sensor({
  context,
  name: "Petrol Budget",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 100
});

const actualPetrol = synapse.sensor({
  context,
  name: "Petrol Spent",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 100
});

const balancePetrol = synapse.sensor({
  context,
  name: "Petrol Balance",
  device_class: "monetary",
  unit_of_measurement: "EUR",
  state: 100
});

  
  lifecycle.onReady(() => {

		logger.info("wongr ready 2.9");



getBudget();


//const ret = JSON.stringify(budget)
//logger.info("getting budget");
//logger.info(budget);

//console.log(getCat(budget,"Groceries"))
//






  });



scheduler.cron({
  schedule: "0 * * * *",
  exec() { 

//getBudget()

}
});


async function getBudget() {

let isoMonth = "2026-04"

const res = await fetch(`http://192.168.6.130:5007/v1/budgets/3a585739-969e-4f27-bb83-a0ce8e61d1d7/months/${isoMonth}/categorygroups`, {
  headers: {
    "x-api-key": "Shnarf01708474658",
    "accept": "application/json"
  }
});
const data = await res.json();



//const response = await fetch('http://192.168.6.130:3000/budget?month=2026-03');

//if (!response.ok) {
  //throw new Error(`HTTP error: ${response.status}`);
//}
//logger.info(`HTTP status: ${response.status}`);

//let ret = await response.json();
//logger.info(ret)
budget = data.data;
//logger.info(`HTTP status: ${JSON.stringify(budget)}`);
//logger.info(budget);
logger.info("done")
let cat = getCat("Groceries")

budgetGroceries.state = (cat.budgeted / 100)
actualGroceries.state = ((cat.spent * -1) / 100)
balanceGroceries.state = (cat.balance / 100)

cat = getCat("Petrol") 

budgetPetrol.state = (cat.budgeted / 100)
actualPetrol.state = ((cat.spent * -1) / 100)
balancePetrol.state = (cat.balance / 100)

}


function getCat(cat) {
  for (var cg of budget) {
  
    for (var ca of cg.categories) {
      //console.log(cat)
      if (ca.name == cat) {
        return ca
        break;
      }
    
    }
  }
}



}

