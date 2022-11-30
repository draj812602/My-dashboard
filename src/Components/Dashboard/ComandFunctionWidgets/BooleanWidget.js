import React,{useState} from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink } from 'react-router-dom';

const BooleanWidget = ({
	data,
	cmdRunFunctionm,
	cmdLoading,
	HistoryIconClick,
}) => {
	// console.log("data",data)
	const { register, handleSubmit, errors } = useForm();
	const [selectedClient,setSelectedClient] = useState();
	// console.log(data);
	// function handleSelectChange(event) {
		
    //     setSelectedClient(event.target.value);
	// 	console.log("data",event.target.value)
    // }
	const handleSelectChange = (e, index, name) => {
		console.log("trigrred event is", e.target);
		setSelectedClient(e.target.value);
		console.log("data",e.target.value)

		
	};

	const BooleanComp = () => {
		return (
			<button onClick={cmdRunFunctionm}
				className="Off_switch" // switch OFF
				// className="On_switch"         // switch ON
			>
				{/* // OFF dot */}
				<div className="off_dot mx-auto mb-2 "></div>
				{/* // On dot */}
				{/* <div className="on_dot mx-auto mb-2 "></div>    */}

				<div className="fs-6 text-primary font-weight-bolder mt-1">Off</div>
				<div className="fs-8 text-dark">Turn off</div>
			</button>
		);
	};

	return (
		<div>
			<div className="notify_text">
				{/* {data.responsepayload === 'null' ? (
					<div>
						<BooleanComp />
					</div>
				) : (data.responsepayload &&
						data.responsepayload.response_payload === 'true') ||
				  (data.responsepayload &&
						data.responsepayload.response_payload === 'false') ||
				  (data.responsepayload &&
						data.responsepayload.response_payload === true) ||
				  (data.responsepayload &&
						data.responsepayload.response_payload === false) ? (
					<BooleanComp />
				) : ( */}
					<form onSubmit={handleSubmit(cmdRunFunctionm)}>

						
						<div className="row">
							<div className="col-lg-7 col-md-4 mt-2">
								
								 {/* <div className="form-check">
									
									<input
										className="form-check-input"
										type="radio"
										name="request_payload"
										value="true"
										id="trueId"
										ref={register({
											required: true,
										})}
									/>
									<label className="form-check-label fs-4" for="trueId">
										true
									</label>
								</div>
								
								<div className="form-check">
									<input
										className="form-check-input"
										type="radio"
										name="request_payload"
										value="false"
										id="falseId"
										ref={register({
											required: true,
										})}
									/>
									<label className="form-check-label fs-4" for="falseId">
										false
									</label>
								</div>  */}
								{/* <input
							type="text"
							name="request_payload"
							className='form-control'
							ref={register({
								required: 'Please type command',
							})}/> */}
								

								<select  
								name="request_payload"
								className='form-control' 
								value={selectedClient}  
								onChange={(e=>
								setSelectedClient(e.target.value))} 
								ref={register({
								required: true,
								})}> 
											<option value="true" >True</option>
											<option value="false">False</option>
										</select> 
								<div className="text-danger">
									{errors.request_payload?.type === 'required' &&
										'Please select a command.'}
								</div>
							</div>
							<div className="col-lg-5 col-md-8 mt-5">
								<button
									className="btn btn-outline-primary float-right w-25"
									disabled={cmdLoading}>
									Run
									{cmdLoading && (
										<span className="spinner-border float-right"></span>
									)}
								</button>
							</div>
						</div>
					</form>
				{/* )} */}

				<div className="fs-6 mt-1 text-secondary">
					To see response, please check the{' '}
					<Link onClick={() => HistoryIconClick(data)}>command history</Link>.
				</div>
			</div>
		</div>
	);
};

export default BooleanWidget;
