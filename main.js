import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data => {
    console.log(data)

    // Compute total unemployment count for each element
    for (const datum of data) {
        var sum = 0
        for (var key in datum) {
            if (datum.hasOwnProperty(key) && key != 'date') {
                sum += datum[key]
            }
        }
        datum.total = sum
   }

   const areaChart = AreaChart(".areachart")
   areaChart.update(data)

   const stackedAreaChart = StackedAreaChart(".stackedareachart")
   stackedAreaChart.update(data)

   areaChart.on("brushed", (range) => {
       stackedAreaChart.filterByDate(range)
   })

})