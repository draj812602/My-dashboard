import React from 'react';
import LineChart from './LineChart/LineChartNew';
import BarChart from './BarChart/barchartnew';
import PieChart from './PieChart/PieChart';
// import GaugeChart from './GaugeChart/GaugeChart';
import ValueChart from './ValueChart/showLatestValue'

let chartDataValue;

//const Charts = memo(
function ChartsContainer(props) {
    //console.log("Chart Main Re-renders")

    const { chartType, data } = props;
    // console.log('Chart values: ', data);

    if (chartType !== null && data !== null) {
        chartDataValue = data;
    }


    if (chartType === 'ColumnChart' && data !== null)
        return <BarChart
            data={data}
        />;


    else if (chartType === 'LineChart' && data !== null)
        return <LineChart
            data={data}
        />
    else if (chartType === 'GaugeChart' && data !== null)
        return <ValueChart
        />;
}
//);

export { ChartsContainer, chartDataValue };
