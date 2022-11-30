import React from 'react';
import Auth from '../../Context/Auth';

const auth = new Auth().currentUser();

function ProfileInputs(props) {
	return (
		<div className="row box_style px-2 py-2">
			<div style={{ width: '100%' }}>
				<div className="basicProfHeader">
					<div className="BasicInfoStyle ml-3">Basic Info</div>
					{/*<div>
						<button className="EditProfileBtn" onClick={props.handleEdit}>
							<i className="ri-edit-2-line" />
							Edit
						</button>
					</div>*/}
				</div>
			</div>
			<div style={{ width: '100%' }}>
				<div className="col-12">
					<table style={{ width: '100%' }}>
						<tbody>
							<tr className="row ml-2 mb-2 mt-2">
								<td className="col-4 px-0 fs-5">Full Name</td>
								<td className="col-8 BasicInfText">{`${auth?.name} ${auth?.lastName}`}</td>
							</tr>
							<tr className="row ml-2 mb-2">
								<td className="col-4 px-0 fs-5">Family Name</td>
								<td className="col-8 BasicInfText">{auth?.familyName}</td>
							</tr>
							<tr className="row ml-2 mb-2">
								<td className="col-4 px-0 fs-5">Given Name</td>
								<td className="col-8 BasicInfText">{auth?.giveName}</td>
							</tr>
							<tr className="row ml-2 mb-2">
								<td className="col-4 px-0 fs-5">Emails</td>
								<td className="col-8 BasicInfText">{auth?.emails} </td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default ProfileInputs;
