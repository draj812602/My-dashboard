import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useForm } from 'react-hook-form';

//GQL

import { GlobalContextMain } from '../../../Context/GlobalContextOne';

const StringWidget = ({
	data,
	HistoryIconClick,
	cmdRunFunctionm,
	cmdLoading,
}) => {
	const { register, handleSubmit, errors } = useForm();

	let context = useContext(GlobalContextMain);

	return (
		<div>
			<div className="notify_text">
				<form onSubmit={handleSubmit(cmdRunFunctionm)}>
					<div className="input-group">
						<input
							type="text"
							name="request_payload"
							className={
								errors.request_payload
									? 'form-control error_input'
									: 'form-control col-lg-10 col-xl-11 col-md-10'
							}
							placeholder="Type command here"
							aria-label="Type command here"
							aria-describedby="sendButtonString"
							ref={register({
								required: 'Please type command',
							})}
						/>
						<button
							className="btn btn-outline-primary ml-2 col-lg-2 col-md-2 col-xl-1"
							id="sendButtonString"
							disabled={cmdLoading}>
							Run
							{cmdLoading && (
								<span className="spinner-border text-dark float-right"></span>
							)}
						</button>
					</div>
					{errors.request_payload && (
						<div>
							<span className="text-error">
								{errors.request_payload.message}
							</span>
						</div>
					)}
				</form>

				<div className="fs-6 mt-1 text-secondary">
					To see response, please check the{' '}
					<Link onClick={() => HistoryIconClick(data)}>command history</Link>.
				</div>
			</div>
		</div>
	);
};

export default StringWidget;
