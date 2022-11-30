import React, { useState, useEffect, useContext, useRef } from 'react';

//Import charts
import { ChartsContainer } from '../../../d3/Charts/ChartContainer';

import EditModalWidget from '../../../Components/Modals/EditModalWidget';

// gql
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GETDATAONTIMEINTERVAL, EDITWIDGETS } from '../../../Mutations';
import {
	GET_WIDGET_DATA,
	GET_WIDGETS_DETAILS,
	GETDEVICE_CAPABILITIES,
	GET_HISTORY,
} from '../../../Queries';

import Loaders from '../../../Components/Loader/Loader';
import { useDashboardActiveState } from '../../../Context/DashboardContext';
import { GlobalContextMain } from '../../../Context/GlobalContextOne';

import TabHrs from '../tabHours';
import dataLiveTest from '../../../Files/TimeInterval.json';

import CommandWidgetCOntainer from '../ComandFunctionWidgets/CommandWidgetCOntainer';

import RIGHTBAR from '../../../Components/Utilites/RightSidebar';

import IconComponent from '../../Utilites/WidgetsIcon';
import Chartmodal from '../../Modals/Chartmodal';
import { Popover, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';

import WidgetDetails from '../../../Components/Modals/ViewDetailsWidget';

// context
import {
	useWidgetDispatch,
	useWidgetState,
} from '../../../Context/WidgetContext';

const WidgetsCopm = ({ data, setshowDeleteModal, DeleteWidget }) => {
	let { activeDashboard, activeDashboardIndex } = useDashboardActiveState();
	let { ChartTittle, widgetData } = useWidgetState();
	let context = useContext(GlobalContextMain);
	let dispatch = useWidgetDispatch();

	const [
		getDeviceAndCapabilities,
		{ data: deviceAndCapabilities, loading: loadingDeviceAndCapabilities },
	] = useLazyQuery(GETDEVICE_CAPABILITIES, {
		fetchPolicy: 'network-only',
	});

	const ShowDeleteModalFunc = () => {
		setshowDeleteModal(false);
	};
	const [
		getWidgetDetailsGql,
		{ loading: getwidgtDetailsLoading, data: getwidgtDetailsData },
	] = useLazyQuery(GET_WIDGETS_DETAILS, {
		fetchPolicy: 'network-only',
	});

	const [showModal, setShowModal] = useState(false);
	const [wameOnZoom, setWameOnZoom] = useState(null);

	const [wameOnZoomData, setWameOnZoomData] = useState(null);
	const [timeIntervalData, settimeIntervalData] = useState(dataLiveTest);
	const [setPopoverWidget, setsetPopoverWidget] = useState(false);
	const [target, setTarget] = useState(null);

	const [showViewDetailsModal, setshowViewDetailsModal] = useState(false);
	const [showEditMdoal, setshowEditMdoal] = useState(false);
	const [selectedInterval, setselectedInterval] = useState(null);
	const [selectedTimeInterval, setselectedTimeInterval] = useState();
	const [historyClickedUID, sethistoryClickedUID] = useState(null);

	const [
		getHistory,
		{ data: historyData, loading: historyLoading },
	] = useLazyQuery(GET_HISTORY, {
		fetchPolicy: 'network-only',
	});

	useEffect(() => {
		setselectedTimeInterval(data?.data_time_interval);
	}, [data?.data_time_interval]);

	useEffect(() => {
		if (!loadingDeviceAndCapabilities && deviceAndCapabilities) {
			dispatch({
				type: 'DEVICE_AND_CAPABILITIES',
				payload: deviceAndCapabilities.getDeviceCapability,
			});
		}
	}, [deviceAndCapabilities, dispatch, loadingDeviceAndCapabilities]);

	//History query

	const [Edit_widget_gql, { loading: loadingEditWidget }] = useMutation(
		EDITWIDGETS,
		{
			update(proxy, result) {
				let res = result.data.editWidget;
				// let deviceId = Number(d.device_id);

				let data = proxy.readQuery({
					query: GET_WIDGET_DATA,
					variables: { dashboard_id: activeDashboard.dashboard_id },
				});

				data.getWidget.widgets = data.getWidget.widgets.map((li) => {
					if (li.widget_id === res.widget_id) {
						return {
							...li,
							widget_title: res.widget_title,
							device_id: res.device_id,
							template_cap_id: res.template_cap_id,
							telemetry: res.telemetry,
						};
					} else {
						return li;
					}
				});

				proxy.writeQuery({
					query: GET_WIDGET_DATA,
					variables: { dashboard_id: activeDashboard.dashboard_id },
					data,
				});
				dispatch({
					type: 'WIDGET_DATA_ONLOAD',
					payload: data.getWidget.widgets,
				});
				setshowEditMdoal(false);
			},
		}
	);

	const [
		getDataOnTImeIntervalGql,
		{ loading: loadingTimeInterval },
	] = useMutation(GETDATAONTIMEINTERVAL, {
		update(proxy, result) {
			let res = result.data.getSensorDataOnTimeInterval;

			let data = proxy.readQuery({
				query: GET_WIDGET_DATA,
				variables: { dashboard_id: activeDashboard.dashboard_id },
			});

			data.getWidget.widgets = data.getWidget.widgets.map((li) => {
				if (li.widget_id === res.widget_id) {
					return {
						...li,
						data_time_interval: res.data_time_interval,
						telemetry: res.telemetry,
					};
				} else {
					return li;
				}
			});

			proxy.writeQuery({
				query: GET_WIDGET_DATA,
				variables: { dashboard_id: activeDashboard.dashboard_id },
				data,
			});
			dispatch({
				type: 'WIDGET_DATA_ONLOAD',
				payload: data.getWidget.widgets,
			});
			setselectedTimeInterval(res.data_time_interval);
		},
	});

	const chartModalClose = () => {
		setWameOnZoom(null);
		setWameOnZoomData(null);

		setShowModal(false);
	};

	const chartModalOpen = (e, widgetName, data) => {
		setWameOnZoom(widgetName);
		setWameOnZoomData(data);
		// setMultiLineColor(multi_line_chart_data);
		setShowModal(true);
	};
	const renderZoomTooltip = (props) => (
		<Tooltip id="button-tooltip-TEST" {...props}>
			Expand to full screen
		</Tooltip>
	);
	const widgetActionFun = async (event, t) => {
		setsetPopoverWidget(true);
		setTarget(event.target);

		let widget_id = data.widget_id;
		getDeviceAndCapabilities();
		getWidgetDetailsGql({
			variables: {
				dashboard_id: activeDashboard.dashboard_id,
				widget_id: widget_id,
			},
		});
	};
	const TimeIntervalOnchange = async (e) => {
		let d = e.target.value;
		let dta = {
			widget_id: data.widget_id,
			device_id: data.device_id,
			component_id: data.component_id,
			component_cap_id: data.component_cap_id,
			data_time_interval: d,
		};

		try {
			await getDataOnTImeIntervalGql({ variables: { input: dta } });
		} catch (error) {
			setselectedTimeInterval(data?.data_time_interval);
		}
	};

	const ViewDetails = () => {
		setshowViewDetailsModal(true);
	};
	const CloseViewWidget = () => {
		setshowViewDetailsModal(false);
	};
	const CloseEditModal = () => {
		setshowEditMdoal(false);
	};
	const EditWidget = () => {
		setshowEditMdoal(true);
	};
	const EditWidgetFunc = async (d) => {
		let sendData = {
			widget_id: data.widget_id,
			widget_name: data.widget_name,
			widget_title: d.widget_title,
			device_id: Number(d.device_id),
			component_id: Number(d.component_id),
			component_cap_id: Number(d.component_cap_id),
			data_time_interval: data.data_time_interval,
		};

		try {
			await Edit_widget_gql({ variables: { input: sendData } });
		} catch (error) {
			setshowEditMdoal(false);
		}
	};

	useEffect(() => {
		const close_rightbar = (e) => {
			if (e.keyCode === 27) {
				CloseRightBAr();
			}
		};
		window.addEventListener('keydown', close_rightbar);
		return () => window.removeEventListener('keydown', close_rightbar);
	}, []);

	useEffect(() => {
		let d = dataLiveTest.find(
			(li) => li.intervalTime === data.data_time_interval
		);
		setselectedInterval(d);
	}, [data.data_time_interval, selectedTimeInterval]);

	const HistoryIconClick = (d) => {
		sethistoryClickedUID(d);

		getHistory({
			variables: {
				command_widget_id: d.command_widget_id,
			},
		});
		context.setRightBarToggleState(true);
	};
	const CloseRightBAr = () => {
		context.setRightBarToggleState(false);
		sethistoryClickedUID(null);
	};

	return (
		<div>
			<EditModalWidget
				showEditMdoal={showEditMdoal}
				CloseEditModal={CloseEditModal}
				getwidgtDetailsLoading={getwidgtDetailsLoading}
				getwidgtDetailsData={getwidgtDetailsData}
				EditWidgetFunc={EditWidgetFunc}
				widgetTitle={data.widget_title}
				loadingEditWidget={loadingEditWidget}
			/>
			<WidgetDetails
				showViewDetailsModal={showViewDetailsModal}
				CloseViewWidget={CloseViewWidget}
				getwidgtDetailsLoading={getwidgtDetailsLoading}
				getwidgtDetailsData={getwidgtDetailsData}
			/>
			<div className="d-flex headingWidgets">
				<div className="headingCharticon">
					<IconComponent widget_name={data.widget_name} />
				</div>

				<span className="fs-5 text-dark chartTitle">{data.widget_title}</span>
				<div className="d-flex ml-auto">
					{data?.telemetry?.length > 0 &&
						(data.widget_name === 'ColumnChart' ||
							data.widget_name === 'LineChart') && (
							<OverlayTrigger placement="top" overlay={renderZoomTooltip}>
								<i
									onClick={(e) => {
										chartModalOpen(e, data.widget_name, data.telemetry);
									}}
									className="ri-fullscreen-line mt-1 ml-3 ri-lg delete_rule"></i>
							</OverlayTrigger>
						)}
					{!data?.command_widget_id ? (
						<i
							className="ri-more-line ri-lg mt-1 ml-3 delete_rule"
							onClick={(e) => {
								widgetActionFun(e);
							}}></i>
					) : (
						<i
							className="ri-history-line ri-lg mt-1 ml-3 delete_rule"
							onClick={() => HistoryIconClick(data)}></i>
					)}
				</div>
			</div>
			<hr className="hrCHart"></hr>
			{!data?.command_widget_id && (
				<div className="hrsTabCOntainer">
					{/* <div className=''> */}
					<span className="fs-6 text-dark font-weight-bold ml-3">
						<i className="ri-time-line ri-lg timeicon"></i>Time
					</span>

					<select
						className="timeIntervalSelect"
						value={selectedTimeInterval}
						onChange={(e) => TimeIntervalOnchange(e)}>
						{timeIntervalData.map((ld, ind) => {
							return <option value={ld.intervalTime}>{ld.intervalName}</option>;
						})}
					</select>

					<hr className="hrCHart"></hr>
				</div>
			)}

			{!data?.command_widget_id ? (
				!loadingTimeInterval ? (
					data?.telemetry.length > 0 ? (
						<ChartsContainer
							chartType={data.widget_name}
							data={data.telemetry}
						/>
					) : (
						<div className="text-warning fs-4 d-flex justify-content-center mt-5">
							oopss... No data for past
							{
								<span className="text-dark ml-2">
									{selectedInterval?.intervalName}
								</span>
							}
						</div>
					)
				) : (
					<div className="insideChartLoader">
						<Loaders
							height={180}
							width={350}
							margin_main={-120}
							margin_top={230}
						/>
					</div>
				)
			) : (
				<CommandWidgetCOntainer
					data={data && data}
					HistoryIconClick={HistoryIconClick}
				/>
			)}
			{
				<Chartmodal
					chartModalClose={chartModalClose}
					chartModalOpen={chartModalOpen}
					// data={data}
					showModal={showModal}
					wameOnZoom={wameOnZoom}
					wameOnZoomData={wameOnZoomData}
					// multiLineColor={multiLineColor}
				/>
			}

			<Overlay
				show={setPopoverWidget}
				target={target}
				rootClose
				onHide={() => setsetPopoverWidget()}
				placement="bottom">
				<Popover id="popover_option_click">
					<div className="option_container">
						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={() => {
								ViewDetails();
								setsetPopoverWidget(false);
							}}>
							View
						</div>
						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={() => {
								EditWidget();
								setsetPopoverWidget(false);
							}}>
							Edit
						</div>

						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={() => {
								DeleteWidget(data);
								setsetPopoverWidget(false);
							}}>
							Delete
						</div>
					</div>
				</Popover>
			</Overlay>
			{historyClickedUID && (
				<RIGHTBAR
					CloseRightBAr={CloseRightBAr}
					historyData={historyData}
					loading={historyLoading}
					historyClickedUIData={historyClickedUID}
				/>
			)}
		</div>
	);
};

export default WidgetsCopm;
