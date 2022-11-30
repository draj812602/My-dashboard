import React, { useEffect, useState, Fragment } from 'react';
import { NavHashLink } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';

import TopBar from '../Api/SubMenuFolder/Overview';
import { toast } from 'react-toastify';

const data = [
	{
		sub_menu_name: 'Overview',
		sub_menu_id: 1,
		path: 'overview',
		description: {
			middle_panel: 'Overview desription',
			right_panel: {
				endpoint: '/token',
				type: 'GET',
				response_sample: [
					{
						responce_code: '200',
						result: {
							// here i ll take data.result and show data as it is as text

							token: 'cnbcsjchsbcchdaidad',
						},
					},
					{
						responce_code: '401',
						result: {
							error: {
								msg: 'Unauthorized! Please verify your token',
							},
						},
					},
				],
			},
		},
		icon: null,
		sub_sub_menu: [],
	},
	{
		sub_menu_name: 'Authentication',
		sub_menu_id: 2,
		path: 'authentications',
		description: {
			middle_panel: 'Authentication deswcription',
			right_panel: '',
		},
		icon: null,
		sub_sub_menu: [],
	},
	{
		sub_menu_name: 'Errors',
		sub_menu_id: 3,
		path: 'errors',
		description: {
			middle_panel: ' Errors description',
			right_panel: '',
		},
		icon: null,
		sub_sub_menu: [],
	},
	{
		sub_menu_name: 'API version',
		sub_menu_id: 4,
		path: 'api-version',
		description: {
			middle_panel: ' API Versions description',
			right_panel: '',
		},
		icon: null,
		sub_sub_menu: [],
	},
	{
		sub_menu_name: 'Devices',
		sub_menu_id: 5,
		path: 'device-api',
		description: {
			middle_panel: 'Devices description',
			right_panel: '',
		},
		icon: null,
		sub_sub_menu: [
			{
				sub_menu_name_level2: 'List of all devices',
				sub_menu_level2_id: 1,
				description: {
					middle_panel: 'All device list description',
					right_panel: '',
				},
				type: 'GET',
				path: 'get-device-list',
			},
			{
				sub_menu_name_level2: 'Display device information',
				sub_menu_level2_id: 2,
				description: {
					middle_panel: 'Display device information',
					right_panel: '',
				},
				type: 'GET',
				path: 'get-device-info',
			},
			{
				sub_menu_name_level2: 'Connectivity status',
				sub_menu_level2_id: 3,
				type: 'GET',
				description: {
					middle_panel: 'Connectivity status',
					right_panel: '',
				},
				path: 'get-device-connectivity-status',
			},
		],
	},
	{
		sub_menu_id: 6,
		sub_menu_name: 'Authentication Token',
		path: 'Authentication Token',
		icon: null,
		sub_sub_menu: [],
		description: {
			middle_panel: ' Authentication Token description',
			right_panel: {
				endpoint: '/token',
				type: 'GET',
				response_sample: [
					{
						responce_code: '200',
						result: {
							// here i ll take data.result and show data as it is as text

							token: 'cnbcsjchsbcchdaidad',
						},
					},
					{
						responce_code: '401',
						result: {
							error: {
								msg: 'Unauthorized! Please verify your token',
							},
						},
					},
				],
			},
		},
	},
];

const PrettyJSOnRIghtPannel = ({ data }) => {
	// (destructured) data could be a prop for example
	return (
		<div>
			<pre className="text-white">{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

const Section = ({ title, description, path, parent = '' }) => {
	const [JsonREspData, setJsonREspData] = useState(
		description.right_panel !== '' && description.right_panel.response_sample[0]
	);

	const [statusCodeActive, setstatusCodeActive] = useState('200');
	const statusCodeClickEvent = (dta) => {
		setstatusCodeActive(dta.responce_code);
		setJsonREspData(dta);
	};
	const history = useHistory();
	useEffect(() => {
		const el = document.getElementById(path);
		const observer = new window.IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (parent) {
						history.push(`#${parent}/${path}`);
					} else {
						history.push(`#${path}`);
					}
					return;
				}
			},
			{
				root: null,
				threshold: 0.1, // set offset 0.1 means trigger if atleast 10% of element in viewport
			}
		);

		observer.observe(el);
	}, [path, parent, history]);

	return (
		<div style={{ height: '740px' }} className="row no-gutters">
			<div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 mt-5">
				<div className="middlePannel m-3">
					<div id={path} className="fs-2">
						{title}
					</div>
					<div className="fs-6">{description.middle_panel}</div>
				</div>
			</div>
			{description.right_panel !== '' && (
				<div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5  text-white mt-5">
					<div className=" rightPannel rounded mt-3">
						<div className="urlContainer rounded px-2 py-2 fs-7">
							<span
								className={`fs-8 rounded px-2 mr-2 ${
									description.right_panel.type === 'GET' ? 'bg-success' : 'd'
								}`}>
								{description.right_panel.type}
							</span>
							<span>{description.right_panel.endpoint}</span>
							<span
								className="float-right text-warning"
								role="button"
								onClick={() => {
									navigator.clipboard.writeText(
										description.right_panel.endpoint
									);
									toast.info('Copied Succesfully', {
										autoClose: 2000,
									});
								}}>
								Copy
							</span>
						</div>
						<div className="mt-4 fs-7">
							<div className="mb-3">Response sample</div>

							{description.right_panel !== '' &&
								description?.right_panel?.response_sample.map((li, ind) => {
									return (
										<sapn
											className={`rounded fs-6 mr-2 px-3 py-2 ${
												li.responce_code === statusCodeActive
													? 'bg-white'
													: 'bg-dark'
											} ${
												li.responce_code === '200'
													? 'text-success'
													: 'text-danger'
											}`}
											role="button"
											onClick={() => statusCodeClickEvent(li)}>
											{li.responce_code}
										</sapn>
									);
								})}
							<div className="urlContainer mt-4 rounded p-2">
								<span
									className="float-right text-warning"
									role="button"
									onClick={() => {
										navigator.clipboard.writeText(
											JSON.stringify(JsonREspData, null, 2)
										);
										toast.info('Copied Succesfully', {
											autoClose: 2000,
										});
									}}>
									Copy
								</span>
								<PrettyJSOnRIghtPannel data={JsonREspData} />
							</div>
						</div>
						<br />
					</div>
				</div>
			)}
		</div>
	);
};
const App = () => {
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	const NavBar = () => (
		<div className={'subSide'}>
			<div className="mr-auto ml-1">
				<div className="d-flex">
					<div className="mx-auto fs-4 text-white">API</div>
				</div>
				<hr />
				{data.map((item) => {
					const hashPath = `#${item.path}`;
					const currentHash = document.location.hash;
					return (
						<div className="" key={item.path}>
							<NavHashLink
								to={hashPath}
								smooth={true}
								className="nav-link fs-7 subMenu_"
								activeClassName="subMenu_active">
								{item.sub_menu_name}
								{item.sub_sub_menu.length > 0 && (
									<i className="ri-arrow-right-s-line ri-lg float-right mt-1"></i>
								)}
							</NavHashLink>

							{currentHash.includes(hashPath)
								? item?.sub_sub_menu.map((sub) => (
										<p key={sub.path}>
											<NavHashLink
												to={`${hashPath}/${sub.path}`}
												className="nav-link fs-8 subMenu_SUb"
												activeClassName="sub_menu_sub_active">
												<span className="mr-1 badge_api_success">
													{sub.type}
												</span>
												{sub.sub_menu_name_level2}
											</NavHashLink>
										</p>
								  ))
								: null}
						</div>
					);
				})}
			</div>
		</div>
	);
	return (
		<div>
			<TopBar
				name="API"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<div className="">
				<NavBar />
			</div>

			<div className="sectionCOntainer">
				<div className="pt-5">
					{data.map((item) => {
						return (
							<Fragment key={item.path}>
								<Section
									title={item.sub_menu_name}
									description={item.description}
									path={item.path}
									key={item.path}
								/>
								{item?.sub_sub_menu?.map((sub) => (
									<Section
										title={sub.sub_menu_name_level2}
										description={sub.description}
										path={sub.path}
										parent={item.path}
										key={sub.path}
									/>
								))}
							</Fragment>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default App;
