import React from 'react';
import { chartDataValue } from '../ChartContainer';

export const ValueChart = () => {
    // const sliceRef = React.createRef();

    //console.log("Gauge Re-renders")

    const selectedData = chartDataValue;
    // console.log('guage', selectedData);

    const value = selectedData[selectedData.length - 1].sensorValue;
    // console.log("selected value", value)



    let sensor_name = selectedData[selectedData.length - 1].sensorName;
    // console.log(sensor_name)

    let time = selectedData[selectedData.length - 1].timestamp;
    // console.log(time)

    return (
        <div>
            <div className='fs-5 text-muted '>{time}</div>

            <div className="d-flex">
                <div className="mx-auto mt-4 value_text text-primary ">
                    {value}

                </div>
            </div>
            <div className="d-flex">
                <div className="mx-auto text-primary capability_text">
                    {sensor_name}
                </div>
            </div>
        </div>
    );
};


export default ValueChart;
