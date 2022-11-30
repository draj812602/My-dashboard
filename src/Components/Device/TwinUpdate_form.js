/** @format */

import React from 'react';
import { useForm } from 'react-hook-form';

function TwinUpdate_form(props) {
	const { register, handleSubmit, errors } = useForm();
	return (
		<div>
			<form onSubmit={handleSubmit(props.save_data)}>
				<div>
					<div className="form-group input_form_label">
						<input
							type="text"
							name="mac_address"
							id="mac_address"
							className={
								errors.mac_address ? 'form-control error_input' : 'form-control'
							}
							placeholder="MAC Address"
							disabled
							ref={register({
								required: 'MAC Address is required',
							})}
							defaultValue={
								props.data.data !== null && props.data.data.mac_address
							}
						/>
						<label className="common_label_form" htmlFor="mac_address">
							MAC Address
						</label>

						{errors.mac_address && (
							<div>
								<span className="text-danger">
									{errors.mac_address.message}
								</span>
							</div>
						)}
					</div>
				</div>
				<div>
					<div className="form-group input_form_label">
						<input
							type="text"
							name="device_type"
							id="device_type"
							className={
								errors.device_type ? 'form-control error_input' : 'form-control'
							}
							placeholder="Device Type"
							disabled
							ref={register({
								required: 'Device Type is required',
							})}
							defaultValue={
								props.data.data !== null && props.data.data.device_type
							}
						/>
						<label className="common_label_form" htmlFor="device_type">
							Device Type
						</label>

						{errors.device_type && (
							<div>
								<span className="text-danger">
									{errors.device_type.message}
								</span>
							</div>
						)}
					</div>
				</div>
				<div>
					<div className="form-group input_form_label">
						<input
							type="text"
							name="Location"
							id="Location"
							className={
								errors.Location ? 'form-control error_input' : 'form-control'
							}
							placeholder="Location"
							ref={register({
								required: 'Location is required',
							})}
							disabled
							defaultValue={
								props.data.data !== null && props.data.data.location
							}
						/>
						<label className="common_label_form" htmlFor="Location">
							Tittle
						</label>

						{errors.Location && (
							<div>
								<span className="text-danger">{errors.Location.message}</span>
							</div>
						)}
					</div>
				</div>
				<div>
					<div className="form-group input_form_label">
						<input
							type="text"
							name="max_prop_value"
							id="max_prop_value"
							className={
								errors.max_prop_value
									? 'form-control error_input'
									: 'form-control'
							}
							ref={register({
								required: 'Maximun Property Value Value is required',
							})}
							placeholder="Maximun Property Value"
						/>
						<label className="common_label_form" htmlFor="max_prop_value">
							Maximun Property Value
						</label>

						{errors.max_prop_value && (
							<div>
								<span className="text-danger">
									{errors.max_prop_value.message}
								</span>
							</div>
						)}
					</div>
				</div>
				<div>
					<div className="form-group input_form_label">
						<input
							type="text"
							name="min_prop_val"
							id="min_prop_val"
							className={
								errors.min_prop_val
									? 'form-control error_input'
									: 'form-control'
							}
							placeholder="Minimun Property Value"
							ref={register({
								required: 'Minimun Property Value is required',
							})}
						/>
						<label className="common_label_form" htmlFor="min_prop_val">
							Minimun Property Value
						</label>

						{errors.min_prop_val && (
							<div>
								<span className="text-danger">
									{errors.min_prop_val.message}
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="form-group btn_grp" align="right">
					<button
						className="btn outline_yellow mr-2"
						type="button"
						onClick={props.handleClose}>
						Cancel
					</button>

					<button className="btn yellow_btn_normal" disabled={props.disabled}>
						Done
						{props.circleloading && (
							<span className="spinner-border float-right mt-3"></span>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}

export default TwinUpdate_form;
