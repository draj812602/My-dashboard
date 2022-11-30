import React, { useContext } from 'react';
import TopBar from '../../Components/Navigation/TopBar';
import MenuComponent from '../../Components/Utilites/ActiveInactiveMenu';

import MyProfile from '../Others/MyProfile';
import SubscriptionComponent from '../Others/Subscription';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

const UserProfile = () => {
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	const { activeMenuState } = useContext(GlobalContextMain);

	return (
		<div>
			<TopBar
				name="User Profile"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<div className=" mb-3 menuheight">
				<MenuComponent
					menus={[
						{
							menuName: 'Personal Information',
						},
					]}
				/>
			</div>
			{}
			{activeMenuState === 'Personal Information' ? (
				<MyProfile />
			) : (
				<SubscriptionComponent />
			)}
		</div>
	);
};
export default UserProfile;
