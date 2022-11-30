/** @format */

import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { SpecialCharValidation } from '../../Files/SpecialCharValidation'

function DashboardNAme(props) {
	const { register, handleSubmit, errors } = useForm();

	const DashName = (event) => {
		event.target.select();
	};

	return (
		<div>
			<Modal
				show={props.show}
				dialogClassName="create_dash_Modal"
				onHide={props.handleClose}
				backdrop="static"
				keyboard={true}>
				<div>
					<div className="d-flex mb-2">
						<div className="modal_header">
							{props.functionClickedOn === 'create'
								? 'Create Dashboard'
								: 'Rename Dashboard'}
						</div>
						<i
							className="ri-close-line ri-lg ml-auto fs-4"
							onClick={props.handleClose}></i>
					</div>

					<form onSubmit={handleSubmit(props.dashboardFunctions)}>
						<div className="form-group">
							<label className="label" htmlFor="dashboard_name">
								Dashboard Name
							</label>
							<input
								type="text"
								name="dashboard_name"
								id="dashboard_name"
								autoFocus={true}
								className={
									errors.dashboard_name
										? 'form-control error_input'
										: 'form-control'
								}
								placeholder="Dashboard Name"
								ref={register({
									required: 'Dashboard name is required',
									pattern: {
										value: SpecialCharValidation,
										message: 'You can not use special character',
									},
								})}
								onFocus={DashName}
								defaultValue={props.currDashboardNameForEdit}
							/>

							{errors.dashboard_name && (
								<div>
									<span className="text-error">
										{errors.dashboard_name.message}
									</span>
								</div>
							)}
						</div>
						<div className="mt-5" align="right">
							<button
								className="btn btn-secondary mr-2"
								type="button"
								disabled={props.loading}
								onClick={props.handleClose}>
								Cancel
							</button>

							<button className="btn btn-primary" disabled={props.loading}>
								Done
								{props.loading && (
									<span className="spinner-border float-right"></span>
								)}
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
}

export default DashboardNAme;
