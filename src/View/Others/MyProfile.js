
import React, { useState, useEffect } from 'react';
import Auth from '../../Context/Auth';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import UserStatisticsView from '../Others/UserStatisticsView';
import { useQuery } from '@apollo/react-hooks';
import { GET_Device_Stats, GET_Dashboard_Stats } from '../../Queries';
const OnclickProfileEdit = () => {
	window.open(
		 'https://wiznetiotb2c.b2clogin.com/wiznetiotb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_wiznetioT-profileediting&client_id=493e4e9b-ec0a-4dde-a717-8ed25c4b6a7d&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fwinciotdashboarddev.azurewebsites.net&scope=openid&response_type=id_token&prompt=login',
		//  'https://wiznetiotb2c.b2clogin.com/wiznetiotb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_wiznetioT-profileediting&client_id=493e4e9b-ec0a-4dde-a717-8ed25c4b6a7d&nonce=defaultNonce&redirect_uri=http://localhost:3000/logout&scope=openid&response_type=id_token&prompt=login',
		'_top'
	);
};
function NewProfileView(props) {
	const [DevicesUsed, setDevicesUsed] = useState(0);
	const [NumMaxDevices, setNumMaxDevices] = useState(0);
	const [NoDashboardUsed, setNoDashboardUsed] = useState(0);
	const [NumMaxDashboards, setNumMaxDashboards] = useState(0);
	const auth = new Auth().currentUser();
	const { loading: loadingDevStats, data: DevStatsData, refetch: refetch1 } = useQuery(
		GET_Device_Stats
	);
	const { loading: loadingDashBStats, data: DashBStatsData, refetch: refetch2 } = useQuery(
		GET_Dashboard_Stats
	);
	// let dispatch = useWidgetDispatch();
	// useEffect(() => {
	//  if (!loadingDevStats && DevStatsData) {
	//      dispatch({
	//          type: 'DEVICE_AND_CAPABILITIES',
	//          payload: DevStatsData.getUserDeviceCount,
	//      });
	//  }
	// }, [DevStatsData, dispatch, loadingDevStats]);
	// console.log("DevStatsData data is", DevStatsData.getUserDeviceCount.numberOfDevicesUsed);
	useEffect(() => {
		if (DevStatsData !== undefined) {
			console.log("Device Stats data is", DevStatsData);
			setDevicesUsed(DevStatsData.getUserDeviceCount.numberOfDevicesUsed);
			setNumMaxDevices(DevStatsData.getUserDeviceCount.maxDevices);
		}
		return () => { };
	}, [DevStatsData]);
	useEffect(() => {
		if (DashBStatsData !== undefined) {
			console.log("Dashboard Stats data is", DashBStatsData);
			setNoDashboardUsed(DashBStatsData.getUserDashboardCount.numberOfDashboardsUsed);
			setNumMaxDashboards(DashBStatsData.getUserDashboardCount.maxDashboards);
		}
		return () => { };
	}, [DashBStatsData]);
	return (
		<>
			<div className="mr-3">
				{/*<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6  ">
					<div className="row no-gutters">
						<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 ml-3">
							<div
								className="btn btn-primary float-right mb-3 editbtnclass "
								onClick={() => OnclickProfileEdit()}>
								Edit
							</div> 
						</div>
					</div>
	              </div>*/}
				<div className="row no-gutters box_style px-3 py-2  col-12 col-md-12 col-lg-12 col-xl-6 ">
					<div className="form-group col-md-6 col-lg-6 col-xl-6">
						<label className="label text-muted required" htmlFor="widget_title">
							Given Name
						</label>
						<div className="fs-6 text-dark">{auth?.name}</div>
					</div>
					<div className="form-group col-md-6 col-lg-6 col-xl-6">
						<label className="label text-muted required" htmlFor="widget_title">
							Surname
						</label>
						<div className="fs-6 text-dark">{auth?.lastName}</div>
					</div>
					<div className="form-group col-md-6 col-lg-6 col-xl-6">
						<label className="label text-muted required" htmlFor="widget_title">
							Country/region
						</label>
						{/* <div>{auth?.country}</div> */}
						<div className="fs-6 text-dark">India</div>
					</div>
					<div className="form-group col-md-6 col-lg-6 col-xl-6">
						<label className="label text-muted" htmlFor="widget_title">
							Email Address
						</label>
						<div className="fs-6 text-dark">{auth?.emails}</div>
					</div>
				</div>
			</div>
			<div className=" mb-4 StatsMenuheight activeclass mr-3 fs-4 mt-4">Statistics</div>
			<div className="box_style mt-2 col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10  ">
				<CardGroup className="mt-3 mb-3 ml-3 mr-3" >
					<Card className="userStats col-xl-4 mr-4">
						<Card.Body>
							<Card.Title className="mt-4 mb-6"><i className={'ri-device-line ri-lg ri-device-circle circleBack-icon'} /></Card.Title>
							<br></br>
							<Card.Text className="StatStyle mt-4">
								<div className="StaTextStyle" refetch1={refetch1()}> {'Devices'}</div>
								{DevicesUsed}/{NumMaxDevices}
							</Card.Text>
						</Card.Body>
						{/* <Card.Footer>
							<small className="text-muted">{"Users can add maximum of"} {NumMaxDevices} {"devices"}</small>
						</Card.Footer> */}
						<div className="text-muted fs-7 mb-2">{"Users can add maximum of"} {NumMaxDevices} {"devices"}</div>
					</Card>
					<Card className="userStats col-xl-4 mr-4">
						<Card.Body>
							<Card.Title className="mt-4 mb-6"><i className={'ri-dashboard-line ri-lg ri-device-circle circleBack-icon'} /></Card.Title>
							<br></br>
							<Card.Text className="StatStyle mt-4">
								<div className="StaTextStyle" refetch2={refetch2()}> {'Dashboards'} </div>
								{NoDashboardUsed}/{NumMaxDashboards}
							</Card.Text>
						</Card.Body>
						{/* <Card.Footer>
							<small className="text-muted">{"Users can add maximum of"} {NumMaxDashboards} {"dashboards"}</small>
						</Card.Footer> */}
						<div className="text-muted fs-7 mb-2">{"Users can add maximum of"} {NumMaxDashboards} {"dashboards"}</div>
					</Card>

					<Card className="userStats col-xl-4 mr-4">
						<Card.Body >

							<Card.Text className="StatStyle ">
								<div className="StaTextStyle"> Telemetry</div>

							</Card.Text>

							<div className=' '><UserStatisticsView /></div>

						</Card.Body>

						<br />
						{/* <Card.Footer>
							<small className="text-muted">{"Users can send max 100 telemetry /device /day"}</small>
						</Card.Footer> */}
						<div className="text-muted fs-7 mb-1 ">Users can send max 1500 telemetry /device /day</div>

					</Card>
				</CardGroup>
			</div>
		</>
	);
}
export default NewProfileView;
