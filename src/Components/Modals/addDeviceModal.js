import React, { useEffect, useRef, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { ADDDEVICE } from '../../Mutations';

import {
	GETTEMPLATESLIST,
	GETDEVICE,
	GETDEVICE_CAPABILITIES,
} from '../../Queries';

import { GlobalContextMain } from '../../Context/GlobalContextOne';
import { SpecialCharValidation } from '../../Files/SpecialCharValidation';

const AddDeviceModal = ({
	triggerAddDeviceModal,
	closeAddDeviceModal,
	settriggerAddDeviceModal,
	randText,
}) => {
	const context = useContext(GlobalContextMain);
	const { loading: getTemplatesLoading, data: templateList } = useQuery(
		GETTEMPLATESLIST
	);

	const [addDevicefun, { loading }] = useMutation(ADDDEVICE, {
		update(proxy, result) {
			let res = result.data.addDevice.data[0];

			let newArray = {
				__typename: 'templateTable',
				column: context.deviceTableData.column || [],
				data: context.deviceTableData.data || [],
			};
			newArray.data.unshift(res);

			let data = proxy.readQuery({
				query: GETDEVICE,
			});

			data.getDevice.data = [res, ...data.getDevice.data];

			proxy.writeQuery({ query: GETDEVICE, data });
			context.addDeviceClick(newArray);
			context.stemodalOpenDeviceTemplate(null);
			settriggerAddDeviceModal(false);
		},
	});

	const { register, handleSubmit, errors } = useForm();
	const AddDeviceModalFunction = async (e) => {
		try {
			await addDevicefun({ variables: { input: e } });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Modal
				size="xs"
				show={triggerAddDeviceModal}
				dialogClassName=""
				backdrop="static"
				onHide={closeAddDeviceModal}>
				<form onSubmit={handleSubmit(AddDeviceModalFunction)}>
					<div className="mb-2 modal_header d-flex">
						<div className="fs-5">Add device</div>
						<i
							className="ri-close-line ri-lg  fs-4 ml-auto"
							onClick={closeAddDeviceModal}></i>
					</div>
					<div className="row">
						<div className="form-group col-12">
							<label className="label" htmlFor="device_name">
								Device name
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="device name"
								name="device_name"
								ref={register({
									required: 'Device name is required',
									pattern: {
										value: SpecialCharValidation,
										message: 'You can not use special character',
									},
								})}
							/>
							{errors.device_name && (
								<div>
									<span className="text-error">
										{errors.device_name.message}
									</span>
								</div>
							)}
						</div>
						<div className="form-group col-12">
							<label className="label" htmlFor="device_identifier">
								device Id
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="Device Id"
								name="device_identifier"
								disabled={true}
								value={randText}
								ref={register()}
							/>
						</div>
						<div className="form-group col-12">
							<label className="label" htmlFor="assigned_to_template">
								Device Template
							</label>

							<select
								className="form-control"
								name="assigned_template"
								ref={register()}
								disabled={getTemplatesLoading}>
								<option value="unassigned">Unassinged</option>
								{templateList?.getTemplateNames?.map((li, ind) => {
									return (
										<option key={li.template_id} value={li.template_name}>
											{li.template_name}
										</option>
									);
								})}
							</select>
							{getTemplatesLoading === true && (
								<span className="spinner-border loaderOnInput ml-2"></span>
							)}
						</div>
					</div>
					<div className="text-right">
						<button
							className="btn btn-secondary mr-2"
							type="button"
							onClick={closeAddDeviceModal}>
							Cancel
						</button>
						<button className="btn btn-primary" disabled={loading}>
							Create
							{loading === true && (
								<span className="spinner-border float-right"></span>
							)}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default AddDeviceModal;
