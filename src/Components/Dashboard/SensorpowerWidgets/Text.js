import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
//---- context
import { GlobalContextMain } from '../../../Context/GlobalContextOne';

function Text(props) {
	const { loading, indSensorPower } = useContext(GlobalContextMain);

	const { register, handleSubmit, errors } = useForm();

	return (
		<div className="pt-3 mr-2">
			<div className="fs-4 text-error font-weight-bold">
				{props.data.init_value}
			</div>

			<form onSubmit={handleSubmit(props.sendTextFunc)}>
				{props.data.in_out !== 'D2C' ? (
					<div className="input-group mt-2">
						<input
							type="text"
							name="init_value"
							className="form-control"
							placeholder="Enter your message to device here"
							disabled={
								loading === true &&
								props.data.component_id === parseInt(indSensorPower)
									? true
									: false
							}
							ref={register({
								required: 'Please type something',
							})}
						/>

						<div className="input-group-append">
							{loading === true &&
							props.data.component_id === parseInt(indSensorPower) ? (
								<span className="spinner-border float-right circleOnUpdateSending"></span>
							) : (
								<button className="btn btn-info ml-1">Send</button>
							)}
						</div>
					</div>
				) : null}
				{errors.init_value && (
					<div>
						<span className="fs-7 text-error">{errors.init_value.message}</span>
					</div>
				)}

				{props.data.responseType === 'success' && (
					<div>
						<span className="text-success">{props.data.response}</span>
					</div>
				)}
				{props.data.responseType === 'connection_time_out' && (
					<div>
						<span className="fs-7 text-error">{props.data.response}</span>
					</div>
				)}
				{props.data.responseType === 'method_time_out' && (
					<div>
						<span className="fs-7 text-error">{props.data.response}</span>
					</div>
				)}
				{props.data.responseType !== 'method_time_out' &&
					props.data.responseType !== 'connection_time_out' &&
					props.data.responseType !== 'success' && (
						<div>
							<span className="fs-7 text-error">{props.data.response}</span>
						</div>
					)}
				<input
					type="hidden"
					name="comp_id"
					value={props.data.component_id}
					ref={register}
				/>

				<input
					type="hidden"
					name="data_type"
					value={props.data.data_type}
					ref={register}
				/>
				<input
					type="hidden"
					name="device_id"
					value={props.device_id}
					ref={register}
				/>
				<input
					type="hidden"
					name="dashboard_id"
					value={props.dashboard_id}
					ref={register}
				/>
				<input
					type="hidden"
					name="widget_id"
					value={props.widget_id}
					ref={register}
				/>
			</form>
		</div>
	);
}

export default Text;
