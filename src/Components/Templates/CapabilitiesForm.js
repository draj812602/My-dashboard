import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../Navigation/TopBar';
import SubTopBar from '../Dashboard/SubDashboardTopBar';

import { toast } from 'react-toastify';

import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

import DeleteModal from '../Modals/GlobalDeleteModal';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GETCAPABILITIES, GETTEMPLATEPUBLISHSTATUS } from '../../Queries';
import { CREATECAPABILITIES, DELETECAPABILITY } from '../../Mutations';

import Loaders from '../../Components/Loader/Loader';

let capabilitiesFormButtons = [
	{
		buttonName: 'Save',
		icon: 'ri-save-line ri-lg float-left mr-1 addline',
		btnClass: 'btn-outline-primary',
	},
	{
		buttonName: 'Add Capability',
		icon: 'ri-add-line ri-lg float-left mr-1 addline',
		btnClass: 'btn-outline-primary',
	},
];

const CapabilitiesForm = ({ getCapData, getCapabilitiesLoading }) => {
	const context = useContext(GlobalContextMain);
	const [showDeleteModal, setshowDeleteModal] = useState(false);

	let params = useParams();
	let tempUrl = parseInt(
		params.template_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
	);
	let componentName = params.component_id?.split(
		'780003a2-2b90-46d2-9af8-f58e9eb41e06'
	)[0];
	let componentId = parseInt(
		params.component_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
	);

	const { handleSubmit, register, errors } = useForm();
	const [rowDataOnclick, setrowDataOnclick] = useState({
		ind: null,
		rowData: null,
	});

	const [formFields, setformFields] = useState([
		{
			component_cap_id: '',
			capability_display_name: '',
			capability_name: '',
			capability_type: 'telemetry',
			capability_data_type: 'integer',
		},
	]);

	useEffect(() => {
		if (
			!getCapabilitiesLoading &&
			getCapData?.getCapabilities?.capabilities !== null
		) {
			console.log(getCapData?.getCapabilities.capabilities);
			if (getCapData?.getCapabilities?.capabilities.length <= 0) {
				setformFields([
					{
						component_cap_id: '',
						capability_display_name: '',
						capability_name: '',
						capability_type: 'telemetry',
						capability_data_type: 'integer',
					},
				]);
			} else {
				setformFields(getCapData?.getCapabilities.capabilities);
			}
		} else {
			setformFields([
				{
					component_cap_id: '',
					capability_display_name: '',
					capability_name: '',
					capability_type: 'telemetry',
					capability_data_type: 'integer',
				},
			]);
		}
	}, [getCapData?.getCapabilities?.capabilities, getCapabilitiesLoading]);

	useEffect(() => {
		context.currUrlSetTemplate(params.template_id);
	}, [params.template_id]);

	const [
		createCapabilities,
		{ loading: loadingCreateCapabilities },
	] = useMutation(CREATECAPABILITIES, {
		update(proxy, { data }) {
			setformFields(data.addOrUpdateCapability.capabilities);

			let dataC = proxy.readQuery({
				query: GETCAPABILITIES,
				variables: { component_id: componentId },
			});

			dataC.getCapabilities.capabilities =
				data.addOrUpdateCapability.capabilities;
			proxy.writeQuery({
				query: GETCAPABILITIES,
				variables: { component_id: componentId },
				data,
			});

			context.setTemplatePublishStatus(false);
			toast.success('Sucessfull', {
				autoClose: 2000,
			});
		},

		refetchQueries: [
			{
				query: GETTEMPLATEPUBLISHSTATUS,
				variables: { template_id: tempUrl },
			},
		],
		awaitRefetchQueries: true,
	});
	const [DeleteCapabilityFunc, { loading }] = useMutation(DELETECAPABILITY, {
		update(proxy, result) {
			const list = [...formFields];
			list.splice(rowDataOnclick.ind, 1);
			setformFields(list);
			setshowDeleteModal(false);
			let data = proxy.readQuery({
				query: GETCAPABILITIES,
				variables: { component_id: componentId },
			});

			data.getCapabilities.capabilities = data.getCapabilities.capabilities.filter(
				(li, ind) =>
					li.component_cap_id !== rowDataOnclick.rowData.component_cap_id
			);

			proxy.writeQuery({
				query: GETCAPABILITIES,
				variables: { component_id: componentId },
				data,
			});
		},
	});

	const handleInputChange = (e, index, name) => {
		const { value } = e.target;

		const list = [...formFields];
		list[index][name] = value;
		setformFields(list);
	};

	const addCapabilities = () => {
		setformFields([
			...formFields,
			{
				component_cap_id: '',
				capability_display_name: '',
				capability_name: '',
				capability_type: 'telemetry',
				capability_data_type: 'integer',
			},
		]);
	};
	const removeRow = (index, clickedRowData) => {
		if (clickedRowData.component_cap_id !== '') {
			setrowDataOnclick(index);
			setrowDataOnclick((rowDataOnclick) => ({
				...rowDataOnclick,
				ind: index,
				rowData: clickedRowData,
			}));
			setshowDeleteModal(true);
		} else {
			const list = [...formFields];
			list.splice(index, 1);
			setformFields(list);
		}
	};
	const btnsClick = (e, li, ind) => {
		if (li.buttonName === 'Add Capability') {
			setformFields([
				...formFields,
				{
					component_cap_id: '',
					capability_display_name: '',
					capability_name: '',
					capability_type: 'telemetry',
					capability_data_type: 'integer',
				},
			]);
		}
	};
	const capabilitiesFormSubmit = async (e) => {
		e.template_id = parseInt(
			context.currUrlNameTemplate.split(
				'780003a2-2b90-46d2-9af8-f58e9eb41e06'
			)[1]
		);
		e.component_id = componentId;

		try {
			await createCapabilities({ variables: { input: e } });
		} catch (error) {
			console.log(error);
		}
	};

	if (getCapabilitiesLoading) return <Loaders margin_top={20} />;
	//console.log(getCapData.getCapabilities.capabilities);
	//Modal code delte

	const ShowDeleteModalFunc = () => {
		setshowDeleteModal(false);
	};
	const DeleteButtonClickModal = async (dta) => {
		try {
			await DeleteCapabilityFunc({
				variables: {
					template_id: parseInt(
						params.template_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
					),
					component_id: componentId,
					component_cap_id: rowDataOnclick.rowData.component_cap_id,
				},
			});
		} catch (error) {
			console.log(error);
			setshowDeleteModal(false);
		}
	};

	const capabilityData = formFields?.filter((item) => {
		return (
			item.capability_display_name
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.capability_name
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.capability_type
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.capability_data_type
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			!context.globalSearchValue
		);
	});

	return (
		<>
			<div className="row no-gutters pr-3 mb-2">
				<DeleteModal
					showDeleteModal={showDeleteModal}
					ShowDeleteModalFunc={ShowDeleteModalFunc}
					DeleteButtonClickModal={DeleteButtonClickModal}
					loading={loading}
					heading={'Do you want to delete this capability ?'}
					openIn={'Template'}
				/>
				<div className="col-md-12 col-lg-12 col-xl-10 Common-box-shadow-radius bg-white">
					<form onSubmit={handleSubmit(capabilitiesFormSubmit)}>
						<div className="px-3 pb-1 pt-2">
							<div className="fs-5">{componentName}</div>
							<div className="fs-6 text-muted">
								Add capabilities specific to this device model.
							</div>

							{capabilitiesFormButtons.map((li, i) => (
								<button
									className={`btn mr-2 mt-2 ${li.btnClass}`}
									key={i}
									type={li.buttonName !== 'Save' && 'button'}
									disabled={loadingCreateCapabilities}
									onClick={(e) => btnsClick(e, li, i)}>
									<span className={`${li.icon} text-primary`}></span>
									{li.buttonName}
									{loadingCreateCapabilities && li.buttonName === 'Save' && (
										<span className="spinner-border float-right"></span>
									)}
								</button>
							))}
						</div>
						<hr />
						<div className=" row no-gutters">
							{capabilityData.map((li, ind) => {
								return (
									<>
										<div className="col-12" key={ind + '1'}>
											<div
												className="row no-gutters FormDynamicInput "
												key={ind + 'a'}>
												<div
													className="form-group col-md-10 col-lg-11 col-xl-11 px-3"
													key={ind + 'b'}>
													<div className="row formPadding" key={ind + 'c'}>
														<>
															<div className="form-group col-md-6 col-lg-3 col-xl-3">
																<label
																	className="label"
																	htmlFor={`capabilities[${ind}].capability_display_name`}>
																	Display name
																</label>

																<input
																	type="text"
																	placeholder="Display Name"
																	name={`capabilities[${ind}].capability_display_name`}
																	className={
																		errors.capabilities &&
																		errors.capabilities[ind] &&
																		errors.capabilities[ind]
																			.capability_display_name
																			? 'form-control error_input'
																			: 'form-control'
																	}
																	onChange={(e) =>
																		handleInputChange(
																			e,
																			ind,
																			'capability_display_name'
																		)
																	}
																	defaultValue={li.capability_display_name}
																	ref={register({
																		required: 'Display Name is required',
																	})}
																/>

																{errors.capabilities &&
																	errors.capabilities[ind] &&
																	errors.capabilities[ind]
																		.capability_display_name && (
																		<div>
																			<span className="text-error">
																				{
																					errors.capabilities[ind]
																						.capability_display_name.message
																				}
																			</span>
																		</div>
																	)}
															</div>

															<input
																type="hidden"
																name={`capabilities[${ind}].component_cap_id`}
																value={li.component_cap_id}
																ref={register}
															/>
															<div className="form-group col-md-6 col-lg-3 col-xl-3">
																<label
																	className="label"
																	htmlFor={`capabilities[${ind}].capability_name`}>
																	Name
																</label>

																<input
																	type="text"
																	placeholder="Name"
																	name={`capabilities[${ind}].capability_name`}
																	className={
																		errors.capabilities &&
																		errors.capabilities[ind] &&
																		errors.capabilities[ind].capability_name
																			? 'form-control error_input'
																			: 'form-control'
																	}
																	onChange={(e) =>
																		handleInputChange(e, ind, 'capability_name')
																	}
																	defaultValue={li.capability_name}
																	ref={register({
																		required: 'Name is required',
																	})}
																/>

																{errors.capabilities &&
																	errors.capabilities[ind] &&
																	errors.capabilities[ind].capability_name && (
																		<div>
																			<span className="text-error">
																				{
																					errors.capabilities[ind]
																						.capability_name.message
																				}
																			</span>
																		</div>
																	)}
															</div>
															<div className="form-group col-md-6 col-lg-3 col-xl-3">
																<label className="label" htmlFor="widget_title">
																	Capability Type
																</label>

																<select
																	name={`capabilities[${ind}].capability_type`}
																	className={
																		errors.capabilities &&
																		errors.capabilities[ind] &&
																		errors.capabilities[ind].capability_type
																			? 'form-control error_input'
																			: 'form-control'
																	}
																	onChange={(e) =>
																		handleInputChange(e, ind, 'capability_type')
																	}
																	value={li.capability_type}
																	ref={register()}>
																	<option value="telemetry">Telemetry</option>
																	<option value="command">command</option>
																</select>
															</div>
															<div className="form-group col-md-6 col-lg-3 col-xl-3">
																<label className="label" htmlFor="widget_title">
																	Data type
																</label>

																<select
																	name={`capabilities[${ind}].capability_data_type`}
																	className={
																		errors.capabilities &&
																		errors.capabilities[ind] &&
																		errors.capabilities[ind]
																			.capability_data_type
																			? 'form-control error_input'
																			: 'form-control'
																	}
																	onChange={(e) =>
																		handleInputChange(
																			e,
																			ind,
																			'capability_data_type'
																		)
																	}
																	value={li.capability_data_type}
																	ref={register()}>
																	{li.capability_type === 'telemetry' ? (
																		<>
																			<option value="integer">Integer</option>
																			<option value="float">Float</option>
																		</>
																	) : (
																		<>
																			<option value="string">String</option>
																			<option value="boolean">Boolean</option>
																		</>
																	)}
																</select>
															</div>
														</>
													</div>
												</div>

												{context.templatePubluishStatus ||
													(!li.component_cap_id && (
														<div className="col-md-2 col-lg-1 col-xl-1 pr-4">
															<i
																className="ri-delete-bin-line ri-lg  delete_rule mt-4 pt-3 float-right  align-content-end h-25"
																onClick={() => removeRow(ind, li)}
																role="button"></i>
														</div>
													))}
											</div>
											<hr />
										</div>
									</>
								);
							})}
							<button
								className="btn btn-outline-primary mb-3 ml-3"
								type="button"
								onClick={(e) => addCapabilities(e)}>
								<span className="ri-add-line ri-lg float-left mr-1 addline text-primary"></span>
								Add Capability
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default CapabilitiesForm;
