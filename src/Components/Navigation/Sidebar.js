/** @format */

import React, { Fragment, useContext, useEffect, useState } from 'react';

import { NavHashLink, HashLink } from 'react-router-hash-link';
import { useHistory, matchPath, useLocation } from 'react-router-dom';

import { Nav, Overlay, Popover } from 'react-bootstrap';
import logo from '../../Images/wiznet_logo.png';
import { NavLink } from 'react-router-dom';
import Auth from '../../Context/Auth';
import { ADDUSER } from '../../Mutations';
import { GET_SUBSCRIPTION_TOKEN } from '../../Queries';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

import '../../Styles/sidebar.css';

let sidebarData = [
	{
		menu_name: 'IoT Device Management',
		menu_id: 1,
		path: 'Device',
		icon: 'ri-router-line ri-lg',
		submenu: [],
	},
	{
		menu_name: 'Templates',
		menu_id: 2,
		path: 'Templates',
		icon: 'ri-layout-line ri-lg',
		submenu: [],
	},
	{
		menu_name: 'Dashboard',
		menu_id: 3,
		path: 'dashboard',
		icon: 'ri-dashboard-line ri-lg',
		submenu: [],
	},
];

function Sidebar({ triggerSidebar, toggleSidebarstate }, props) {
	const context = useContext(GlobalContextMain);
	const auth = new Auth();
	const [ADD_USER] = useMutation(ADDUSER);
	const { pathname } = useLocation();

	const { data: subs_token, loading: subsLoading } = useQuery(
		GET_SUBSCRIPTION_TOKEN
	);

	const [showSubSidebar, setshowSubSidebar] = useState(false);
	const [showSidebarTooltio, setshowSidebarTooltio] = useState(false);
	const [showSideBarTTarget, setshowSideBarTTarget] = useState(null);

	const [dataJHovered, setdataJHovered] = useState(null);

	useEffect(() => {
		if (!subsLoading && subs_token) {
			context.setSubscriptionToken(subs_token.getSubscriptionJwtToken);
			localStorage.setItem('SubsToken', subs_token.getSubscriptionJwtToken);
		}
	}, [subsLoading, subs_token]);

	const Logout_fun = () => {
		localStorage.removeItem('active_tab');
		localStorage.removeItem('btoken');
		localStorage.removeItem('SubsToken');
		auth.logout();
	};
	const imageclick = () => {
		window.location.reload();
	};

	const OnclickSidebar = (nme, dta) => {
		// if (nme === 'API') {
		// 	let d = !showSubSidebar;
		// 	setshowSubSidebar(d);

		// 	localStorage.setItem('subSideState', d);
		// } else if (nme === 'Documents') {
		// 	const newWindow = window.open(
		// 		'https://docs.wizcloud.io			',
		// 		'_blank',
		// 		'noopener,noreferrer'
		// 	);

		// 	if (newWindow) newWindow.opener = null;
		// } else {
		setshowSubSidebar(false);
		// }
	};
	const MouseEnter = (event, d) => {
		setshowSidebarTooltio(true);
		setshowSideBarTTarget(event.target);
		setdataJHovered(d.menu_name);
	};
	const MouseLeave = () => {
		setshowSidebarTooltio(false);
	};

	return (
		<div>
			<Overlay
				show={showSidebarTooltio}
				target={showSideBarTTarget}
				rootClose
				onHide={() => setshowSidebarTooltio()}
				placement="right">
				<Popover
					id="popoverSmallSidebar"
					onMouseEnter={() => setshowSidebarTooltio(true)}
					onMouseLeave={() => {
						setshowSidebarTooltio(false);
						setshowSidebarTooltio(null);
					}}>
					<div className="py-2 px-3">{dataJHovered}</div>
				</Popover>
			</Overlay>

			<div
				className={
					toggleSidebarstate === 'true' || toggleSidebarstate === true
						? 'sidebar_shrink'
						: 'sidenav'
				}>
				<div className=" text-center">
					<img
						src={logo}
						alt="company_logo"
						className={
							toggleSidebarstate === 'true' || toggleSidebarstate === true
								? 'logoOnToggle mb-5'
								: 'logo mb-5 mr-1'
						}
						onClick={imageclick}
					/>
				</div>

				<div>
					<Nav className="mr-auto ml-1 mt-5">
						<div>
							{sidebarData.map((li, index) => (
								<>
									{toggleSidebarstate === 'false' ||
									toggleSidebarstate === false ? (
										<li className="nav-item" key={index}>
											<NavLink
												className="nav-link menu_ fs-7"
												activeClassName="menuActive"
												to={`/${li.path}`}
												onClick={() => OnclickSidebar(li.menu_name, li)}>
												<div className="d-flex">
													<i className={`${li.icon} sidebar-icon mr-2 `}></i>

													<div className='="ml-auto'>{li.menu_name}</div>
												</div>
											</NavLink>
											{/* // )} */}
										</li>
									) : (
										<li className="nav-item" key={index}>
											<NavLink
												className="nav-link menu_ fs-7"
												activeClassName="menuActive"
												to={`/${li.path}`}
												onClick={() => OnclickSidebar(li.menu_name, li)}
												onMouseEnter={(e) => MouseEnter(e, li)}
												onMouseLeave={() => MouseLeave(li)}>
												<i className={`${li.icon} sidebar-icon mr-2`}></i>
											</NavLink>
											{/* )} */}
										</li>
									)}
								</>
							))}
						</div>
					</Nav>

					<Nav>
						<div className="logout_container ml-1">
							<hr className="hrSidebar"></hr>
							<li className="nav-item">
								<NavLink
									activeClassName="menuActive"
									className="nav-link menu_ fs-7"
									onMouseEnter={(e) =>
										toggleSidebarstate === 'false' ||
										toggleSidebarstate === false
											? ''
											: MouseEnter(e, { menu_name: 'User Profile' })
									}
									onMouseLeave={() => MouseLeave({ menu_name: 'User Profile' })}
									to="/profile">
									<i className="ri-user-line  ri-lg mr-2"></i>
									{toggleSidebarstate === 'false' ||
									toggleSidebarstate === false
										? 'User Profile'
										: ''}
								</NavLink>
							</li>
							<li className="nav-item">
								<div
									activeClassName="menuActive"
									className="nav-link menu_ fs-7"
									onMouseEnter={(e) =>
										toggleSidebarstate === 'false' ||
										toggleSidebarstate === false
											? ''
											: MouseEnter(e, { menu_name: 'Logout' })
									}
									onMouseLeave={() => MouseLeave({ menu_name: 'Logout' })}
									onClick={Logout_fun}>
									<i className="ri-logout-circle-line ri-lg  mr-2"></i>
									{toggleSidebarstate === 'false' ||
									toggleSidebarstate === false
										? 'Logout'
										: ''}
								</div>
							</li>
						</div>
					</Nav>

					<div
						className={
							toggleSidebarstate === 'true' || toggleSidebarstate === true
								? 'text-danger toggleBtnOnToggle'
								: 'text-danger toggleBtn'
						}
						onClick={triggerSidebar}>
						{!(
							toggleSidebarstate === 'false' || toggleSidebarstate === false
						) ? (
							<i className="ri-arrow-right-circle-fill ri-lg"></i>
						) : (
							<i className="ri-arrow-left-circle-fill ri-lg"></i>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
