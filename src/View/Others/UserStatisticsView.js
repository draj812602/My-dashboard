import React, { useEffect, useState } from 'react';
import Auth from '../../Context/Auth';
import UserData from './UserStatisticsData'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import BarChart from '../../d3/Charts/BarChart/barchartnew';
import { UPDATENUMBEROFTELEMETRYUSED } from '../../Subscriptions/index'
import decodeJWT from 'jwt-decode';
import { GET_TELEMETRYCOUNT } from '../../Queries';
import { useParams } from 'react-router-dom';
import {
    useWidgetDispatch,
    useWidgetState,
} from '../../Context/WidgetContext';

function UserStatisticsView() {
    var data = [{
        "device_name": "device 1",
        "numberOfTelemetryUsed": 10,
    },
    {
        "device_name": "device 2",
        "numberOfTelemetryUsed": 1,
    },
    {
        "device_name": "device 3",
        "numberOfTelemetryUsed": 2,
    },
    {
        "device_name": "device 4",
        "numberOfTelemetryUsed": 2,
    },
        // {
        //     "device_name": "device 5",
        //     "numberOfTelemetryUsed": 100,
        // }

    ];

    const { loading: loadingtelemetry, data: telemetrydata, refetch } = useQuery(
        GET_TELEMETRYCOUNT,


    );

    let dispatch = useWidgetDispatch();
    useEffect(() => {
        if (!loadingtelemetry && telemetrydata) {
            dispatch({
                type: 'DEVICE_AND_CAPABILITIES',
                payload: telemetrydata.getDeviceTelemetryCount,
            });
        }
    }, [telemetrydata, dispatch, loadingtelemetry]);
    // console.log("data", telemetrydata.getDeviceTelemetryCount.maxTelemetry)
    return (

        telemetrydata?.getDeviceTelemetryCount.length > 0 ? (
            <div >


                <UserData
                    refetch={refetch()}
                    data={telemetrydata.getDeviceTelemetryCount}

                // data={data}
                />

            </div>
        ) : (
            <div>
            <div className='d-flex justify-content-center mt-5 ri-lg ri-cloudy-2-line clould-no-data-icon'>
               </div>
               <div className='d-flex justify-content-center ri-lg ri-close-fill close-nodata-icon'></div>
               <div className='fs-2 text-danger d-flex justify-content-center mt-4 '>no data</div>
               </div>
           
            
        )

    )
}

export default UserStatisticsView;



