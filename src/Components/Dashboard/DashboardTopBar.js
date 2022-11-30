import React, { useState } from 'react';
import { Popover, Overlay, OverlayTrigger } from 'react-bootstrap';
import Rightbar from './rightbar';
import modalDelete from '../../Files/DeleteData';

export default function DashboardTopBar({
	setShowDashboardListPopver,
	setDashboardTarget,
	setShowCurrentDashPopover,
	setCurrentDashTarget,
	showDashboardListPopover,
	dashboardTarget,
	showCurrentDashPopover,
	currentDashTarget,
	setdashboard_modal,
	setmodaldata,
	setshowModalDelete,
	CreateDashoard_modal,
	setactiveDashboard,
	getInitialDataFun,
	checkedWidgetIds,
	allSelected,
	handleSelectAllWidget,
	handleSelectNoneWidget,
	selectWidgetFun,
	setSelectPopoverWidget,
	setsetSelectPopoverWidget,
	selectBarTarget,
	handleDeleteMultipleWidgets,
	dashboardList,
	initialChartData,
	layoutRightBAr,
	createWidget,
	active_tab,
	seteditDashboard,
	setcreateDash,
}) {
	const [target, setTarget] = useState(null);
	let activeDashboardName =
		dashboardList?.getUserDashboardNames[parseInt(active_tab)]?.dashboard_name;
	const handleDashboardPopover = (e) => {
		setShowDashboardListPopver(true);
		setDashboardTarget(e.target);
	};
	const currentDashboardPopover = (e) => {
		setShowCurrentDashPopover(true);
		seteditDashboard(activeDashboardName);
		setmodaldata(modalDelete.DELETE_DASHBOARD);
		setCurrentDashTarget(e.target);
	};

	const dashboardClick = (dash, index) => {
		setactiveDashboard(index);
		localStorage.setItem('active_tab', index);
		getInitialDataFun({
			variables: { dashboard_id: dash.dashboard_id },
		});
	};

	const renameDashboard = () => {
		setcreateDash(null);
		setdashboard_modal(true);
		setShowCurrentDashPopover(false);
	};
	const deleteDashboard = () => {
		setshowModalDelete(true);
		setShowCurrentDashPopover(false);
	};
	return (
		<div
			className={
				checkedWidgetIds.length === 0
					? 'dashboard_top_bar fs-4 mb-2 pr-4'
					: 'dashboard_top_bar dashboard_top_bar_checked fs-4 mb-2 pr-4'
			}>
			<div className="topbar-layout col-12 pl-0 pr-0">
				<div className="dashboard_row">
					<div
						className="top_bar_btn"
						onClick={(e) => {
							handleDashboardPopover(e);
						}}>
						Dashboard
						<i className="ri-arrow-down-s-line" />
					</div>
					<div className="divider_line"></div>
					<div
						className="top_bar_btn"
						onClick={(e) => {
							currentDashboardPopover(e);
						}}>
						{activeDashboardName}
						<i className="ri-arrow-down-s-line" />
					</div>
				</div>
			</div>
			<div>
				{checkedWidgetIds.length !== 0 && (
					<>
						<div className="delete-bar">
							{!allSelected ? (
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									onClick={handleSelectAllWidget}
									style={{ cursor: 'pointer', marginRight: '5px' }}>
									<path
										d="M1.33333 0.5H14.6667C14.8877 0.5 15.0996 0.587797 15.2559 0.744078C15.4122 0.900358 15.5 1.11232 15.5 1.33333V14.6667C15.5 14.8877 15.4122 15.0996 15.2559 15.2559C15.0996 15.4122 14.8877 15.5 14.6667 15.5H1.33333C1.11232 15.5 0.900358 15.4122 0.744078 15.2559C0.587797 15.0996 0.5 14.8877 0.5 14.6667V1.33333C0.5 1.11232 0.587797 0.900358 0.744078 0.744078C0.900358 0.587797 1.11232 0.5 1.33333 0.5ZM3.83333 7.16667V8.83333H12.1667V7.16667H3.83333Z"
										fill="#0E0E0E"
									/>
								</svg>
							) : (
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									onClick={handleSelectNoneWidget}
									style={{ cursor: 'pointer', marginRight: '5px' }}>
									<path
										d="M1.33333 0.5H14.6667C14.8877 0.5 15.0996 0.587797 15.2559 0.744078C15.4122 0.900358 15.5 1.11232 15.5 1.33333V14.6667C15.5 14.8877 15.4122 15.0996 15.2559 15.2559C15.0996 15.4122 14.8877 15.5 14.6667 15.5H1.33333C1.11232 15.5 0.900358 15.4122 0.744078 15.2559C0.587797 15.0996 0.5 14.8877 0.5 14.6667V1.33333C0.5 1.11232 0.587797 0.900358 0.744078 0.744078C0.900358 0.587797 1.11232 0.5 1.33333 0.5ZM7.16917 11.3333L13.0608 5.44083L11.8825 4.2625L7.16917 8.97667L4.81167 6.61917L3.63333 7.7975L7.16917 11.3333Z"
										fill="#0E0E0E"
									/>
								</svg>
							)}
							<svg
								width="12"
								height="8"
								viewBox="0 0 12 8"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="select-bar"
								onClick={(e) => {
									selectWidgetFun(e);
								}}>
								<path
									d="M6.00011 4.97656L10.1251 0.851562L11.3034 2.0299L6.00011 7.33323L0.696777 2.0299L1.87511 0.851562L6.00011 4.97656Z"
									fill="#0E0E0E"
								/>
							</svg>
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
								onClick={handleDeleteMultipleWidgets}
								xmlns="http://www.w3.org/2000/svg"
								style={{ cursor: 'pointer' }}>
								<path
									d="M13.1665 3.99984H17.3332V5.6665H15.6665V16.4998C15.6665 16.7209 15.5787 16.9328 15.4224 17.0891C15.2661 17.2454 15.0542 17.3332 14.8332 17.3332H3.1665C2.94549 17.3332 2.73353 17.2454 2.57725 17.0891C2.42097 16.9328 2.33317 16.7209 2.33317 16.4998V5.6665H0.666504V3.99984H4.83317V1.49984C4.83317 1.27882 4.92097 1.06686 5.07725 0.910582C5.23353 0.754301 5.44549 0.666504 5.6665 0.666504H12.3332C12.5542 0.666504 12.7661 0.754301 12.9224 0.910582C13.0787 1.06686 13.1665 1.27882 13.1665 1.49984V3.99984ZM13.9998 5.6665H3.99984V15.6665H13.9998V5.6665ZM6.49984 8.1665H8.1665V13.1665H6.49984V8.1665ZM9.83317 8.1665H11.4998V13.1665H9.83317V8.1665ZM6.49984 2.33317V3.99984H11.4998V2.33317H6.49984Z"
									fill="#0E0E0E"
								/>
							</svg>
						</div>
					</>
				)}
			</div>
			<div className="add_widget">
				<div>
					{initialChartData?.getUserDashboardWidgetInfo.length >= 0 &&
						initialChartData?.getUserDashboardWidgetInfo.length < 10 && (
							<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pl-0 ml-0">
								<Rightbar createWidget={createWidget} />
							</div>
						)}
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
						// target={target}
						overlay={
							<Popover style={{ position: 'absolute', top: '-20px' }}>
								{dashboardList.getUserDashboardNames.map((dash, index) => {
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
							CreateDashoard_modal('create');
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
						onClick={renameDashboard}>
						Rename
					</div>
					<div
						className="fs-7 px-3 py-1 popoverElements"
						onClick={deleteDashboard}>
						Delete
					</div>
				</Popover>
			</Overlay>
			<Overlay
				show={setSelectPopoverWidget}
				target={selectBarTarget}
				rootClose
				onHide={() => setsetSelectPopoverWidget()}
				placement="bottom">
				<Popover>
					<div
						className="fs-7 px-3 py-1 popoverElements"
						onClick={() => {
							handleSelectAllWidget();
							setsetSelectPopoverWidget(false);
						}}>
						select all
					</div>
					<div
						className="fs-7 px-3 py-1 popoverElements"
						onClick={() => {
							handleSelectNoneWidget();
							setsetSelectPopoverWidget(false);
						}}>
						select none
					</div>
				</Popover>
			</Overlay>
		</div>
	);
}
