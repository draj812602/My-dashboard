import React from 'react';

function InputField({
	inputList,
	handleAddClick,
	handleSubmit,
	errors,
	register,

	onCHangeConditionName,

	nameLoading,
	rukenameStatus,
	onChangeColor,
	onCHangeMinSlider,
	onChangeMaxSlider,
	component_id,
	FormSubmit,
	circleLoading,
	BackTORUles,
	RemoveCondition,
	isEditable,
	DeleteRule,
	rData,
	onCHangeRulename,
	showEdit,
	EditConditions,
	CancelClick,
	ruleNameCHange,
	ruleNameloading,
}) {
	return (
		<form onSubmit={handleSubmit(FormSubmit)}>
			<div className="rule_nameContainer px-4 py-3">
				<div>
					<div className="row ml-0">
						<div className="col-12 col-sm-12 col-md-10 col-lg-5 col-xl-4">
							<div className="form-group">
								<label className="label" htmlFor="index+rule_name">
									Rule name
								</label>
								<input
									type="text"
									name="rule_name"
									id="rule_name"
									disabled={showEdit || nameLoading}
									value={rData && rData.rule_name}
									onChange={onCHangeRulename}
									onBlur={ruleNameCHange}
									className={
										errors.rule_name
											? 'form-control error_input '
											: 'form-control '
									}
									placeholder="Rule name"
									ref={register({
										required: `Rule name is required`,
									})}
								/>
								{nameLoading && (
									<span className="spinner-border float-right loaderOnInput"></span>
								)}
								{errors.rule_name && (
									<div>
										<span className="text-error">
											{errors.rule_name.message}
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
					<hr></hr>
					<input
						type="hidden"
						name="mac_address"
						ref={register}
						value={localStorage.getItem('mac_address')}
					/>

					{rData.rule_id && (
						<input
							type="hidden"
							name="rule_id"
							ref={register}
							value={rData.rule_id}
						/>
					)}
					{
						<input
							type="hidden"
							name="component_id"
							ref={register}
							value={component_id}
						/>
					}
					<div>
						{inputList.map((li, index) => (
							<>
								<div className="row ml-0">
									<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex">
										<div className="mb-3">
											<div className="fs-5">Condition</div>
											<div className="colorLine "></div>
										</div>

										<div className="ml-auto">
											{showEdit !== true && (
												<button
													className="btn btn-danger"
													type="button"
													onClick={() => RemoveCondition(li, index, rData)}>
													Remove
												</button>
											)}
										</div>
									</div>

									<div className="col-12 col-sm-12 col-md-10 col-lg-5 col-xl-4">
										<div className="form-group">
											<label
												className="label"
												htmlFor={index + 'condition_name'}>
												Name
											</label>
											<input
												name={`conditions[${index}].condition_name`}
												id={'condition_name' + index}
												value={li.condition_name}
												onChange={(e) => onCHangeConditionName(e, index)}
												disabled={showEdit}
												className={
													errors.condition_name &&
													errors.condition_name[index] &&
													errors.condition_name[index].condition_name
														? 'form-control error_input'
														: 'form-control'
												}
												ref={register({
													required: 'Condition name is required',
												})}
											/>

											{errors.c_name && (
												<div>
													<span className="text-error">
														{errors.c_name.message}
													</span>
												</div>
											)}
											{/*<select
												name={`conditions[${index}].condition_name`}
												id={'condition_name' + index}
												onChange={(e) => onCHangeConditionName(e, index)}
												value={li.condition_name}
												disabled={showEdit}
												className={
													errors.condition_name &&
													errors.condition_name[index] &&
													errors.condition_name[index].condition_name
														? 'form-control error_input'
														: 'form-control'
												}
												ref={register({
													required: 'Please select a name',
												})}>
												<option value="" disabled selected>
													Chose an option
												</option>

												{isEditable === false && li.condition_name !== 'Other' && (
													<>
														<option value="Normal">Normal</option>
														<option value="Alarm">Alarm</option>
														<option value="Critical">Critical</option>
														<option value="Other">Custom</option>
													</>
												)}
												{isEditable === false && li.condition_name === 'Other' && (
													<>
														<option value="Normal">Normal</option>
														<option value="Alarm">Alarm</option>
														<option value="Critical">Critical</option>
														<option value="Other">Custom</option>
													</>
												)}
												{isEditable === true &&
													li.condition_name === 'Other' && (
														<option value="Other">Custom</option>
													)}
												{isEditable === true && li.condition_name !== 'Other' && (
													<>
														<option value="Normal">Normal</option>
														<option value="Alarm">Alarm</option>
														<option value="Critical">Critical</option>
													</>
												)}
												</select>*/}

											{errors.conditions &&
												errors.conditions[index] &&
												errors.conditions[index].condition_name && (
													<div>
														<span className="text-error">
															{errors.conditions[index].condition_name.message}
														</span>
													</div>
												)}
										</div>
									</div>

									{rData.rule_id && (
										<input
											type="hidden"
											name={`conditions[${index}].condition_id`}
											id="condition_id"
											value={li.condition_id}
											className={
												errors.condition_id
													? 'form-control error_input'
													: 'form-control'
											}
											ref={register}
										/>
									)}

									<div className="col-12 col-sm-12 col-md-5 col-lg-2 col-xl-2">
										<div className="form-group">
											<label className="label" htmlFor="index+color">
												Color
											</label>

											<input
												type="text"
												name={`conditions[${index}].color`}
												id="color"
												disabled={true}
												value={li.color}
												className={
													showEdit
														? 'form-control'
														: 'form-control colorEditable'
												}
												placeholder="Color"
												ref={register({
													required: `Color is required`,
												})}
											/>

											{errors.conditions &&
												errors.conditions[index] &&
												errors.conditions[index].color && (
													<div>
														<span className="text-error">
															{errors.conditions[index].color.message}
														</span>
													</div>
												)}
										</div>
									</div>
									<div className="col-12 col-sm-12 col-md-5 col-lg-2 col-xl-1">
										<div className="form-group">
											<label className="label" htmlFor="index+color">
												Color
											</label>
											<input
												type="color"
												className="colorpicker form-control"
												value={li.color}
												disabled={showEdit}
												onChange={(e) => onChangeColor(e, index)}
											/>
											{errors.conditions &&
												errors.conditions[index] &&
												errors.conditions[index].color && (
													<div>
														<span className="text-error">
															{errors.conditions[index].color.message}
														</span>
													</div>
												)}
										</div>
									</div>
								</div>

								<div className="row ml-0 mb-2">
									<div className="form-group col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
										<div className="row">
											<div className="form-group col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
												<label
													className="label"
													htmlFor="index+Minimum_Condition">
													Minimum
												</label>
												<input
													type="number"
													name={`conditions[${index}].Minimum_Condition`}
													value={li.Minimum_Condition}
													disabled={showEdit}
													onChange={(e) => onCHangeMinSlider(e, index)}
													className={
														errors.conditions &&
														errors.conditions[index] &&
														errors.conditions[index].Minimum_Condition
															? 'form-control error_input'
															: 'form-control'
													}
													ref={register({
														required: `Min Condtion is required`,
													})}
												/>
												{errors.conditions &&
													errors.conditions[index] &&
													errors.conditions[index].Minimum_Condition && (
														<div>
															<span className="text-error">
																{
																	errors.conditions[index].Minimum_Condition
																		.message
																}
															</span>
														</div>
													)}
											</div>

											<div className="form-group col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
												<label
													className="label"
													htmlFor="index+Maximum_Condition">
													Maximum
												</label>
												<input
													type="number"
													name={`conditions[${index}].Maximum_Condition`}
													value={li.Maximum_Condition}
													disabled={showEdit}
													onChange={(e) => onChangeMaxSlider(e, index)}
													className={
														errors.conditions &&
														errors.conditions[index] &&
														errors.conditions[index].Maximum_Condition
															? 'form-control error_input'
															: 'form-control'
													}
													ref={register({
														required: `Max Condtion is required`,
														min: {
															value: li.Minimum_Condition,
															message: `Maximum value should be greater than ${li.Minimum_Condition}`,
														},
													})}
												/>
												{errors.conditions &&
													errors.conditions[index] &&
													errors.conditions[index].Maximum_Condition && (
														<div>
															<span className="text-error">
																{
																	errors.conditions[index].Maximum_Condition
																		.message
																}
															</span>
														</div>
													)}
											</div>
										</div>
									</div>
								</div>
								<hr></hr>
							</>
						))}
					</div>

					{isEditable !== true && (
						<div className="btnAbsolute mr-4 pr-2">
							<button
								className="btn btn-secondary mr-2"
								type="button"
								disabled={circleLoading}
								onClick={BackTORUles}>
								Cancel
							</button>
							<button
								className="btn btn-primary"
								disabled={circleLoading || rukenameStatus}>
								Create
								{circleLoading && (
									<span className="spinner-border float-right"></span>
								)}
							</button>
						</div>
					)}

					{isEditable === true && showEdit === true && (
						<div className="btnAbsolute mr-4 pr-2">
							<button
								className="btn btn-danger mr-2"
								type="button"
								onClick={() => DeleteRule(rData)}>
								Remove
							</button>
							<button
								className="btn btn-primary"
								type="button"
								onClick={EditConditions}>
								Edit
							</button>
						</div>
					)}
					{isEditable === true && showEdit === false && (
						<div className="btnAbsolute mr-4 pr-2">
							<button
								className="btn btn-secondary mr-2"
								type="button"
								onClick={CancelClick}>
								Cancel
							</button>

							<button
								className="btn btn-primary"
								disabled={circleLoading || rukenameStatus}>
								Save
								{circleLoading && (
									<span className="spinner-border float-right"></span>
								)}
							</button>
						</div>
					)}
				</div>
			</div>
			{isEditable !== true && inputList.length < 3 && (
				<button
					className="btn plus add_condition mt-2"
					onClick={handleAddClick}
					type="button">
					<i className="ri-add-line add"></i>
				</button>
			)}
		</form>
	);
}

export default InputField;
