/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

import styles from '../../Styles/Styles';

import { useWidgetState } from '../../Context/WidgetContext';
import { SpecialCharValidation } from '../../Files/SpecialCharValidation';

function EditModalWidget({
	showEditMdoal,
	CloseEditModal,
	EditWidgetFunc,
	getwidgtDetailsData,
	getwidgtDetailsLoading,
	widgetTitle,
	loadingEditWidget,
}) {
	const { register, handleSubmit, errors } = useForm();
	let { device_and_capabilities, widgetData } = useWidgetState();

	const [deviceList, setdeviceList] = useState([]);
	const [capabilities, setcapabilities] = useState([]);
	const [selectedDevice, setselectedDevice] = useState(null);
	const [selectedCapability, setselectedCapability] = useState(null);
	const [selectedComponent, setselectedComponent] = useState(null);
	const [components, setcomponents] = useState([]);

	useEffect(() => {
		if (!getwidgtDetailsLoading && getwidgtDetailsData) {
			let sd = {
				device_id: getwidgtDetailsData.getWidgetDetails.device_id,
				device_identifier:
					getwidgtDetailsData.getWidgetDetails.device_identifier,
			};
			let Scomp = {
				component_id: getwidgtDetailsData.getWidgetDetails.component_id,
				component_name: getwidgtDetailsData.getWidgetDetails.component_name,
			};
			let sc = {
				component_cap_id: getwidgtDetailsData.getWidgetDetails.component_cap_id,
				capability_display_name:
					getwidgtDetailsData.getWidgetDetails.capability_display_name,
			};

			setselectedDevice(sd);
			setselectedCapability(sc);
			setselectedComponent(Scomp);
		}
	}, [getwidgtDetailsData, getwidgtDetailsLoading]);

	useEffect(() => {
		if (device_and_capabilities) {
			//console.log(device_and_capabilities);
			let d = device_and_capabilities.map((li) => {
				return {
					...li,
					device_id: li.device_id,
					device_identifier: li.device_identifier,
					device_name: li.device_name,
				};
			});
			setdeviceList(d);
			if (!getwidgtDetailsLoading && getwidgtDetailsData) {
				let comp = device_and_capabilities.filter(
					(li) =>
						li.device_id === getwidgtDetailsData.getWidgetDetails.device_id
				);

				setcomponents(comp[0]?.components);
				let cap = comp[0].components.filter(
					(li) =>
						li.component_id ===
						getwidgtDetailsData.getWidgetDetails.component_id
				);

				setcapabilities(cap[0]?.capabilities);
			}
			//let comp = device_and_capabilities[0].components;
		}
	}, [
		device_and_capabilities,
		getwidgtDetailsData,
		getwidgtDetailsLoading,
		setdeviceList,
	]);

	const deviceChange = (e) => {
		let dId = Number(e.currentTarget.value);
		const result = deviceList.find(({ device_id }) => device_id === dId);

		setselectedDevice(result);
		let c = device_and_capabilities.filter((li) => li.device_id === dId);
		setcomponents(c[0].components);

		setcapabilities(c[0]?.components[0]?.capabilities || []);
	};
	const componentOnChange = (e) => {
		let cID = Number(e.currentTarget.value);

		const result = components.find(({ component_id }) => component_id === cID);
		setselectedComponent(result);
		setselectedDevice(result);
		let cap = components.filter((li) => li.component_id === cID);

		setcapabilities(cap[0].capabilities);
	};

	return (
		<div>
			<Modal
				show={showEditMdoal}
				onHide={CloseEditModal}
				backdrop="static"
				size="md"
				keyboard={true}>
				<div className="mb-2  d-flex modal_header">
					{'widget'}
					<i
						className="ri-close-line ri-lg ml-auto fs-4"
						onClick={CloseEditModal}></i>
				</div>
				<form onSubmit={handleSubmit(EditWidgetFunc)} className="mt-2">
					<div className="row">
						<div className="form-group col-12">
							<label className="label" htmlFor="widget_title">
								Widget Title
							</label>
							<input
								type="text"
								name="widget_title"
								id="widget_title"
								defaultValue={widgetTitle}
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
										required: 'There is no device added.',
									})}
									defaultValue={selectedDevice?.device_id}
									onChange={(e) => deviceChange(e)}>
									{deviceList.map((li, ind) => {
										return (
											<option key={ind + 'd'} value={li.device_id}>
												{li.device_identifier}
											</option>
										);
									})}
								</select>
								{getwidgtDetailsLoading && (
									<span className="spinner-border float-right loaderOnInput"></span>
								)}
								{errors.device_id && (
									<div className="text-error">{errors.device_id.message}</div>
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
										required: 'There is no device added.',
									})}
									defaultValue={selectedComponent?.component_id}
									onChange={(e) => componentOnChange(e)}>
									{components.map((li, ind) => {
										return (
											<option key={ind + 'd'} value={li.component_id}>
												{li.component_name}
											</option>
										);
									})}
								</select>
								{getwidgtDetailsLoading && (
									<span className="spinner-border float-right loaderOnInput"></span>
								)}
								{errors.component_id && (
									<div className="text-error">
										{errors.component_id.message}
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
								defaultValue={selectedCapability?.component_cap_id}
								ref={register({
									required: 'No capabilities found',
								})}>
								{capabilities?.map((li, ind) => {
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
						</div>
					</div>
					<div className="float-right">
						<button
							className="btn btn-secondary mr-2"
							type="button"
							disabled={loadingEditWidget}
							onClick={() => {
								CloseEditModal(false);
							}}>
							Cancel
						</button>
						<button className="btn btn-primary" disabled={loadingEditWidget}>
							Edit
							{loadingEditWidget && (
								<span className="spinner-border float-right"></span>
							)}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
}

export default EditModalWidget;
