import React, { useState, useContext } from 'react';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

const NoDeviceTemplates = ({ Text, buttonName }) => {
	let context = useContext(GlobalContextMain);

	const BtnClick = (dta) => {
		context.stemodalOpenDeviceTemplate(dta);
	};

	return (
		<div className="Common-box-shadow-radius container w-75">
			<div className="p-5 my-5">
				<div className="d-flex text-center justify-content-center fs-5 pt-4">
					{Text}
				</div>
				{
					<div className="d-flex justify-content-center mt-2 pb-4">
						<button
							className="btn btn-primary   col-xl-3"
							onClick={() => BtnClick(buttonName)}>
							{buttonName}
						</button>
					</div>
				}
			</div>
		</div>
	);
};

export default NoDeviceTemplates;
