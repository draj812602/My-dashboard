import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GlobalContextMain } from '../../../Context/GlobalContextOne';

function BooleanComp(props) {
	const { register, handleSubmit } = useForm();
	const { loading, indSensorPower } = useContext(GlobalContextMain);
	const [showData, setshowData] = useState(null);
	useEffect(() => {
		setshowData(props);
	}, [props, props.dataSdataSensorPowerSubs, showData]);

	return (
		<div>
			{showData !== null && (
				<div>
					{showData.data.init_value === 'true' && (
						<form onSubmit={handleSubmit(showData.sendBooleanFunc)}>
							<div className="d-flex">
								<input
									type="hidden"
									name="init_value"
									value={showData.data.init_value}
									ref={register}
								/>
								<input
									type="hidden"
									name="comp_id"
									value={showData.data.component_id}
									ref={register}
								/>

								<input
									type="hidden"
									name="data_type"
									value={showData.data.data_type}
									ref={register}
								/>
								<input
									type="hidden"
									name="device_id"
									value={showData.device_id}
									ref={register}
								/>
								<input
									type="hidden"
									name="dashboard_id"
									value={showData.dashboard_id}
									ref={register}
								/>
								<input
									type="hidden"
									name="widget_id"
									value={showData.widget_id}
									ref={register}
								/>
								<div className="ml-auto">
									{loading === true &&
									showData.data.component_id === parseInt(indSensorPower) ? (
										<span className="spinner-border loadingBoolean"></span>
									) : (
										<button
											className={
												showData.data.in_out === 'D2C'
													? 'D2CBool_onBtn mr-3'
													: 'boolean_onBtn mr-3'
											}
											disabled={showData.data.in_out === 'D2C' ? true : false}>
											<div className="fs-2 text-dark font-weight-bolder">
												ON
											</div>
										</button>
									)}
								</div>
							</div>
						</form>
					)}
					{showData.data.init_value === 'false' && (
						<form onSubmit={handleSubmit(showData.sendBooleanFunc)}>
							<div className="d-flex align-items-center justify-content-center">
								<input
									type="hidden"
									name="init_value"
									value={showData.data.init_value}
									ref={register}
								/>
								<input
									type="hidden"
									name="comp_id"
									value={showData.data.component_id}
									ref={register}
								/>

								<input
									type="hidden"
									name="data_type"
									value={showData.data.data_type}
									ref={register}
								/>
								<input
									type="hidden"
									name="device_id"
									value={showData.device_id}
									ref={register}
								/>
								<input
									type="hidden"
									name="dashboard_id"
									value={showData.dashboard_id}
									ref={register}
								/>
								<input
									type="hidden"
									name="widget_id"
									value={showData.widget_id}
									ref={register}
								/>

								<div className="ml-auto">
									{loading === true &&
									showData.data.component_id === parseInt(indSensorPower) ? (
										<span className="spinner-border loadingBoolean"></span>
									) : showData.data.init_value === null ||
									  showData.data.init_value === 'null' ? (
										<div></div>
									) : (
										<button
											className={
												showData.data.in_out === 'D2C'
													? 'D2Cboolean_ofBtn mr-3'
													: 'boolean_ofBtn mr-3'
											}
											disabled={showData.data.in_out === 'D2C' ? true : false}>
											<div className="fs-2 text-primary font-weight-bolder">
												{showData.data.init_value === 'true' ? 'ON' : 'Off'}
											</div>
										</button>
									)}
								</div>
							</div>
						</form>
					)}
					<div className="responceBoolean">
						{showData.data.responseType === 'success' && (
							<div>
								<div className="text-success fs-7">
									{showData.data.response}
								</div>
							</div>
						)}
						{showData.data.responseType === 'connection_time_out' && (
							<div>
								<div className="text-error fs-7">{showData.data.response}</div>
							</div>
						)}
						{showData.data.responseType === 'method_time_out' && (
							<div>
								<div className="text-error fs-7">{showData.data.response}</div>
							</div>
						)}
						{showData.data.responseType !== 'method_time_out' &&
							showData.data.responseType !== 'connection_time_out' &&
							showData.data.responseType !== 'success' && (
								<div>
									<span className="text-error fs-7">
										{showData.data.response}
									</span>
								</div>
							)}
					</div>
				</div>
			)}
		</div>
	);
}

export default BooleanComp;
