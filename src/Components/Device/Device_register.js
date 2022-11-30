/** @format */

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import { useForm, Controller } from 'react-hook-form';
import { REGISTERDEVICE } from '../../Mutations';
import { GETDEVICES } from '../../Queries';
import { DEVICEWSDATA } from '../../Subscriptions';
import { toast } from 'react-toastify';
import DeviceList from '../../Components/Device/show_device_list';
import Empty from '../../Components/Device/emptyDevice';
import GlobalSearchComp from '../GlobalSearch';

import Select from 'react-select';
import countryList from 'react-select-country-list';

import decodeJWT from 'jwt-decode';

import '../../Styles/device.css';
import '../../Styles/RuleSetting.css';
import styles from '../../Styles/Styles.js';
import Loaders from '../../Components/Loader/Loader';
import TopBar from '../Navigation/TopBar';

function Device_register(props) {
	let history = useHistory();
	let token = localStorage.getItem('btoken');
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	let email_id;
	if (token) {
		const decoded = decodeJWT(token);
		email_id = decoded.emails[0];
	}
	//console.log(email_id);
	// eslint-disable-next-line no-unused-vars
	const [valueCountry, setCountryValue] = useState();
	const options = useMemo(() => countryList().getData(), []);

	const [searchStatus, setSearchState] = useState('');
	const [show, setshow] = useState(false);
	const [showDevice, setshowDevice] = useState(false);
	const [circleloading, setcircleloading] = useState(false);
	const [disabled, setdisabled] = useState(false);
	const { register, handleSubmit, errors, control } = useForm();
	const { loading, data: dta } = useQuery(GETDEVICES);
	// const [show_twin_modal, setshow_twin_modal] = useState(false);
	// const [twinClickedData, settwinClickedData] = useState(null);
	const [deviceList, setdeviceList] = useState(null);
	// eslint-disable-next-line no-unused-vars
	const { data: deviceSubsData, error: deviceSubsError } = useSubscription(
		DEVICEWSDATA,
		{
			variables: { topic: { topic: 'isDeviceActivated/' + email_id } },
		}
	);

	const [Regoseter_device] = useMutation(REGISTERDEVICE, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: GETDEVICES,
			});

			data.get_user_devices = [
				result.data.register_user_device,
				...data.get_user_devices,
			];

			proxy.writeQuery({ query: GETDEVICES, data });
			setdeviceList(data.get_user_devices);

			toast.success(result.data.register_user_device, {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			setcircleloading(false);
			setdisabled(false);
			setshow(false);
		},
	});

	useEffect(() => {
		if (dta !== undefined && dta.get_user_devices.length > 0) {
			setshowDevice(true);
			setdeviceList(dta.get_user_devices);
		}
		return () => {};
	}, [dta]);

	if (deviceSubsData && deviceSubsData.deviceSubsData !== null) {
		dta &&
			dta.get_user_devices.forEach((li) => {
				if (li.mac_address === deviceSubsData.isDeviceActivated?.device_name) {
					li.is_activated = deviceSubsData.isDeviceActivated?.is_activated;
				}
			});
	}

	if (loading) {
		return <Loaders />;
	}

	const Register_device_btn = () => {
		setshow(true);
	};
	const cancel = () => {
		setshow(false);
		if (deviceList !== null && deviceList.length > 0) {
			setshowDevice(true);
		} else {
			setshowDevice(false);
		}
	};
	const Register_device = async (e) => {
		setcircleloading(true);
		setdisabled(true);

		try {
			await Regoseter_device({ variables: { input: e } });
		} catch (err) {
			setcircleloading(false);
			setdisabled(false);
			setshow(true);

			if (deviceList !== null) {
				setshowDevice(true);
			} else {
				setshowDevice(false);
			}
		}
	};

	const search_trigger = (e) => {
		setSearchState(e.target.value);
	};

	const devices = deviceList?.filter((item) => {
		return (
			item.mac_address.toLowerCase().includes(searchStatus.toLowerCase()) ||
			!searchStatus
		);
	});

	const Register_device_ = () => {
		setshowDevice(true);
		setshow(true);
	};

	const DeviceSettingClick = (item) => {
		localStorage.setItem('mac_address', item.mac_address);
		history.push(`/device/${item.mac_address}`);
	};

	return (
		<div>
			{dta && dta.get_user_devices.length <= 0 && showDevice === false && (
				<Empty Register_device_={Register_device_} />
			)}

			{showDevice && dta.get_user_devices.length > 0 && (
				<>
					<div>
						<TopBar
							name="Device & Rule"
							searchbox={true}
							registerDevice={true}
							search_trigger={search_trigger}
							Register_device_btn={Register_device_btn}
							sidebarToggle={sidebarToggle}
							setSearchState={setSearchState}
							searchStatus={searchStatus}
						/>
						{/* </div> */}

						<div className="row no-gutters device_box">
							{devices?.length > 0 ? (
								devices.map((li, index) => (
									<div
										key={index}
										className="form-group col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
										<div
											className={
												li.is_activated
													? 'col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11 device_container pl-2 pr-3 py-3'
													: 'col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11 device_container_notactive pl-2 pr-3 py-3'
											}>
											<DeviceList
												li={li}
												index={index}
												DeviceSettingClick={DeviceSettingClick}
											/>
										</div>
									</div>
								))
							) : (
								<>
									<GlobalSearchComp
										searchData={searchStatus}
										searchFor={'MAC address'}
									/>
								</>
							)}
						</div>
					</div>
				</>
			)}

			<Modal
				show={show}
				dialogClassName="device_modal_class"
				onHide={cancel}
				backdrop="static"
				keyboard={true}>
				<div className="container_modal">
					<div className="d-flex mb-2">
						<span className="modal_header">Device register</span>
						<i
							className="ri-close-line ri-lg ml-auto fs-4"
							onClick={cancel}></i>
					</div>
					<form onSubmit={handleSubmit(Register_device)}>
						<label className="label" htmlFor="mac_address">
							MAC Address
						</label>
						<div className="form-group">
							<input
								type="text"
								name="mac_address"
								id="mac_address"
								className={
									errors.mac_address
										? 'form-control error_input '
										: 'form-control '
								}
								placeholder="MAC Address"
								ref={register({
									required: 'MAC Address is required',
									pattern: {
										value: /^[0-9a-f]{1,2}([\\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/,
										message: 'invalid MAC address',
									},
								})}
							/>

							{errors.mac_address && (
								<div>
									<span className="text-error">
										{errors.mac_address.message}
									</span>
								</div>
							)}
						</div>
						<div className="form-group">
							<label className="label" htmlFor="deviceLocation">
								Country
							</label>

							<Controller
								name="country"
								as={Select}
								styles={styles}
								defaultValue=""
								options={options}
								value={valueCountry}
								control={control}
								rules={{ required: true }}
							/>
							{errors.country && errors.country.type === 'required' ? (
								<div>
									<span className="text-error">Please select a country</span>
								</div>
							) : null}
						</div>
						<div className="form-group">
							<label className="label" htmlFor="deviceLocation">
								Site location
							</label>
							<input
								type="text"
								name="deviceLocation"
								id="deviceLocation"
								className={
									errors.deviceLocation
										? 'form-control error_input  text-capitalize'
										: 'form-control  text-capitalize'
								}
								placeholder="Location"
								ref={register({
									required: 'Location is required',
								})}
							/>

							{errors.deviceLocation && (
								<div>
									<span className="text-error">
										{errors.deviceLocation.message}
									</span>
								</div>
							)}
						</div>
						<div className="mt-4" align="right">
							<button
								className="btn btn-secondary mr-2"
								type="button"
								disabled={disabled}
								onClick={cancel}>
								Cancel
							</button>

							<button className="btn btn-primary" disabled={disabled}>
								Done
								{circleloading === true && (
									<span className="spinner-border float-right mt-3"></span>
								)}
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
}

export default Device_register;
