import React, { useState, useEffect, useContext } from 'react';
import { Popover, Overlay, OverlayTrigger } from 'react-bootstrap';
import Rightbar from '../rightbar';
import DeleteModal from '../../Modals/GlobalDeleteModal';
import ModalDashCreateEdit from '../../Modals/dashboardNAme';

import NoTemplate from '../../../Components/Utilites/NoDataPage';

import {
	useDashboardActiveDispatch,
	useDashboardActiveState,
} from '../../../Context/DashboardContext';
import { useWidgetDispatch } from '../../../Context/WidgetContext';

import { GlobalContextMain } from '../../../Context/GlobalContextOne';

import { useQuery, useMutation } from '@apollo/react-hooks';

import { DASHBOARDSLIST } from '../../../Queries';
import {
	DELETEDASHBOARD,
	CREATEDASHBOARD,
	EDITDASHBOARD,
} from '../../../Mutations';

import Loaders from '../../../Components/Loader/Loader';
import SearchBar from '../../Utilites/SerachBar';

function DashboardNameBar({ emptyDashboard, showWidgetList }, props) {
	const dispatch = useDashboardActiveDispatch();
	const dispatch_widget = useWidgetDispatch();
	let context = useContext(GlobalContextMain);

	let { activeDashboard, activeDashboardIndex } = useDashboardActiveState();

	const [showDashboardListPopover, setShowDashboardListPopver] = useState(
		false
	);
	const [activeDashboardName, setactiveDashboardName] = useState(null);
	const [dashboardTarget, setDashboardTarget] = useState(null);
	const [dashboard_modal, setdashboard_modal] = useState(false);

	const [dashboardCreateEditState, setdashboardCreateEditState] = useState(
		null
	);

	const [showCurrentDashPopover, setShowCurrentDashPopover] = useState(false);
	const [currentDashTarget, setCurrentDashTarget] = useState(null);

	const [loadingEditCreate, setloadingEditCreate] = useState(false);

	const [showDeleteModal, setshowDeleteModal] = useState(false);
	const [circleloading, setcircleloading] = useState(false);
	const [disabled, setdisabled] = useState(false);
	const [currDashboardNameForEdit, setcurrDashboardNameForEdit] = useState(
		null
	);

	//GQL
	const { loading: loadingdashboard, data: dashboardList } = useQuery(
		DASHBOARDSLIST
	);

	useEffect(() => {
		dispatch({
			type: 'SET_ACTIVE_DASHBOARD_IND',
			payload: parseInt(localStorage.getItem('activeDashboardIndex')) || 0,
		});
	}, [dispatch]);
	useEffect(() => {
		let d = dashboardList?.getDashboardName[activeDashboardIndex];

		dispatch({ type: 'SET_ACTIVE_DASHBOARD_DATA', payload: d });
		dispatch({
			type: 'SET_DASHBOARD_LIST',
			payload: dashboardList?.getDashboardName,
		});
	}, [activeDashboardIndex, dashboardList?.getDashboardName, dispatch]);
	useEffect(() => {
		if (context.modalOpenDeviceTemplate === 'Create dashboard') {
			setdashboard_modal(true);
		}
	}, [context.modalOpenDeviceTemplate]);

	useEffect(() => {
		if (!loadingdashboard && dashboardList) {
			setactiveDashboardName(
				dashboardList?.getDashboardName[activeDashboardIndex]?.dashboard_name
			);
		}
	}, [
		activeDashboardIndex,
		dashboardList,
		dashboardList?.getDashboardName,
		loadingdashboard,
	]);

	const [DeleteDashboard, { loading: deleteDashboardLoading }] = useMutation(
		DELETEDASHBOARD,
		{
			update(proxy, result) {
				let data = proxy.readQuery({
					query: DASHBOARDSLIST,
				});

				data.getDashboardName = data.getDashboardName.filter(
					(d) => d.dashboard_id !== activeDashboard.dashboard_id
				);
				proxy.writeQuery({
					query: DASHBOARDSLIST,
					data,
				});

				if (data.getDashboardName.length === 0) {
					//setactiveDashboard(null);
					dispatch({
						type: 'SET_ACTIVE_DASHBOARD_IND',
						payload: null,
					});
					localStorage.removeItem('active_tab');
				} else {
					dispatch({
						type: 'SET_ACTIVE_DASHBOARD_IND',
						payload: data.getDashboardName.length - 1,
					});

					localStorage.setItem('active_tab', data.getDashboardName.length - 1);
				}

				dispatch_widget({
					type: 'WIDGET_DATA_ONLOAD',
					payload: [],
				});
				setshowDeleteModal(false);
			},
		}
	);
	const [editDashboardNameGql] = useMutation(EDITDASHBOARD, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDSLIST,
			});

			data.getDashboardName[activeDashboardIndex].dashboard_name =
				result.data.editDashboardName.dashboard_name;
			proxy.writeQuery({
				query: DASHBOARDSLIST,
				data,
			});
			setactiveDashboardName(result.data.editDashboardName.dashboard_name);
			dispatch({
				type: 'SET_ACTIVE_DASHBOARD_DATA',
				payload: result.data.editDashboardName,
			});

			setloadingEditCreate(false);
			setdashboard_modal(false);
			setcurrDashboardNameForEdit(null);
		},
	});

	const [createDashboardNameGql] = useMutation(CREATEDASHBOARD, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDSLIST,
			});

			let res = {
				__typename: 'dashboardName',
				dashboard_id: result.data.createDashboard.dashboard_id,
				dashboard_name: result.data.createDashboard.dashboard_name,
			};

			data.getDashboardName = [...data.getDashboardName, res];
			proxy.writeQuery({
				query: DASHBOARDSLIST,
				data,
			});

			dispatch({
				type: 'SET_ACTIVE_DASHBOARD_IND',
				payload: data.getDashboardName.length - 1,
			});

			dispatch({ type: 'SET_ACTIVE_DASHBOARD_DATA', payload: res });

			setloadingEditCreate(false);
			setdashboard_modal(false);
			setcurrDashboardNameForEdit(null);
			context.stemodalOpenDeviceTemplate(null);
		},
	});

	const handleDashboardPopover = (e) => {
		setShowDashboardListPopver(true);
		setDashboardTarget(e.target);
	};
	const [target, setTarget] = useState(null);

	const CreateDashboardClick = (d) => {
		setdashboardCreateEditState(d);
		setdashboard_modal(true);
		setcurrDashboardNameForEdit(null);
	};
	const currentDashboardPopover = (e) => {
		setShowCurrentDashPopover(true);
		// seteditDashboard(activeDashboardName);
		// setmodaldata(modalDelete.DELETE_DASHBOARD);
		setCurrentDashTarget(e.target);
	};
	const deleteDashboard = () => {
		setshowDeleteModal(true);
		setShowCurrentDashPopover(false);
	};

	const renameDashboard = (dta) => {
		setdashboardCreateEditState(dta);
		setdashboard_modal(true);
		setcurrDashboardNameForEdit(activeDashboard.dashboard_name);
	};
	const ShowDeleteModalFunc = () => {
		setshowDeleteModal(false);
	};

	const handleClose = () => {
		setdashboard_modal(false);
		setdisabled(false);
		setcircleloading(false);
		context.stemodalOpenDeviceTemplate(null);
	};

	const dashboardClick = (dash, index) => {
		dispatch({ type: 'SET_ACTIVE_DASHBOARD_IND', payload: index });
		dispatch({ type: 'SET_ACTIVE_DASHBOARD_DATA', payload: dash });
	};

	const DeleteButtonClickModal = async () => {
		let dId = activeDashboard.dashboard_id;

		try {
			await DeleteDashboard({
				variables: { dashboard_id: parseInt(dId) },
			});
		} catch (error) {
			setshowDeleteModal(false);
		}
	};

	const dashboardCreateEdit = async (e) => {
		setloadingEditCreate(true);

		if (
			dashboardCreateEditState === 'create' ||
			context.modalOpenDeviceTemplate === 'Create dashboard'
		) {
			try {
				await createDashboardNameGql({
					variables: { dashboard_name: e.dashboard_name },
				});
			} catch (error) {
				setloadingEditCreate(false);
			}
		} else if (dashboardCreateEditState === 'edit') {
			try {
				await editDashboardNameGql({
					variables: {
						dashboard_id: activeDashboard.dashboard_id,
						dashboard_name: e.dashboard_name,
					},
				});
			} catch (error) {
				setloadingEditCreate(false);
			}
		}
	};

	if (loadingdashboard) return <Loaders />;

	if (activeDashboard === undefined)
		return (
			<>
				<ModalDashCreateEdit
					show={dashboard_modal}
					handleClose={handleClose}
					dashboardFunctions={dashboardCreateEdit}
					circleloading={circleloading}
					disabled={disabled}
					loading={loadingEditCreate}
					functionClickedOn={dashboardCreateEditState}
					currDashboardNameForEdit={currDashboardNameForEdit}
				/>
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />

				<NoTemplate
					Text="You currently don’t have any dashboard."
					buttonName="Create dashboard"
				/>
			</>
		);

	return (
		<div>
			<ModalDashCreateEdit
				show={dashboard_modal}
				handleClose={handleClose}
				dashboardFunctions={dashboardCreateEdit}
				circleloading={circleloading}
				disabled={disabled}
				loading={loadingEditCreate}
				functionClickedOn={dashboardCreateEditState}
				currDashboardNameForEdit={currDashboardNameForEdit}
			/>
			<DeleteModal
				showDeleteModal={showDeleteModal}
				ShowDeleteModalFunc={ShowDeleteModalFunc}
				heading={'Do you want to delete this dashboard ?'}
				openIn={'Dashboard'}
				DeleteButtonClickModal={DeleteButtonClickModal}
				loading={deleteDashboardLoading}
			/>

			<div className="dashboard_top_bar fs-4 mb-2 pr-4">
				<div className="topbar-layout col-12  pl-0 pr-0 ">
					<div>
						<div className="dashboard_row ">
							<div
								className="top_bar_btn "
								onClick={(e) => {
									handleDashboardPopover(e);
								}}>
								Dashboards
								<i className="ri-arrow-down-s-line" />
							</div>
							<div className="divider_line "></div>
							<div
								className="top_bar_btn "
								onClick={(e) => {
									currentDashboardPopover(e);
								}}>
								{activeDashboardName}
								<i className="ri-arrow-down-s-line" />
							</div>
						</div>
					</div>
					<div className="row no-gutters  col-md-6 col-lg-7 col-xl-6">
						<div className="col-12  col-md-7 col-lg-7 col-xl-8  input-icons">
							<SearchBar placeholderName="Search widget" />
						</div>
					</div>

					{/* </div> */}
				</div>

				<div className="add_widget">
					<div>
						<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 ml-0 ">
							<Rightbar showWidgetList={showWidgetList} />
						</div>
					</div>
				</div>

				<Overlay
					show={showDashboardListPopover}
					target={dashboardTarget}
					rootClose
					onHide={() => setShowDashboardListPopver()}
					placement="bottom">
					<Popover>
						<OverlayTrigger
							placement="right"
							trigger="click"
							overlay={
								<Popover style={{ position: 'absolute', top: '-20px' }}>
									{dashboardList.getDashboardName.map((dash, index) => {
										return (
											<Popover.Content
												className="fs-7 px-3 py-1 popoverElements"
												onClick={() => {
													dashboardClick(dash, index);
												}}>
												{dash.dashboard_name}
											</Popover.Content>
										);
									})}
								</Popover>
							}>
							<div
								className="fs-7 px-3 py-1 popoverElements"
								onClick={(e) => {
									setTarget(e.target);
								}}>
								Dashboard List
								<i className="ri-arrow-right-s-line dashboard_list_icon" />
							</div>
						</OverlayTrigger>
						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={() => {
								CreateDashboardClick('create');
								setShowDashboardListPopver(false);
							}}>
							Create Dashboard
						</div>
					</Popover>
				</Overlay>
				<Overlay
					show={showCurrentDashPopover}
					target={currentDashTarget}
					rootClose
					onHide={() => setShowCurrentDashPopover()}
					placement="bottom">
					<Popover>
						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={() => {
								renameDashboard('edit');
								setShowCurrentDashPopover(false);
							}}>
							Rename
						</div>
						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={deleteDashboard}>
							Delete
						</div>
					</Popover>
				</Overlay>
			</div>
		</div>
	);
}

export default DashboardNameBar;
