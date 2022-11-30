import React, { useContext, useEffect, useState } from 'react';

import AlldeviceTopBar from '../../Components/NewDevice/AlldeviceTopBar';
import TopBar from '../../Components/Navigation/TopBar';
import SubTopBar from '../../Components/Dashboard/SubDashboardTopBar';
import DeviceRawDataTable from '../../Components/NewDevice/DeviceRawDataTable';

import Breadcrumbs from '../../Components/Utilites/Breadcrumbs';
import GoBackBreadcrumbs from '../../Components/Utilites/GoBackBreadcrumbs';
import MenuComponent from '../../Components/Utilites/ActiveInactiveMenu';
import { UPDATE_DEVICE_CONNECTION } from '../../Subscriptions/index';

import CHECKOUTSIDECLICK from '../../Components/Utilites/CheckOutsideClick';

import { useLazyQuery, useQuery, useSubscription } from '@apollo/react-hooks';
import decodeJWT from 'jwt-decode';
import {
	GETCONNECTIONINFOPERDEVICE,
	GETTEMPLATESLIST,
	GETDEVICEDATABYID,
	GET_COMMAND_WIDGETS,
} from '../../Queries';

import { useParams } from 'react-router-dom';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

import Widgets from '../../Components/Dashboard/DashboardNew/WidgetsCopm';

import Loaders from '../../Components/Loader/Loader';

function DeviceDetails(props) {
	let token = localStorage.getItem('btoken');
	let email_id = '';

	if (token) {
		const decoded = decodeJWT(token);
		email_id = decoded.emails[0];
	}

	const { activeMenuState } = useContext(GlobalContextMain);
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	let context = useContext(GlobalContextMain);
	let params = useParams();

	let device_id = parseInt(
		params.device_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
	);
	let Tempplate_id = parseInt(
		params.device_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[2]
	);
	let t = context.deviceDataById;

	const { loading: connLoading, data: connectionData } = useQuery(
		GETCONNECTIONINFOPERDEVICE,
		{
			variables: { device_id: device_id },
		}
	);
	const {
		data: deviceUpdateSubs,
		error: errordeviceUpdateSubs,
	} = useSubscription(UPDATE_DEVICE_CONNECTION, {
		variables: {
			topic: { topic: 'UPDATE_DEVICE_CONNECTION_STATUS/' + email_id },
		},
	});
	const [
		getcommandsWidgetsGql,
		{ loading: getComandWidgetsLoading, data: getComandWidgetstionData },
	] = useLazyQuery(GET_COMMAND_WIDGETS);
	const { loading: templateListLoading, data: templateList } = useQuery(
		GETTEMPLATESLIST
	);
	const { data: deviceDetailsData, loading: loadingDeviceById } = useQuery(
		GETDEVICEDATABYID,
		{
			variables: {
				device_id: parseInt(
					params.device_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
				),
			},
			fetchPolicy: 'network-only',
		}
	);

	useEffect(() => {
		if (!loadingDeviceById && deviceDetailsData) {
			context.setDeviceDataById(deviceDetailsData.getdeviceById);
		}
	}, [deviceDetailsData, loadingDeviceById]);

	useEffect(() => {
		context.currUrlSetDevice(params.device_id);
	}, [params.device_id]);

	useEffect(() => {
		if (!errordeviceUpdateSubs && deviceUpdateSubs) {
			let d = {
				...t,
				device_conn_status:
					deviceUpdateSubs.UpdateDeviceConnectionStatus.device_conn_status,
			};

			context.setDeviceDataById(d);
		}
	}, [deviceUpdateSubs, errordeviceUpdateSubs]);

	useEffect(() => {
		if (!connLoading) {
			context.connectionInfoDataFunc(connectionData);
		}
		if (!templateListLoading) {
			context.getTemplateListFunc(templateList);
		}
	}, [connLoading, connectionData, templateList, templateListLoading]);

	useEffect(() => {
		if (
			activeMenuState === 'Command' &&
			deviceDetailsData?.getdeviceById.has_command
		) {
			getcommandsWidgetsGql({
				variables: { device_id: device_id },
			});
		}
	}, [activeMenuState, device_id, getcommandsWidgetsGql]);

	return (
		<div>
			<TopBar
				name="IoT Device Management"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<div className="fix_menu">
				<SubTopBar
					searchbox={activeMenuState === 'Command' ? false : true}
					placeHolderForSearch={
						activeMenuState === 'Raw Data'
							? 'Search raw data'
							: 'Search history'
					}
					btnname={
						Tempplate_id
							? [
									{
										button_name: 'Connection Information',
										classN: 'btn-primary pl-2',
										pageRenderedOn: 'DeviceDetails',
										icon: '',
									},
									{
										button_name: 'Manage Device',
										classN: 'btn-primary pl-2',
										pageRenderedOn: 'DeviceDetails',
										icon: 'ri-arrow-down-s-line float-right ml-1',
									},
							  ]
							: [
									{
										button_name: 'Assign template',
										classN: 'btn-primary pl-2',
										pageRenderedOn: 'DeviceDetails',
										icon: '',
									},
									{
										button_name: 'Connection Information',
										classN: 'btn-primary pl-2',
										pageRenderedOn: 'DeviceDetails',
										icon: '',
									},
									{
										button_name: 'Manage Device',
										classN: 'btn-primary pl-2',
										pageRenderedOn: 'DeviceDetails',
										icon: 'ri-arrow-down-s-line float-right ml-1',
									},
							  ]
					}
				/>
				<div className="breadcrumbs">
					<GoBackBreadcrumbs />
					<Breadcrumbs />
				</div>
				<AlldeviceTopBar
					mainHeading={'Device'}
					information={[context.deviceDataById]}
				/>

				<div>
					<MenuComponent
						menus={
							context.deviceDataById.has_command
								? [
										{
											menuName: 'Raw Data',
										},
										{
											menuName: 'Command',
										},
								  ]
								: [
										{
											menuName: 'Raw Data',
										},
								  ]
						}
					/>
				</div>
			</div>

			<div className="mr-3">
				{activeMenuState === 'Raw Data' && (
					<DeviceRawDataTable device_id={device_id} />
				)}

				{activeMenuState === 'Command' && (
					<div className="row mt-3">
						{getComandWidgetsLoading ? (
							<Loaders margin_top={20} />
						) : (
							getComandWidgetstionData?.getDeviceCommandWidgets.map(
								(li, ind) => {
									return (
										<div className="col-md-12 col-lg-12 mb-4">
											<div className="col-12 commonClassWidgetComands">
												<Widgets data={li} ind={ind} />
											</div>
										</div>
									);
								}
							)
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default DeviceDetails;
