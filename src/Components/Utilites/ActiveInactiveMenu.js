import { local } from 'd3';
import React, { useState, useContext, useEffect } from 'react';
import DeviceRawDataTable from '../NewDevice/DeviceRawDataTable';
import NewProfileView from '../../View/Others/MyProfile';
import SubscriptionView from '../../View/Others/Subscription';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

let activeMenueFromLocl = localStorage.getItem('activeMenu');

function ActiveInactiveMenu(props) {
	const context = useContext(GlobalContextMain);

	useEffect(() => {
		context.MenuClickAI(props.menus[0].menuName);
	}, []);

	const MenuClick = (e, li, ind) => {
		context.MenuClickAI(li.menuName);
	};

	// const OnclickProfileEdit = () => {

	// 	const newWindow = window.open(
	// 		'https://wiznetwink.b2clogin.com/wiznetwink.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_profile_editing&client_id=e5fc44e6-d87d-44b9-a3e1-b9a19d946ec4&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fwinciotdashboarddev.azurewebsites.net&scope=openid&response_type=id_token&prompt=login',
	// 		'_blank',
	// 		'noopener,noreferrer'
	// 	);

	// };

	return (
		<>
			<div className="d-flex mb-2">
				{props.menus.map((li, ind) => {
					return (
						<div
							key={ind}
							className={
								li.menuName === context.activeMenuState
									? 'activeclass mr-3  fs-4'
									: 'inactiveclass mr-3  fs-4'
							}
							onClick={(e) => {
								MenuClick(e, li, ind);
							}}>
							{li.menuName}
						</div>
					);
				})}
			</div>
		</>
	);
}

export default ActiveInactiveMenu;
