/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Popover, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { CSVLink } from 'react-csv';
import _ from 'lodash';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Barchartnew from '../../d3/Charts/BarChart/barchartnew';
import LineChartNew from '../../d3/Charts/LineChart/LineChartNew';
import Multilinechart from '../../d3/Charts/Multiline/MultilineChart';
import Pie from '../../d3/Charts/PieChart/Newpiechart';
import MultiEditModalCom from '../../Components/Modals/MultiLineEditModal';
import { Charts } from '../../d3/Charts/Charts';
import TabHrs from './tabHours';
import ViewDetailsComp from '../Modals/ViewDetailsWidget';
import EditDetailsComp from '../Modals/EditModalWidget';
//---- context
import { GlobalContextMain } from '../../Context/GlobalContextOne';
import BooleanComp from '../Dashboard/SensorpowerWidgets/BooleanComp';
import TextComp from '../Dashboard/SensorpowerWidgets/Text';
import Loaders from '../../Components/Loader/Loader';
import Chartmodal from '../Modals/Chartmodal';
import dataLiveTest from '../../Files/TimeInterval.json';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function Widgets({
	initialChartData,
	loadingInitialChart,
	dashboardId,
	loadingEdit,
	editWidget,
	widgetActionFun,
	setPopoverWidget,
	widgetActionData,
	setsetPopoverWidget,
	target,
	viewDetailsData,

	modalViewDetails,
	ViewDetails,
	Delete_widget,
	EditWidget,
	DuplicateWidget,
	duplicateWidgetLoading,
	closeDetailsModal,
	editmodaldata,
	showEditDetailsModal,
	closeEditModal,
	EditWidgetFunc,
	showEditMultiModal,

	updateComponents,
	showDataOninterval,
	dataSdataSensorPowerSubs,
	errorSensorPowerSubs,
	ChartSubsData,
	chartSubsError,
	isWidgetsChecked,
	checkedWidgetIds,
	handleWidgetCheck,
	setImageDownloading,
	setshowEditMultiModal,
}) {
	const context = useContext(GlobalContextMain);
	const { loadingTimeiNtervel } = useContext(GlobalContextMain);
	console.log(JSON.stringify(initialChartData));
	// checkbox for multiple delete -------------------------
	const [showModal, setShowModal] = useState(false);
	const [wameOnZoom, setWameOnZoom] = useState(null);
	const [multiLineColor, setMultiLineColor] = useState(null);
	const [wameOnZoomData, setWameOnZoomData] = useState(null);
	const chartModalClose = () => {
		setWameOnZoom(null);
		setWameOnZoomData(null);
		setMultiLineColor(null);
		setShowModal(false);
	};

	const chartModalOpen = (e, widgetName, data, multi_line_chart_data) => {
		setWameOnZoom(widgetName);
		setWameOnZoomData(data);
		setMultiLineColor(multi_line_chart_data);
		setShowModal(true);
	};

	const [showCheckbox, setShowCheckbox] = useState(false);
	const [hoverWidgetId, setHoverWidgetId] = useState(null);

	let activeDashboard = localStorage.getItem('active_tab') || 0;

	// grid layout ----------------------
	const [DOM, setDOM] = useState(null);
	const [wIdTabClick, setwIdTabClick] = useState(null);

	// text and sensor power comp
	const [layouts, setlayouts] = useState({});
	useEffect(() => {
		if (
			initialChartData &&
			initialChartData.length > 0 &&
			initialChartData !== null
		) {
			const originalLayouts = getFromLS('layouts', activeDashboard) || {};
			setlayouts(originalLayouts);
		}
	}, [initialChartData]);

	useEffect(() => {
		if (initialChartData && initialChartData !== null) {
			setDOM(generateDOM(initialChartData, 'layouts'));
		}
		if (!duplicateWidgetLoading) {
			setsetPopoverWidget(false);
		}
	}, [
		initialChartData,
		loadingEdit,
		loadingTimeiNtervel,
		dataSdataSensorPowerSubs,
		errorSensorPowerSubs,
		activeDashboard,
		duplicateWidgetLoading,
		showCheckbox,
		checkedWidgetIds,
		isWidgetsChecked,
		layouts,
	]);
	useEffect(() => {
		if (ChartSubsData) {
			let timer_fun = setTimeout(() => {
				setDOM(generateDOM(initialChartData, 'layouts'));
			}, 100);
			return () => {
				clearTimeout(timer_fun);
			};
		}
	}, [ChartSubsData, chartSubsError, isWidgetsChecked]);

	let compactType = 'vertical';
	if (loadingInitialChart) {
		return <Loaders />;
	}

	const onLayoutChange = (layout, layouts) => {
		saveToLS('layouts', layouts, activeDashboard);

		setlayouts(layouts);
	};
	const sendTextFunc = async (e) => {
		context.clickEvent(true, e.comp_id, false);
		e.comp_id = parseInt(e.comp_id);

		e.device_id = parseInt(e.device_id);
		e.dashboard_id = parseInt(e.dashboard_id);
		e.widget_id = parseInt(e.widget_id);

		try {
			await updateComponents({ variables: { input: e } });
		} catch (error) {
			context.clickEvent(false, null, false);
		}
	};

	const sendBooleanFunc = async (e) => {
		context.clickEvent(true, e.comp_id, false);
		e.comp_id = parseInt(e.comp_id);
		e.device_id = parseInt(e.device_id);
		e.dashboard_id = parseInt(e.dashboard_id);
		e.widget_id = parseInt(e.widget_id);
		if (e.init_value === 'false') {
			e.init_value = 'true';
		} else {
			e.init_value = 'false';
		}
		try {
			await updateComponents({ variables: { input: e } });
		} catch (error) {
			context.clickEvent(false, null, false);
		}
	};
	const imageCap = (widget_id) => {
		let node = document.getElementById('exportContainer' + widget_id);
		node.style.position = 'static';
		setImageDownloading(true);
		htmlToImage
			.toPng(node, {
				quality: 1,
				backgroundColor: '#fff',
				style: {
					border: 'dashed',
					borderRadius: '10px',
					padding: '-20px',
					borderColor: '#000000 black',
				},
			})
			.then(function (dataUrl) {
				download(dataUrl, `${widgetActionData?.widget_title}.png`);
				node.style.position = 'absolute';
				setImageDownloading(false);
			});
	};

	const imageJPEGCap = (widget_id) => {
		let node = document.getElementById('exportContainer' + widget_id);
		node.style.position = 'static';
		setsetPopoverWidget(false);
		setImageDownloading(true);
		htmlToImage
			.toJpeg(node, {
				quality: 1,
				backgroundColor: '#fff',
				style: {
					border: 'dashed',
					borderRadius: '10px',
					padding: '-20px',
					borderColor: '#000000 black',
				},
			})

			.then(function (dataUrl) {
				let link = document.createElement('a');
				link.download = `${widgetActionData?.widget_title}.jpeg`;
				link.href = dataUrl;
				node.style.position = 'absolute';
				link.click();
				link.remove();
				setImageDownloading(false);
			});
	};

	// generating dom --------------------------------
	let TabHrsState = null;

	const tabHrsClick = async (ld, ind, wData) => {
		console.log(ld);
		setwIdTabClick(wData.widget_id);
		context.clickEvent(false, null, true);
		context.widgetClickId(wData.widget_id);
		let ar = await wData.multi_line_chart_data.map((li) => {
			return {
				rule_id: li.rule_id,
				component_id: li.component_id,
			};
		});

		let e = {
			widget_id: wData.widget_id,
			component_id: wData.component_id,
			mac_address: wData.device_name,
			datasetName: wData.sensorName,
			rule_id: wData.rule_id,
			timeInterval: ld,
			multi_comp_chart_input: ar,
		};
		setTimeout(() => {
			try {
				showDataOninterval({ variables: { input: e } });
			} catch (error) {
				context.clickEvent(false, null, false);
				context.widgetClickId(null);
			}
		}, 1000);
	};

	const renderZoomTooltip = (props) => (
		<Tooltip id="button-tooltip-TEST" {...props}>
			Expand to full screen
			{console.log(props)}
		</Tooltip>
	);

	const generateDOM = (li, key) => {
		const layout = generateLayout();
		return _.map(layout, function (l) {
			let hoveredWidget = document.getElementById(
				'exportContainer' + li[l.i].widget_id
			);
			return (
				<div
					key={l.i + '0'}
					data-grid={l}
					index={l.i}
					id={'exportContainer' + li[l.i].widget_id}
					className="pt-2 commonClassWidget"
					onMouseEnter={() => {
						if (checkedWidgetIds.length > 0) {
							if (
								hoveredWidget !== null &&
								hoveredWidget.style.backgroundColor !== 'rgb(212, 212, 212)'
							) {
								hoveredWidget.style.backgroundColor = '#f4f4f4';
							}
						}
					}}
					onMouseLeave={() => {
						if (checkedWidgetIds.length > 0) {
							if (
								hoveredWidget !== null &&
								hoveredWidget.style.backgroundColor !== 'rgb(212, 212, 212)'
							) {
								hoveredWidget.style.backgroundColor = '#fff';
							}
						}
					}}>
					{li[l.i].widget_name !== 'SensorPower' ? (
						<>
							{sensorPowerTop(li, l, null, hoveredWidget)}
							<hr className="hrCHart"></hr>
							<div className="hrsTabCOntainer">
								<span className="fs-6 text-dark mr-2 bg-light px-2 py-1">
									{/*<i className="ri-time-line"></i>*/} Time
								</span>

								{dataLiveTest.map((ld, ind) => (
									<TabHrs
										ld={ld}
										ind={ind}
										wData={li[l.i]}
										timeInterval={li[l.i].data_time_interval}
										tabHrsClick={tabHrsClick}
										TabHrsState={TabHrsState}
									/>
								))}
								<hr className="hrCHart"></hr>
							</div>
							{!loadingTimeiNtervel || wIdTabClick !== li[l.i].widget_id ? (
								li[l.i].data !== null && li[l.i].data.length > 0 ? (
									<>
										{li[l.i].widget_name === 'ColumnChart' ? (
											<>
												<Barchartnew data={li[l.i].data} />
											</>
										) : li[l.i].widget_name === 'LineChart' ? (
											<LineChartNew data={li[l.i].data} />
										) : li[l.i].widget_name === 'MultiLineChart' ? (
											<Multilinechart
												data={li[l.i].data}
												multilinecolor={li[l.i].multi_line_chart_data}
											/>
										) : li[l.i].widget_name === 'PieChart' ? (
											<Pie data={li[l.i].data} />
										) : (
											// li[l.i].widget_name === 'GaugeChart'
											<Charts
												chartType={li[l.i].widget_name}
												chartData={li[l.i].data}
												// chartData={data}
											/>
										)}
									</>
								) : (
									<div className="alert alert-warning mt-5">
										No data for selected options.
									</div>
								)
							) : (
								<div className="insideChartLoader">
									<Loaders
										height={180}
										width={350}
										margin_main={-120}
										margin_top={250}
									/>
								</div>
							)}
						</>
					) : (
						li[l.i].widget_name === 'SensorPower' &&
						li[l.i].sensor_power_data.length > 0 && (
							<>
								{li[l.i].sensor_power_data.length > 0 &&
									li[l.i].sensor_power_data.map((s) =>
										s.data_type === 'String' ? (
											<>
												{sensorPowerTop(li, l, s, hoveredWidget)}
												<TextComp
													data={s}
													dashboard_id={dashboardId}
													widget_id={li[l.i].widget_id}
													device_id={li[l.i].device_id}
													sendTextFunc={sendTextFunc}
													dataSdataSensorPowerSubs={dataSdataSensorPowerSubs}
												/>
											</>
										) : (
											<>
												{sensorPowerTop(li, l, s, hoveredWidget)}

												<BooleanComp
													data={s}
													dashboard_id={dashboardId}
													widget_id={li[l.i].widget_id}
													device_id={li[l.i].device_id}
													sendBooleanFunc={sendBooleanFunc}
													dataSdataSensorPowerSubs={dataSdataSensorPowerSubs}
												/>
											</>
										)
									)}
							</>
						)
					)}
				</div>
			);
		});
	};

	const sensorPowerTop = (li, l, s, hoveredWidget) => {
		return (
			<div>
				<div
					className="d-flex headingWidgets"
					onMouseLeave={() => {
						if (
							hoveredWidget !== null &&
							hoveredWidget !== undefined &&
							hoveredWidget.style.backgroundColor !== 'rgb(212, 212, 212)'
						) {
							hoveredWidget.style.backgroundColor = '#fff';
						}
						setShowCheckbox(false);
						setHoverWidgetId(null);
					}}>
					<div
						className="d-flex"
						onMouseEnter={() => {
							if (checkedWidgetIds.length === 0) {
								setShowCheckbox(true);
								setHoverWidgetId(li[l.i].widget_id);
							}
							if (
								hoveredWidget !== null &&
								hoveredWidget !== undefined &&
								hoveredWidget.style.backgroundColor !== 'rgb(212, 212, 212)'
							) {
								hoveredWidget.style.backgroundColor = '#f4f4f4';
							}
						}}>
						{li[l.i].widget_name === 'ColumnChart' && (
							<>
								<i className="ri-bar-chart-line headingCharticon"></i>
							</>
						)}
						{li[l.i].widget_name === 'LineChart' && (
							<i className="ri-line-chart-line headingCharticon"></i>
						)}
						{li[l.i].widget_name === 'PieChart' && (
							<i className="ri-pie-chart-2-line headingCharticon"></i>
						)}
						{li[l.i].widget_name === 'GaugeChart' && (
							<i className="ri-dashboard-2-line headingCharticon"></i>
						)}
						{li[l.i].widget_name === 'MultiLineChart' && (
							<i className="ri-exchange-funds-fill headingCharticon"></i>
						)}

						{li[l.i].sensor_power_data.map((d) =>
							d.data_type === 'Boolean' ? (
								<div className="dot mt-2"></div>
							) : (
								<i className="ri-send-plane-line headingCharticon"></i>
							)
						)}

						<span className="fs-4  text-dark">{li[l.i].widget_title}</span>
					</div>
					{showCheckbox && checkedWidgetIds.length === 0
						? hoverWidgetId === li[l.i].widget_id && (
								<input
									type="checkbox"
									className="checkBoxCHatrts"
									onChange={(e) => {
										handleWidgetCheck(e, li[l.i]);
									}}
									checked={checkedWidgetIds.includes(li[l.i].widget_id)}
								/>
						  )
						: checkedWidgetIds.length !== 0 && (
								<input
									type="checkbox"
									className="checkBoxCHatrts"
									onChange={(e) => {
										handleWidgetCheck(e, li[l.i]);
									}}
									checked={checkedWidgetIds.includes(li[l.i].widget_id)}
								/>
						  )}
					<i
						className="ri-more-line ri-lg mt-1  ml-auto"
						onClick={(e) => {
							widgetActionFun(e, li[l.i]);
						}}></i>
					{console.log(li[l.i].widget_name)}
					{li[l.i].widget_name !== 'SensorPower' ? (
						<OverlayTrigger placement="top" overlay={renderZoomTooltip}>
							<i
								onClick={(e) => {
									chartModalOpen(
										e,
										li[l.i].widget_name,
										li[l.i].data,
										li[l.i].multi_line_chart_data
									);
								}}
								className="ri-fullscreen-line  mt-1 ml-2 ri-lg"></i>
						</OverlayTrigger>
					) : null}
				</div>

				{s !== null && (
					<div className=" fs-7 text-muted ml-3">{s.updated_at}</div>
				)}
			</div>
		);
	};

	const generateLayout = () => {
		return (
			initialChartData !== undefined &&
			initialChartData !== null &&
			initialChartData.map(function (item, i) {
				let h = 5;
				if (item.widget_name === 'SensorPower') {
					item.sensor_power_data?.map((data) => {
						if (data.data_type === 'Boolean' || data.data_type === 'Text') {
							h = 2.5;
						}
					});
				}
				return {
					x: (i * 4) % 12,
					y: Math.floor(i / 6),
					h: 5,
					w: 4,
					minW: 4,
					maxW:
						item.widget_name === 'PieChart' || item.widget_name === 'GaugeChart'
							? 4
							: 12,
					minH: 5,
					maxH: 5,

					i: i.toString(),
				};
			})
		);
	};
	return (
		<div>
			<Chartmodal
				chartModalClose={chartModalClose}
				chartModalOpen={chartModalOpen}
				// data={data}
				showModal={showModal}
				wameOnZoom={wameOnZoom}
				wameOnZoomData={wameOnZoomData}
				multiLineColor={multiLineColor}
			/>

			{viewDetailsData !== undefined && (
				<ViewDetailsComp
					modalViewDetails={modalViewDetails}
					closeDetailsModal={closeDetailsModal}
					viewDetailsData={viewDetailsData}
				/>
			)}

			{editmodaldata !== undefined && (
				<>
					{editmodaldata.widget_name !== 'MultiLineChart' ? (
						<EditDetailsComp
							showEditDetailsModal={showEditDetailsModal}
							closeEditModal={closeEditModal}
							editmodaldata={editmodaldata}
							EditWidgetFunc={EditWidgetFunc}
							loadingEdit={loadingEdit}
						/>
					) : (
						<MultiEditModalCom
							showEditMultiModal={showEditMultiModal}
							closeEditModal={closeEditModal}
							editmodaldata={editmodaldata}
							setshowEditMultiModal={setshowEditMultiModal}
							dashboardId={dashboardId}
							editWidget={editWidget}
							loadingEdit={loadingEdit}
						/>
					)}
				</>
			)}

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
							View details
						</div>
						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={() => {
								EditWidget();
								setsetPopoverWidget(false);
							}}>
							Edit
						</div>
						{widgetActionData !== null &&
							widgetActionData.widget_name !== 'SensorPower' &&
							widgetActionData.original_widget && (
								<div
									className={
										'fs-7 px-3 py-1 d-flex align-items-center ' +
										(duplicateWidgetLoading
											? 'duplicateLoading'
											: 'popoverElements')
									}
									onClick={(e) => {
										!duplicateWidgetLoading && DuplicateWidget(e);
									}}>
									Duplicate
									{duplicateWidgetLoading && (
										<div className="spinner-border text-dark ml-auto"></div>
									)}
								</div>
							)}
						<div
							className="fs-7 px-3 py-1 popoverElements"
							onClick={() => {
								Delete_widget();
								setsetPopoverWidget(false);
							}}>
							Delete
						</div>
						<div>
							<OverlayTrigger
								placement="right"
								trigger="click"
								overlay={
									<Popover>
										<Popover.Content
											className="fs-7 px-3 py-1 popoverElements"
											onClick={() => {
												imageCap(widgetActionData?.widget_id);
												setsetPopoverWidget(false);
											}}>
											Download as PNG
										</Popover.Content>

										<Popover.Content
											className="fs-7 px-3 py-1 popoverElements"
											onClick={() => {
												imageJPEGCap(widgetActionData?.widget_id);
												setsetPopoverWidget(false);
											}}>
											Download as JPEG
										</Popover.Content>
									</Popover>
								}>
								<div className="fs-7 px-3 py-1 popoverElements downloadBtn">
									Download Image
									<i className="ri-arrow-right-s-line download-image-icon" />
								</div>
							</OverlayTrigger>
						</div>
						{widgetActionData !== null &&
							widgetActionData.widget_name !== 'SensorPower' && (
								<CSVLink
									data={widgetActionData?.data.map(
										({ __typename, ...rest }) => rest
									)}
									filename={`${widgetActionData?.widget_title}.csv`}
									className="fs-7 px-3 py-1 csvexportstyle">
									Export CSV
								</CSVLink>
							)}
					</div>
				</Popover>
			</Overlay>

			<ResponsiveReactGridLayout
				className="layout"
				isDraggable={true}
				isResizable={true}
				rowHeight={50}
				layouts={layouts}
				measureBeforeMount={false}
				useCSSTransforms={false}
				draggableHandle=".headingWidgets"
				compactType={compactType}
				cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
				margin={[24, 20]}
				preventCollision={!compactType}
				onLayoutChange={(layout, layouts) => {
					onLayoutChange(layout, layouts);
				}}>
				{DOM}
			</ResponsiveReactGridLayout>
		</div>
	);
}

export default Widgets;

function getFromLS(key, activeDashboard) {
	let ls = {};
	if (global.localStorage) {
		try {
			ls = JSON.parse(global.localStorage.getItem(activeDashboard)) || {};
		} catch (e) {
			/*Ignore*/
		}
	}
	return ls[key];
}
function saveToLS(key, value, activeDashboard) {
	if (global.localStorage) {
		global.localStorage.setItem(
			activeDashboard,
			JSON.stringify({
				[key]: value,
			})
		);
	}
}
