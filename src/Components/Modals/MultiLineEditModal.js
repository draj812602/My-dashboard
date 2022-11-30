import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import styles from '../../Styles/Styles';

function MultiLineEditModal({
	showEditMultiModal,
	closeEditModal,
	editWidget,
	loadingEdit,
	dashboardId,
	editmodaldata,
	setshowEditMultiModal,
	// updatedRules,setUpdatedRules,options,setOptions,selectedOption,setSelectedOption,widgetTitle,setWidgetTitle
}) {
	const colorData = [
		{ comp_color_code: '#EE9B26' },
		{ comp_color_code: '#5CB85C' },
		{ comp_color_code: '#54B0CB' },
		{ comp_color_code: '#0D6EFD' },
		{ comp_color_code: '#6B5CDF' },
	];
	const { register, handleSubmit, errors } = useForm();

	const [deviceDataset, setDeviceDataset] = useState(null);
	const [updatedRules, setUpdatedRules] = useState([]);
	const [options, setOptions] = useState([]);
	const [selectedOption, setSelectedOption] = useState();
	const [widgetTitle, setWidgetTitle] = useState('');
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [colorDropIdx, setColorDropIdx] = useState(null);
	const [compAndRules, setCompAndRules] = useState();
	const [colorNode, setColorNode] = useState(null);

	const handleChangeRule = (e, ind) => {
		let arr = [...updatedRules];
		arr[ind] = {
			...arr[ind],
			rule_id: e.value,
			rule_name: e.label,
		};
		setUpdatedRules(arr);

		let selOptCpy = [...selectedOption];
		selOptCpy[ind] = {
			label: e.label,
			value: e.value,
		};
		setSelectedOption(selOptCpy);
	};

	const handleDelete = (e) => {
		let idx = Number(e.target.id);
		if (updatedRules.length > 1) {
			let updatedArr = updatedRules.filter((li) => {
				return li.component_id !== updatedRules[idx].component_id;
			});
			let updatedOptionsArr = options.filter((option, optId) => {
				return optId !== idx && option;
			});
			let selOptArr = selectedOption.filter((opt, id) => {
				return id !== idx && opt;
			});
			let colorsArr = compAndRules.filter((color, id) => {
				return idx !== id;
			});
			setUpdatedRules(updatedArr);
			setOptions(updatedOptionsArr);
			setSelectedOption(selOptArr);
			setCompAndRules(colorsArr);
		} else {
			alert('Atleast one dataset-rule should be there!');
		}
	};

	const handleColorChange = (colorID, index) => {
		if (
			!compAndRules.find((e) => e === colorID) ||
			compAndRules[index] === colorID
		) {
			let compAndRulesCopy = JSON.parse(JSON.stringify(compAndRules));
			compAndRulesCopy[index] = colorID;
			setCompAndRules(compAndRulesCopy);
			let arr = [...updatedRules];
			arr[index] = {
				...arr[index],
				comp_color_code: colorID,
			};
			setUpdatedRules(arr);
			setDropdownOpen(false);
		} else {
			return toast.error("Can't use same color for more than one component!", {
				autoClose: 3000,
			});
		}
	};
	// const submitEditData = () => {

	// 	let finalRulesArr = [
	// 		{ widget_title: widgetTitle, multi_line_chart_data: updatedRules },
	// 	];
	// 	console.log(finalRulesArr);
	// 	setLoadingEdit(false);
	// 	// setshowEditMultiModal(false)
	// };
	const submitEditData = async () => {
		let e = {};
		// let finalRulesArr = [
		// 	{ widget_title: widgetTitle, multi_line_chart_data: updatedRules },
		// ];

		let ar = await updatedRules.map((li, id) => {
			return {
				component_id: li.component_id,
				rule_id: li.rule_id,
				comp_color_code: li.comp_color_code,
			};
		});
		e.dashboard_id = dashboardId;
		e.device_id = editmodaldata.device_id;
		e.widget_title = widgetTitle;
		e.device_name = editmodaldata.device_name;
		e.rule_id = null;
		e.widget_id = editmodaldata.widget_id;
		e.component_id = null;
		e.multi_comp_chart_input = ar;
		e.data_time_interval = editmodaldata.data_time_interval;
		//	console.log(e);

		setTimeout(() => {
			try {
				editWidget({ variables: { input: e } });
			} catch (err) {
				console.log(err);
			}
		}, 1000);
	};

	const closeModal = () => {
		setshowEditMultiModal(false);
		let updatedRulesArr = [];
		let optionArr = [];
		let arr = [];
		deviceDataset !== null &&
			deviceDataset.map((li) => {
				editmodaldata.multi_line_chart_data.map((rule, id) => {
					if (li.dataset_name === rule.sensorName) {
						let rulesArr = [];
						li.rules.map((rule) => {
							rulesArr.push({ label: rule.rule_name, value: rule.rule_id });
						});
						arr.push(rulesArr);
					}
				});
			});
		editmodaldata.multi_line_chart_data.forEach((rule) => {
			updatedRulesArr.push({
				comp_color_code: rule.comp_color_code,
				component_id: rule.component_id,
				sensorName: rule.sensorName,
				rule_id: rule.rule_id,
				rule_name: rule.rule_name,
			});
			optionArr.push({ label: rule.rule_name, value: rule.rule_id });
		});
		setUpdatedRules(updatedRulesArr);
		setSelectedOption(optionArr);
		setOptions(arr);
	};

	//----------------------USE.EFFECTS-------------------------------
	useEffect(() => {
		let arr = [];
		let optionArr = [];
		editmodaldata.multi_line_chart_data.forEach((ele) => {
			arr.push({
				comp_color_code: ele.comp_color_code,
				component_id: ele.component_id,
				sensorName: ele.sensorName,
				rule_id: ele.rule_id,
				rule_name: ele.rule_name,
			});
			optionArr.push({ label: ele.rule_name, value: ele.rule_id });
		});
		setUpdatedRules(arr);
		setSelectedOption(optionArr);
		setWidgetTitle(editmodaldata.widget_title);
	}, []);

	useEffect(() => {
		if (deviceDataset !== null && deviceDataset.length !== 0) {
			let arr = [];
			deviceDataset.map((li) => {
				editmodaldata.multi_line_chart_data.map((rule, id) => {
					if (li.dataset_name === rule.sensorName) {
						let rulesArr = [];
						li.rules.map((rule) => {
							rulesArr.push({ label: rule.rule_name, value: rule.rule_id });
						});
						arr.push(rulesArr);
					}
				});
			});
			setOptions(arr);
		}
	}, [deviceDataset]);

	useEffect(() => {
		if (editmodaldata.user_device_datasetname !== null) {
			let selectedDeviceDatasets = editmodaldata.user_device_datasetname.filter(
				(li) => {
					return editmodaldata.device_name === li.device_name;
				}
			);
			setDeviceDataset(
				selectedDeviceDatasets.length === 0
					? selectedDeviceDatasets
					: selectedDeviceDatasets[0].device_dataset
			);
		}
	}, [editmodaldata.device_name]);

	useEffect(() => {
		if (showEditMultiModal) {
			let arr = [];
			editmodaldata.multi_line_chart_data.forEach((rule) => {
				if (rule.comp_color_code === '#000') {
					arr.push('');
				} else {
					arr.push(rule.comp_color_code);
				}
			});
			setCompAndRules(arr);
		}
	}, [showEditMultiModal]);

	useEffect(() => {
		setColorNode(document.querySelectorAll('.colorBtn'));
	}, [dropdownOpen]);

	return (
		<div>
			<Modal
				show={showEditMultiModal}
				onHide={closeModal}
				backdrop="static"
				size={'lg'}
				keyboard={true}>
				<div className="mb-2 modal_header d-flex">
					{`${editmodaldata.widget_title} - details`}
					<i
						className="ri-close-line ri-lg fs-4 ml-auto"
						onClick={closeModal}></i>
				</div>
				<form onSubmit={handleSubmit(submitEditData)}>
					<div className="form-group">
						<label className="fs-6 label" htmlFor="widget_title">
							Tittle
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
							defaultValue={editmodaldata.widget_title}
							onChange={(e) => {
								setWidgetTitle(e.target.value);
							}}
							ref={register({
								required: 'Title is required',
								maxLength: 28,
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
									Max length of title exceeded
									<span className="text-info">(28)</span>
								</span>
							</div>
						)}
					</div>
					<div className="row fs-5 text-muted mb-2">
						<div className="col-5 ">Component Dataset</div>
						<div className="col-5">Rule</div>
					</div>
					{updatedRules.length > 0 &&
						updatedRules.map((dta, ind) => (
							<div
								className="row fs-4 pb-2"
								style={{ display: 'flex', alignItems: 'center' }}>
								<div className="col-4">{dta.sensorName}</div>

								<Select
									className="col-4 pt-0 pb-0 pl-0 pr-0"
									value={selectedOption[ind]}
									onChange={(e) => handleChangeRule(e, ind)}
									options={options[ind]}
									placeholder={'Select Rule'}
									isDisabled={loadingEdit}
									styles={styles}
								/>

								<div className="col-3">
									<div
										className="colorDropdown"
										onClick={() => {
											setDropdownOpen(!dropdownOpen);
											setDropdownOpen(!dropdownOpen);
											setColorDropIdx(ind);
										}}>
										<div
											style={{
												backgroundColor: compAndRules[ind],
											}}
											className="color"></div>
										<i className="ri-arrow-down-s-line" />
									</div>
									{dropdownOpen && ind === colorDropIdx && (
										<div className="colorDiv">
											<div className="colorPalette colorPaletteEdit">
												{colorData.map((color, id) => {
													return (
														<div
															key={color.comp_color_code}
															className="color colorBtn"
															style={{
																backgroundColor: color.comp_color_code,
															}}
															onMouseEnter={(e) => {
																colorNode[id].children[0].style.display =
																	'block';
															}}
															onMouseLeave={(e) => {
																colorNode[id].children[0].style.display =
																	'none';
															}}
															onClick={() => {
																handleColorChange(color.comp_color_code, ind);
															}}>
															<div
																style={{
																	backgroundColor: color.comp_color_code,
																	border: `2px solid ${color.comp_color_code}80`,
																	outline: `${color.comp_color_code} solid 2px`,
																}}
																className="hoverColor"></div>
														</div>
													);
												})}
											</div>
										</div>
									)}
								</div>

								<div
									className="col-1"
									align="right"
									onClick={(e) => {
										handleDelete(e);
									}}>
									<i
										className="ri-delete-bin-line text-muted delete_rule"
										id={ind}
										role="button"></i>
								</div>
							</div>
						))}

					<div className="mt-3" align="right">
						<button
							className="btn btn-secondary mr-2"
							type="button"
							onClick={closeModal}>
							Cancel
						</button>

						<button className="btn btn-primary" disabled={loadingEdit}>
							Done
							{loadingEdit === true && (
								<span className="spinner-border float-right mt-3"></span>
							)}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
}

export default MultiLineEditModal;
