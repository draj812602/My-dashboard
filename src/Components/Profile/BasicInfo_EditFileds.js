import React, { useState } from 'react';
import Auth from '../../Context/Auth';
import { useForm } from 'react-hook-form';

const auth = new Auth().currentUser();

function ProfileInputs(props) {
	const { register, handleSubmit, errors } = useForm();
	const [circleLoading, setcircleLoading] = useState(false);
	const [showEdit, setshowEdit] = useState(false);

	const onChangeProfileVal = (e, ind) => {
		let val = e.target.value;
	};

	const handleEdit = () => {
		setshowEdit(!showEdit);
	};
	const FormSubmit = async (e) => {
		setcircleLoading(false);
		//console.log(e);
		// if (e.rule_id) {
		// 	try {
		// 		await editData({ variables: { input: e } });
		// 	} catch (err) {
		// 		setcircleLoading(false);
		// 	}
		// } else {
		// 	try {
		// 		await saveData({ variables: { data: e } });
		// 	} catch (err) {
		// 		setcircleLoading(false);
		// 	}
		// }
	};

	return (
		<form onSubmit={handleSubmit(FormSubmit)}>
			<div className="row box_style px-4 py-2">
				<div className="basicProfHeader">
					<div className="row BasicInfoStyle ml-2 mt-3 mb-2">Basic Info</div>
				</div>

				<div className="row mt-3">
					<div className="col-11 form-group">
						<label className="label ml-3" htmlFor="givenName">
							Given Name
						</label>
						<input
							name={'givenName'}
							id={'givenName'}
							value={auth.name}
							type="text"
							//placeholder={auth.name}
							onChange={(e) => onChangeProfileVal(e)}
							//disabled={EditInp}
							className={
								errors.givenName
									? 'form-control texterror_input ml-3'
									: 'form-control text-capitalize  ml-3'
							}
							ref={register({
								required: 'Given Name is required',
							})}
						/>
						{errors.givenName && (
							<div>
								<span className="text-error">{errors.givenName.message}</span>
							</div>
						)}
					</div>
					<div className="col-11 form-group">
						<label className="label ml-3" htmlFor="FamilyName">
							Family Name
						</label>
						<input
							name={'lastName'}
							id={'lastName'}
							type="text"
							value={auth.lastName}
							//placeholder={auth.lastName}
							//onChange={(e) => onChangeProfileVal(e)}
							//disabled={EditInp}
							className={
								errors.lastName
									? 'form-control texterror_input ml-3'
									: 'form-control text-capitalize ml-3'
							}
							ref={register({
								required: 'Last name is required',
							})}
						/>
						{errors.lastName && (
							<div>
								<span className="text-error">{errors.lastName.message}</span>
							</div>
						)}
					</div>
					<div className="col-11 form-group">
						<label className="label ml-3" htmlFor="firstName">
							Name
						</label>
						<input
							name={'firstName'}
							id={'firstName'}
							type="text"
							value={auth.firstName}
							//placeholder={auth.firstName}
							//onChange={(e) => onChangeProfileVal(e)}
							//disabled={EditInp}
							className={
								errors.firstName
									? 'form-control texterror_input ml-3'
									: 'form-control text-capitalize  ml-3'
							}
							ref={register({
								required: 'First name is required',
							})}
						/>
						{errors.firstName && (
							<div>
								<span className="text-error">{errors.firstName.message}</span>
							</div>
						)}
					</div>
					<div className="col-11 form-group">
						<label className="label ml-3" htmlFor="givenName">
							Email
						</label>
						<input
							name={'emails'}
							id={'emails'}
							type="text"
							value={auth.emails}
							//placeholder={auth.emails}
							//onChange={(e) => onChangeProfileVal(e)}
							//disabled={EditInp}
							className={
								errors.emails
									? 'form-control texterror_input ml-3'
									: 'form-control ml-3'
							}
							ref={register({
								required: 'Email address is required',
							})}
						/>
						{errors.emails && (
							<div>
								<span className="text-error">{errors.emails.message}</span>
							</div>
						)}
					</div>
					<div className=" ml-auto mr-lg-5 pr-lg-3 mb-4 mt-2">
						<button
							className="btn btn-success px-3"
							type="button"
							onClick={props.FormSubmit}>
							Save
						</button>
						<button
							className="btn btn-outline-primary ml-3"
							type="button"
							onClick={props.handleEdit}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}

export default ProfileInputs;
