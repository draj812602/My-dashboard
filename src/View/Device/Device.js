import React, { useContext, useState } from 'react';

import DeviceTable from '../../Components/NewDevice/DeviceTable';
import Topbar from '../../Components/Navigation/TopBar';
import SubTopBar from '../../Components/Dashboard/SubDashboardTopBar';
import CapabilitiesForm from '../../Components/Templates/CapabilitiesForm';
import AlldeviceTopBar from '../../Components/NewDevice/AlldeviceTopBar';

import { useQuery } from '@apollo/react-hooks';
import { GETDEVICE } from '../../Queries';

import NoTemplate from '../../Components/Utilites/NoDataPage';

import Loaders from '../../Components/Loader/Loader';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

const Device = () => {
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	let context = useContext(GlobalContextMain);
	const [createDevice, setcreateDevice] = useState(false);

	const { loading: DeviceLoading } = useQuery(GETDEVICE, {
		onCompleted: (data) => {
			context.addDeviceClick(data.getDevice);
		},
		fetchPolicy: 'network-only',
	});
	const addDevice = () => {
		setcreateDevice(true);
	};

	return (
		<div>
			<Topbar
				name="IoT Device Management"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<SubTopBar
				searchbox={
					context.deviceTableData.length === 0 ||
					context.deviceTableData?.data.length === 0
						? false
						: true
				}
				placeHolderForSearch="Search device"
				createDevice={createDevice}
				btnname={[
					{
						button_name: 'New',
						classN: 'btn-primary pl-2',
						pageRenderedOn: 'Device',
						icon: 'ri-add-line ri-lg float-left mr-1 addline',
					},
				]}
			/>

			<AlldeviceTopBar mainHeading={'Device'} information={[]} />

			{
				<div className="mr-3">
					{DeviceLoading ? (
						<Loaders margin_top={80} />
					) : context.deviceTableData.length === 0 ||
					  context.deviceTableData?.data.length === 0 ? (
						<NoTemplate
							Text="No device added"
							buttonName="Add Device"
							addDevice={addDevice}
						/>
					) : (
						<DeviceTable />
					)}
				</div>
			}
		</div>
	);
};

export default Device;
