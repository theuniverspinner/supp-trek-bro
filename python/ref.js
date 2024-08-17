const supplementsDB = [
  {"id":1723790362104,"name":"cdp, prami","date":"2024-08-14T09:34:32.297Z"},
  {"id":1723790362105,"name":"sjw:2","date":"2024-08-16T09:03:30.799Z"},
  {"id":1723790362106,"name":"l-theanine","date":"2024-08-14T15:38:54.811Z"},
  {"id":1723790362107,"name":"cdp, alcar, b3, ala","date":"2024-08-16T09:03:37.763Z"},
  {"id":1723790362108,"name":"0.2 brahmi, ginko","date":"2024-08-15T08:22:29.877Z"},
  {"id":1723790362109,"name":"nac, ala 200, sjw 3, b3 1gr","date":"2024-08-15T11:10:37.831Z"},
  {"id":1723790362110,"name":"lthea, pbark","date":"2024-08-15T14:20:12.081Z"},
  {"id":1723790362111,"name":"piba, awva","date":"2024-08-16T04:39:27.282Z"},
  {"id":1723790362112,"name":"b3, lima, psiy","date":"2024-08-16T05:28:02.487Z"},
  {"id":1723790362113,"name":"alcar","date":"2024-08-16T05:28:28.913Z"},
  {"id":1723790362114,"name":"cdp","date":"2024-08-16T05:32:58.680Z"},
  {"id":1723790362115,"name":"NAC, ALa","date":"2024-08-16T07:16:24.493Z"},
  {"id":1723798996742,"name":"sjw:3","date":"2024-08-17T12:30:58.245Z"},
  {"id":1723813622472,"name":"awva 1.5","date":"2024-08-16T13:07:02.472Z"},
  {"id":1723813721070,"name":"apa 0.46","date":"2024-08-16T13:08:41.070Z"},
  {"id":1723816203922,"name":"ALCAR, ALA","date":"2024-08-17T12:30:40.221Z"},
  {"id":1723816214616,"name":"cdp, b3, sjw2","date":"2024-08-16T13:50:14.616Z"},
  {"id":1723869610578,"name":"NAC","date":"2024-08-17T04:40:10.578Z"},
  {"id":1723871317095,"name":"sjw2","date":"2024-08-17T05:08:37.095Z"},
  {"id":1723872280887,"name":"ACLAR, CDP-choline, APA 0.2","date":"2024-08-17T05:24:40.887Z"},
  {"id":1723883407738,"name":"piba","date":"2024-08-17T08:30:07.738Z"},
  {"id":1723885149261,"name":"ALCAR, sjw2","date":"2024-08-17T08:59:09.261Z"},
  {"id":1723894227519,"name":"ppiba","date":"2024-08-17T12:31:08.896Z"}
];

// Supplements cost details
const supplementsCost = {
  "cdp": {"name": "CDP-Choline", "costPerIntake": 511280 / 60},
  "prami": {"name": "Pramiracetam", "costPerIntake": 77.10},
  "sjw": {"name": "St. John's Wort", "costPerIntake": 190000 / 120 * 2},
  "l-theanine": {"name": "L-Theanine", "costPerIntake": 354000 / 120},
  "alcar": {"name": "Acetyl-L-Carnitine", "costPerIntake": 503000 / 180},
  "b3": {"name": "Vitamin B3", "costPerIntake": 336000 / 100},
  "ala": {"name": "Alpha-Lipoic Acid", "costPerIntake": 242000 / 120 * 2},
};

// Filter supplements taken this week
const thisWeekSupplements = supplementsDB.filter(s => {
  const date = new Date(s.date);
  return date >= new Date("2024-08-11") && date <= new Date("2024-08-17");
});

// Calculate total cost
let totalCost = 0;
thisWeekSupplements.forEach(supplement => {
  const names = supplement.name.split(',').map(name => name.trim().split(':')[0]);
  names.forEach(name => {
    const supplementKey = name.replace(/\d/g, '').trim();
    if (supplementsCost[supplementKey]) {
      totalCost += supplementsCost[supplementKey].costPerIntake;
    }
  });
});

console.log(`Total cost of supplements this week: ${totalCost} VND`);