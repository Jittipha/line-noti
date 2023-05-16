const services = require("./services");
const year = 2023;
const month = 2; // Note: January is month 0, February is month 1, etc.
const dayOfWeek = 1; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const dayOfMonth = 1;

var listAllDate = [];


const numOccurrences = services.numOccurrencesInMonth(year, month , dayOfWeek)
console.log('numofDay : ' + numOccurrences); // O
let a = 7;
for (let x = 0; x < numOccurrences; x++) {
    let listDate = new Date(year, month, dayOfMonth);

    const currentDayOfWeek = listDate.getDay();
    const daysToAdd = (1 - currentDayOfWeek + a) % (a*2);
    listDate.setDate(dayOfMonth + daysToAdd)
    console.log(listDate)
    listAllDate.push(listDate); 
    a=a+7

}


