import React, { useState, useEffect, useContext } from 'react';
import EmailModal from '../../Modals/EmailModal';
import { GlobalCOntext } from '../../../Context/GlobalContext';
import { useMutation } from '@apollo/react-hooks';

import DeleteConditionModal from '../../Modals/DeleteCombRUleCond';

import { COMBRULENAMECHECK, DELETECOMRULECONDITION } from '../../../Mutations';

function InputField({
	seteditcombRule,
	errors,
	handleSubmit,
	register,
	combinationRuleFormSubmit,
	combinationalruleEditSubmit,
	circleModal,
	data,
	mac,
	cancelClick,
	CancelClickCombRule,
	loading,
	loadingCompSave,
	loadingEditCompSave,
	viewRuledata,
	c_rule_id,
	mac_address,
	getcruleMutation,
	rowDeleteIndex,
	setRowDeleteIndex,
}) {
	const context = useContext(GlobalCOntext);
	const [showMailDeleteModal, setshowMailDeleteModal] = useState(false);
	const [rukenameStatus, setrukenameStatus] = useState(false);
	const [checkRleRepeat, setcheckRleRepeat] = useState(null);
	const [selectedCompName, setselectedCompName] = useState(0);
	const [showCombCondModal, setshowCombCondModal] = useState(false);
	const [rowHolder, setrowHolder] = useState([
		{ componentName: [], ruleName: [], conditionName: [] },
	]);
	const [emailCheck, setemailCheck] = useState(false);
	const [combRUleName, setcombRUleName] = useState('');
	const [selectedTrigger, setselectedTrigger] = useState('');

	const [triggerData, settriggerData] = useState([
		{ triggerValue: '', triggerName: 'Select operator' },
		{ triggerValue: '||', triggerName: 'OR (if any one condition is true)' },
		{ triggerValue: '&&', triggerName: 'AND(if all conditions are true)' },
	]);

	const [combNationRuleOnchageMutation, { loading: nameLoading }] = useMutation(
		COMBRULENAMECHECK,
		{
			update(proxy, result) {
				let res = result.data.checkCombRuleName;
				if (res === true) {
					setrukenameStatus(true);
				} else {
					setrukenameStatus(false);
				}
			},
		}
	);
	const [deleteComRule, { loading: loadingDeleteCombCondition }] = useMutation(
		DELETECOMRULECONDITION,
		{
			update(proxy, result) {
				setshowCombCondModal(false);
				try {
					getcruleMutation({
						variables: {
							mac_address: mac_address,
							comb_rule_id: parseInt(c_rule_id),
						},
					});
				} catch (error) {}
			},
		}
	);

	useEffect(() => {
		if (data && loading === false) {
			let cName = data.device_components.map((li, ind) => {
				return li || [];
			});
			let rules = data.device_components[0]?.rules || [];
			let conditions = data.device_components[0]?.rules[0]?.conditions || [];
			setrowHolder(
				rowHolder.map((ele) => {
					return {
						...ele,
						componentName: cName,
						ruleName: rules,
						conditionName: conditions,
					};
				})
			);
		}
	}, [loading]);

	useEffect(() => {
		if (viewRuledata !== undefined) {
			setcombRUleName(viewRuledata.comb_rule_name);
			setselectedTrigger(viewRuledata.trigger_operator);

			let cName = data.device_components.map((li, ind) => {
				return li;
			});

			let rowHolderArr = [];
			let rule = [];
			let d = viewRuledata.comb_rule_conditions.map((li, ind) => {
				data.device_components.map((comp_li) => {
					if (li.component_id === comp_li.component_id) {
						comp_li.rules.map((rule_li) => {
							if (rule_li.rule_id === li.rule_id) {
								rule = rule_li;
							}
						});
						rowHolderArr.push({
							componentName: cName,
							ruleName: comp_li.rules,
							conditionName: rule.conditions || [],
						});
					}
				});
			});
			let compId = viewRuledata.comb_rule_conditions.map((li) => {
				return li.component_id;
			});
			setselectedCompName(compId);
			setemailCheck(viewRuledata.emailCheckbox);
			let emailData = viewRuledata.emailDat;
			delete emailData.__typename;
			context.emailSubmitClick(emailData);
			setrowHolder(rowHolderArr);
		}
	}, [viewRuledata, data?.device_components]);

	const combNationRuleOnBlur = async (e) => {
		let d = e.target.value;
		setcheckRleRepeat(d);

		if (d === viewRuledata?.comb_rule_name) {
			errors.comb_rule_name = false;
		} else {
			try {
				await combNationRuleOnchageMutation({
					variables: {
						mac_address: mac,
						comb_rule_name: d,
					},
				});
			} catch (err) {}
		}
	};

	const checkBoxEmail = (e) => {
		let d = e.target.checked;
		if (d === true) {
			setemailCheck(false);
			setemailCheck(true);
			setshowMailDeleteModal(true);
		} else {
			setshowMailDeleteModal(true);
		}
	};
	const closeMailModal = () => {
		setemailCheck(false);
		setshowMailDeleteModal(false);
	};

	const closeMailModalOnEdit = () => {
		setshowMailDeleteModal(false);
	};

	const combNameruleChange = (e) => {
		setcombRUleName(e.target.value);
	};

	const onchangeHandler = (li, e, index, val) => {
		const { name, value } = e.target;
		if (val === 'component_name') {
			let d = data.device_components.map((li, indx) => {
				if (parseInt(li.component_id) === parseInt(value)) {
					setrowHolder(
						rowHolder.map((ele, ind) => {
							if (ind === index) {
								return {
									...ele,
									ruleName: li.rules,
									conditionName: li.rules[0]?.conditions || [],
								};
							} else {
								return {
									...ele,
								};
							}
						})
					);
				}
				return li.component_id;
			});

			setselectedCompName(value);
		}
		if (val === 'rule_name') {
			rowHolder[index].ruleName.map((li, ind) => {
				if (parseInt(li.rule_id) === parseInt(value)) {
					setrowHolder(
						rowHolder.map((ele, ind) => {
							if (ind === index) {
								return {
									...ele,
									conditionName: li.conditions || [],
								};
							} else {
								return {
									...ele,
								};
							}
						})
					);
				}
			});
		}
	};

	const addCondionRow = () => {
		let cName = data.device_components.map((li, ind) => {
			return li;
		});
		let rules = data.device_components[0]?.rules;
		let conditions = data.device_components[0]?.rules[0]?.conditions;
		setrowHolder([
			...rowHolder,
			{ componentName: cName, ruleName: rules, conditionName: conditions },
		]);
	};

	const deleteCondionRow = async (index, dta) => {
		const list = [...rowHolder];
		setRowDeleteIndex(index);
		if (list.length === 1) {
			alert('Cannot delete this row');
		} else {
			if (c_rule_id === 'create') {
				list.splice(index, 1);
				setrowHolder(list);
			} else {
				// await deleteComRule({
				// 	variables: {
				// 		mac_address: mac,
				// 		component_id: parseInt(c_rule_id),sw6\
				// 		condition_id:
				// 			viewRuledata.comb_rule_conditions[index].comb_rule_condition_id
				// 	},
				// });
			}
		}
		if (c_rule_id !== 'create' && list.length > 1) {
			setshowCombCondModal(true);
		}
	};

	const emailClicked = (e) => {
		context.emailSubmitClick(e);
		setshowMailDeleteModal(false);
	};
	const triggerOnchange = (e) => {
		setselectedTrigger(e.target.value);
	};
	const cloaseCombConditionModal = () => {
		setshowCombCondModal(false);
	};
	const deleteCombConditionModal = async (idx) => {
		try {
			await deleteComRule({
				variables: {
					mac_address: mac,
					comb_rule_id: parseInt(c_rule_id),
					comb_rule_condition_id: parseInt(
						viewRuledata.comb_rule_conditions[idx].comb_rule_condition_id
					),
				},
			});
			let newRowHolder = rowHolder.filter((_, i) => {
				return i !== idx;
			});
			setrowHolder(newRowHolder);
			setRowDeleteIndex(null);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<DeleteConditionModal
				cloaseCombConditionModal={cloaseCombConditionModal}
				showCombCondModal={showCombCondModal}
				deleteCombConditionModal={deleteCombConditionModal}
				circleModal={circleModal}
				rowDeleteIndex={rowDeleteIndex}
				loadingDeleteCombCondition={loadingDeleteCombCondition}
			/>

			<EmailModal
				showMailDeleteModal={showMailDeleteModal}
				closeMailModal={closeMailModal}
				closeMailModalOnEdit={closeMailModalOnEdit}
				circleModal={circleModal}
				emailClicked={emailClicked}
				c_rule_id={c_rule_id}
				data={viewRuledata?.emailDat}
			/>
			<form onSubmit={handleSubmit(combinationRuleFormSubmit)}>
				<div className="box_style  px-3 py-3 mt-lg-3 mt-md-5">
					<div>
						<div className="row ml-0">
							<div className="col-12 col-sm-12 col-md-10 col-lg-3 col-xl-3">
								<div className="form-group">
									<label className="label" htmlFor="index+comb_rule_name">
										Combination Rule name
									</label>
									<input
										type="text"
										name="comb_rule_name"
										id="comb_rule_name"
										disabled={nameLoading}
										onBlur={combNationRuleOnBlur}
										onChange={(e) => {
											if (c_rule_id !== 'create') {
											}
											combNameruleChange(e);
										}}
										value={combRUleName}
										className={
											errors.comb_rule_name
												? 'form-control error_input'
												: 'form-control '
										}
										placeholder="combanition Rule name"
										ref={register({
											required: `Name is required`,
										})}
									/>
									{nameLoading && (
										<span className="spinner-border float-right loaderOnInput"></span>
									)}
									{errors.comb_rule_name && (
										<div>
											<span className="text-error">
												{errors.comb_rule_name.message}
											</span>
										</div>
									)}

									{rukenameStatus && (
										<div>
											<span className="text-error">
												This name is already taken
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="box_style  px-3 py-2 mt-4">
					<div className="row">
						<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
							<div className="fs-5">Condition</div>
							<div className="colorLine"></div>
						</div>

						<div className="col-12 col-sm-12 col-md-10 col-lg-6 col-xl-5 mt-2">
							<div className="form-group row">
								<label
									for="inputEmail"
									className="col-lg-5 fs-7 font-weight-light mt-1">
									Trigger the rule if
								</label>
								<div className="col-lg-7">
									<select
										name="trigger_operator"
										ref={register({
											required: `Please select trigger operator`,
										})}
										className={
											errors.trigger_operator
												? 'form-control error_input'
												: 'form-control'
										}
										value={selectedTrigger}
										onChange={(e) => triggerOnchange(e)}>
										{triggerData.map((li, ind) => (
											<option
												value={li.triggerValue}
												disabled={li.triggerValue === ''}>
												{li.triggerName}
											</option>
										))}
									</select>
									{errors.trigger_operator && (
										<div>
											<span className="text-error">
												{errors.trigger_operator.message}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="px-3 pb-2">
						<div className="row">
							{rowHolder.map((rhl, rhind) => (
								<div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 bg-light rounded pt-2 pb-1 mt-3">
									<div className="row">
										<div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
											<div className="row">
												<div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
													<div className="form-group">
														<label
															className="label"
															name={`comb_rule_conditions[${rhind}].component_id`}>
															Component name
														</label>
														<select
															name={`comb_rule_conditions[${rhind}].component_id`}
															className={'form-control'}
															onChange={(e) =>
																onchangeHandler(rhl, e, rhind, 'component_name')
															}
															ref={register({
																required: `Please select a component`,
															})}>
															{rhl.componentName.map((li, index) => (
																<option
																	value={li.component_id}
																	selected={
																		li.component_id ===
																			viewRuledata?.comb_rule_conditions[rhind]
																				?.component_id || 0
																	}>
																	{li.component_name}
																</option>
															))}
														</select>
														{errors.comb_rule_conditions &&
															errors.comb_rule_conditions[rhind] &&
															errors.comb_rule_conditions[rhind]
																.component_id && (
																<div>
																	<span className="text-error">
																		{
																			errors.comb_rule_conditions[rhind]
																				.component_id.message
																		}
																	</span>
																</div>
															)}
													</div>
												</div>
												<div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
													<div className="form-group">
														<label
															className="label"
															htmlFor={`comb_rule_conditions[${rhind}].rule_id`}>
															Select rule
														</label>
														<select
															name={`comb_rule_conditions[${rhind}].rule_id`}
															className={'form-control'}
															ref={register({
																required: `Please select a rule`,
															})}
															onChange={(e) =>
																onchangeHandler(rhl, e, rhind, 'rule_name')
															}>
															{rhl.ruleName.map((li, ind) => (
																<option
																	value={li.rule_id}
																	selected={
																		li.rule_id ===
																			viewRuledata?.comb_rule_conditions[rhind]
																				?.rule_id || 0
																	}>
																	{li.rule_name}
																</option>
															))}
														</select>

														{errors.comb_rule_conditions &&
															errors.comb_rule_conditions[rhind] &&
															errors.comb_rule_conditions[rhind].rule_id && (
																<div>
																	<span className="text-error">
																		{
																			errors.comb_rule_conditions[rhind].rule_id
																				.message
																		}
																	</span>
																</div>
															)}
													</div>
												</div>
												<div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
													<div className="form-group">
														<label
															className="label"
															htmlFor={`comb_rule_conditions[${rhind}].condition_id`}>
															Condition name
														</label>

														<select
															name={`comb_rule_conditions[${rhind}].condition_id`}
															className={'form-control'}
															ref={register({
																required: `Please select a condition`,
															})}>
															{rhl.conditionName?.map((li, index) => (
																<>
																	<option
																		value={li.condition_id}
																		selected={
																			li.condition_id ===
																				viewRuledata?.comb_rule_conditions[
																					rhind
																				]?.condition_id || 0
																		}>
																		{li.condition_name}
																	</option>
																</>
															))}
														</select>

														{errors.comb_rule_conditions &&
															errors.comb_rule_conditions[rhind] &&
															errors.comb_rule_conditions[rhind]
																.condition_id && (
																<div>
																	<span className="text-error">
																		{
																			errors.comb_rule_conditions[rhind]
																				.condition_id.message
																		}
																	</span>
																</div>
															)}
													</div>
												</div>
											</div>
										</div>
										<div
											className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 no-gutters"
											align="right">
											<button
												className="btn p-0 text-danger"
												type="button"
												onClick={() => deleteCondionRow(rhind, rhl)}>
												Delete
												<i className="ri-delete-bin-line ri-lg icon_onbtn ml-2"></i>
											</button>
										</div>
									</div>
								</div>
							))}

							<div
								className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 mt-2 addBtngrp"
								align="right">
								<button
									className="btn btn-light"
									type="button"
									onClick={() => addCondionRow()}>
									<i className="ri-add-circle-fill ri-lg icon_onbtn mr-2"></i>
									add
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="box_style  px-3 py-2 mt-4">
					<div className="fs-4">Action</div>
					<div className="colorLine"></div>
					<div className="form-group row mt-2">
						<label
							for="inputEmail"
							className="col-lg-4 fs-5 font-weight-light mt-1">
							Choose Actions you want to trigger
						</label>
						<div className="col-lg-1 mt-2">
							<input
								type="checkbox"
								name="emailCheckbox"
								checked={emailCheck}
								ref={register({
									required: 'Please check this',
								})}
								aria-label="Checkbox for Email"
								onChange={(e) => checkBoxEmail(e)}
							/>
						</div>
						<label
							className={
								errors.emailCheckbox
									? 'label mt-lg-4 pl-3 pl-lg-0 text-error'
									: 'label mt-lg-4 pl-3 pl-lg-0'
							}>
							Email
						</label>
						<div />
					</div>
					{errors.emailCheckbox && (
						<div align="center" className="mr-5 pr-5">
							<span className="text-error mr-5 pr-5">
								{errors.emailCheckbox.message}
							</span>
						</div>
					)}
				</div>

				<div className="btnAbsolute mr-4 pr-2">
					<button
						className="btn btn-secondary mr-2"
						type="button"
						disabled={
							c_rule_id === 'create' ? loadingCompSave : loadingEditCompSave
						}
						onClick={
							c_rule_id === 'create' ? CancelClickCombRule : cancelClick
						}>
						Cancel
					</button>
					<button
						className="btn btn-primary"
						// onClick={(e) => {
						// console.log(e);
						//     // seteditcombRule(false)
						// }}
						disabled={
							c_rule_id === 'create' ? loadingCompSave : loadingEditCompSave
						}>
						{c_rule_id === 'create' ? 'Create' : 'Save'}
						{loadingCompSave && (
							<span className="spinner-border float-right mt-3"></span>
						)}
						{loadingEditCompSave && (
							<span className="spinner-border float-right mt-3"></span>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}

export default InputField;
