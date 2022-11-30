import React, { useState, useEffect } from 'react';

import { Modal } from 'react-bootstrap';

import { useWidgetState } from '../../Context/WidgetContext';
import { useHistory } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { GETDEVICE_CAPABILITIES } from '../../Queries';

import { useForm } from 'react-hook-form';
import { SpecialCharValidation } from '../../Files/SpecialCharValidation'

const CreateWidgetModal = ({
	ShowCreateWidgetModal,
	setShowCreateWidgetModal,
	CreateWidget,
	CreateWidgetLoading,
	loadingDeviceAndCapabilities,
	deviceAndCapabilities,
}) => {
	const { register, handleSubmit, errors } = useForm();
	let history = useHistory();

	let { ChartTittle } = useWidgetState();
	const [deviceList, setdeviceList] = useState([]);
	const [capabilities, setcapabilities] = useState([]);
	const [selectedDevice, setselectedDevice] = useState(null);
	const [components, setcomponents] = useState([]);
	const [selectedComponents, setselectedComponents] = useState([]);

	useEffect(() => {
		if (deviceAndCapabilities && !loadingDeviceAndCapabilities) {
			let d = deviceAndCapabilities.getDeviceCapability.map((li) => {
				return {
					device_id: li.device_id,
					device_identifier: li.device_identifier,
					device_name: li.device_name,
				};
			});

			let comp = deviceAndCapabilities.getDeviceCapability[0].components;
			let capab =
				deviceAndCapabilities.getDeviceCapability[0]?.components[0]
					?.capabilities || [];

			setcomponents(comp);
			setcapabilities(capab);
			setdeviceList(d);
			setselectedDevice(d[0]);
		}
	}, [
		deviceAndCapabilities,
		loadingDeviceAndCapabilities,
		setcapabilities,
		setdeviceList,
	]);

	const deviceChange = (e) => {
		let dId = Number(e.currentTarget.value);
		const result = deviceList.find(({ device_id }) => device_id === dId);

		setselectedDevice(result);
		let c = deviceAndCapabilities.getDeviceCapability.filter(
			(li) => li.device_id === dId
		);
		setcomponents(c[0].components);
		setcapabilities(c[0]?.components[0]?.capabilities || []);
	};

	const componentOnChange = (e) => {
		let cID = Number(e.currentTarget.value);

		const result = components.find(({ component_id }) => component_id === cID);
		setselectedComponents(result);
		setselectedDevice(result);
		let cap = components.filter((li) => li.component_id === cID);

		setcapabilities(cap[0].capabilities);
	};
	const AddDevice = () => {
		history.push('Device');
	};
	const AddCapabilities = () => {
		history.push(
			`/Device/${selectedDevice.device_name
			}780003a2-2b90-46d2-9af8-f58e9eb41e06${selectedDevice.device_id
			}780003a2-2b90-46d2-9af8-f58e9eb41e06${null}`
		);
	};

	const AddComponents = () => {
		history.push(
			`/Device/${selectedDevice.device_name
			}780003a2-2b90-46d2-9af8-f58e9eb41e06${selectedDevice.device_id
			}780003a2-2b90-46d2-9af8-f58e9eb41e06${null}`
		);
	};

	return (
		<Modal
			size="xs"
			show={ShowCreateWidgetModal}
			dialogClassName="save_chart_modal_class"
			onHide={() => setShowCreateWidgetModal(false)}
			backdrop="static"
			keyboard={true}>
			<div className="d-flex">
				<span className="modal_header ">{`${ChartTittle?.name}`}</span>
				<i
					className="ri-close-line ri-lg ml-auto fs-4"
					onClick={() => setShowCreateWidgetModal(false)}></i>
			</div>

			<form onSubmit={handleSubmit(CreateWidget)} className="mt-2">
				<div className="row">
					<div className="form-group col-12">
						<label className="label" htmlFor="widget_title">
							Widget Title
						</label>
						<input
							type="text"
							name="widget_title"
							id="widget_title"
							className={
								errors.widget_title
									? 'form-control error_input'
									: 'form-control'
							}
							placeholder="Title"
							ref={register({
								required: 'Title is required',
								maxLength: 25,
								pattern: {
									value: SpecialCharValidation,
									message: 'You can not use special character',
								},
							})}
						/>

						{errors.widget_title && (
							<div>
								<span className="text-error">
									{errors.widget_title.message}
								</span>
							</div>
						)}
						{errors.widget_title && errors.widget_title.type === 'maxLength' && (
							<div>
								<span className="text-error">
									Max length of title exceeded{' '}
									<span className="text-info">(25)</span>
								</span>
							</div>
						)}
					</div>
					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
						<label className="label" htmlFor="device_id">
							Select Device
						</label>

						<div className="form-group">
							<select
								className="form-control"
								name="device_id"
								ref={register({
									required: 'There is no device added. Please add one',
								})}
								onChange={(e) => deviceChange(e)}>
								{deviceList.map((li, ind) => {
									return (
										<option key={ind + 'd'} value={li.device_id}>
											{li.device_identifier}
										</option>
									);
								})}
							</select>
							{loadingDeviceAndCapabilities && (
								<span className="spinner-border float-right loaderOnInput"></span>
							)}
							{errors.device_id && (
								<div className="text-error">{errors.device_id.message}</div>
							)}
							{!loadingDeviceAndCapabilities && deviceList.length === 0 && (
								<div className="text-info fs-6">
									No device added,
									<button
										className="btn btn-link position-relative pt-1"
										type="button"
										onClick={AddDevice}>
										please add one
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
						<label className="label" htmlFor="component_id">
							Select Component
						</label>

						<div className="form-group">
							<select
								className="form-control"
								name="component_id"
								ref={register({
									required: 'No components found',
								})}
								onChange={(e) => componentOnChange(e)}>
								{components.map((li, ind) => {
									return (
										<option key={ind + 'd'} value={li.component_id}>
											{li.component_name}
										</option>
									);
								})}
							</select>
							{loadingDeviceAndCapabilities && (
								<span className="spinner-border float-right loaderOnInput"></span>
							)}
							{errors.component_id && (
								<div className="text-error">{errors.component_id.message}</div>
							)}
							{!loadingDeviceAndCapabilities && components.length === 0 && (
								<div className="text-info fs-6">
									No component added,
									<button
										className="btn btn-link position-relative pt-1"
										type="button"
										onClick={AddComponents}>
										please add one
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="form-group col-12">
						<label className="label" htmlFor="component_cap_id">
							Select Capability
						</label>
						<select
							className="form-control"
							name="component_cap_id"
							ref={register({
								required: 'No capabilities found',
							})}>
							{capabilities.map((li, ind) => {
								return (
									<option key={ind + 'b'} value={li.component_cap_id}>
										{li.capability_display_name}
									</option>
								);
							})}
						</select>
						{errors.component_cap_id && (
							<div className="text-error">
								{errors.component_cap_id.message}
							</div>
						)}
						{!loadingDeviceAndCapabilities && capabilities.length === 0 && (
							<div className="text-info fs-6">
								No Template assigned for selected device
								<button
									className="btn btn-link position-relative pt-1"
									type="button"
									onClick={AddCapabilities}>
									Please assign one
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="float-right">
					<button
						className="btn btn-secondary mr-2"
						type="button"
						disabled={CreateWidgetLoading}
						onClick={() => {
							setShowCreateWidgetModal(false);
						}}>
						Cancel
					</button>
					<button className="btn btn-primary" disabled={CreateWidgetLoading}>
						Create
						{CreateWidgetLoading && (
							<span className="spinner-border float-right"></span>
						)}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default CreateWidgetModal;
