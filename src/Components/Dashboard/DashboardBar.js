import React, { useState, useEffect, useContext } from 'react';

// bootstrap
import { Modal } from 'react-bootstrap';

import Empty from '../../Components/Empty_pages/empty';
import modalDelete from '../../Files/DeleteData';
import ModalDash from '../Modals/dashboardNAme';
import DeleteModal from '../Modals/DeleteModal';

import { toast } from 'react-toastify';

// ------ Select -------------
import styles from '../../Styles/Styles.js';

// form elements
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import decodeJWT from 'jwt-decode';

import '../../Styles/ResizeGridLayout.css';
import Widgets from './widgets';

//---- context
import { GlobalContextMain } from '../../Context/GlobalContextOne';
import Loaders from '../../Components/Loader/Loader';

// graphql
import {
	useQuery,
	useMutation,
	useSubscription,
	useLazyQuery,
} from '@apollo/react-hooks';
import { D2CMESSAGE, CHARTWSDATA } from '../../Subscriptions';
import {
	DASHBOARDDATABYID,
	DASHBOARDLIST,
	GETDEVICEDATASET,
} from '../../Queries';
import {
	DUPLICATEWIDGET,
	EDITWIDGET,
	UPDATECOMPONENTS,
	DATAONTIMEINTERVEL,
} from '../../Mutations';
import {
	DELETEDASHBOARD,
	DELETEWIDGET,
	SAVEDASHBOARDNAME,
	SAVEUSERDASHBOARD,
} from '../../Mutations';

// Stylesheet
import '../../Styles/modal_popover.css';
import '../../Styles/chart.css';
import DashboardTopBar from './DashboardTopBar';
import TopBar from '../Navigation/TopBar';
import MultiLineChart from './MultiLineChart';

const layoutRightBAr = [{ i: 'a', x: 0, y: 0, w: 2, h: 2 }];

function DashboardBar() {
	let token = localStorage.getItem('btoken');
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	let email_id = '';
	let widIndex = null;
	let widId = null;
	if (token) {
		const decoded = decodeJWT(token);
		email_id = decoded.emails[0];
	}
	const context = useContext(GlobalContextMain);

	let active_tab = localStorage.getItem('active_tab') || 0;
	const [activeDashboard, setactiveDashboard] = useState(Number(active_tab));

	const { register, handleSubmit, errors } = useForm();
	const [showTopbar, setShowTopbar] = useState(true);

	// dashboard list popover states
	const [dashboardTarget, setDashboardTarget] = useState(null);
	const [showDashboardListPopover, setShowDashboardListPopver] = useState(
		false
	);

	// current dashboard popover states
	const [currentDashTarget, setCurrentDashTarget] = useState(null);
	const [showCurrentDashPopover, setShowCurrentDashPopover] = useState(false);

	//Popover --------------------
	const [target, setTarget] = useState(null);

	//Modal --- states
	const [modaldata, setmodaldata] = useState(null);
	const [createDash, setcreateDash] = useState(null);
	const [dashboard_modal, setdashboard_modal] = useState(false);
	const [editDashboard, seteditDashboard] = useState(null);
	const [circleloading, setcircleloading] = useState(false);
	const [disabled, setdisabled] = useState(false);
	const [showCreatewidgetModal, setshowCreatewidgetModal] = useState(false);
	const [widgetName, setwidgetName] = useState('');
	const [Widgettittle, setWidgettittle] = useState('');

	// dashboard modal ---------------
	const [dashboardNameEdit, setdashboardNameEdit] = useState(null);
	const [showModalDelete, setshowModalDelete] = useState(false); // show_modal_delete
	const [indexIdDelete, setindexDelete] = useState(null); // index_id
	const [imageDownloading, setImageDownloading] = useState(false);

	const [selected_device, setselected_device] = useState();
	const [selecteddataset, setselecteddataset] = useState();

	const [rules, setrules] = useState();
	const [sensorSelected, setsensorSelected] = useState();
	const [allDevices, setallDevices] = useState();
	const [allDataSets, setallDataSets] = useState();
	const [allRules, setallRules] = useState();
	const [sensorData, setsensorData] = useState();
	//----------------------- widgets-------------------------

	const [setPopoverWidget, setsetPopoverWidget] = useState(false);
	const [widgetActionData, setwidgetActionData] = useState(null);
	const [viewDetailsData, setviewDetailsData] = useState();
	const [modalViewDetails, setmodalViewDetails] = useState(false);
	const [isWidgets, setIsWidgets] = useState(true);

	//---------- Edit modal -----------------------------------
	const [showEditDetailsModal, setshowEditDetailsModal] = useState(false);
	const [showEditMultiModal, setshowEditMultiModal] = useState(false);

	const [editmodaldata, seteditmodaldata] = useState();

	//----------------Delete modal
	const [WIdgetDeletedata, setWIdgetDeletedata] = useState(null);
	const [deleteMultiwidgets, setdeleteMultiwidgets] = useState(false); //to delete multiple widgets

	//------------ multiple delete checkbox-------------------
	const [isWidgetsChecked, setIsWidgetsChecked] = useState([]);
	const [checkedWidgetIds, setCheckedWidgetIds] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [selectBarTarget, setSelectBarTarget] = useState(null);
	const [setSelectPopoverWidget, setsetSelectPopoverWidget] = useState(false);

	// -------------------Multi-Line chart--------------------
	const [selectedRulesToshow, setSelectedRulesToShow] = useState([]);
	const [compAndRules, setCompAndRules] = useState([]);
	const [noRulesSelected, setNoRulesSelected] = useState(true);

	// graphql ---- device ----------------------------------------

	const {
		data: dataSdataSensorPowerSubs,
		error: errorSensorPowerSubs,
	} = useSubscription(D2CMESSAGE, {
		variables: { topic: { topic: 'd2cMessage/' + email_id } },
	});

	const [
		getDeviceDataset,
		{ loading: loadingDevice, data: deviceData },
	] = useLazyQuery(GETDEVICEDATASET, {
		fetchPolicy: 'network-only',
	});

	// graphql  ------------------- widgets--------
	const [
		getInitialDataFun,
		{ loading: loadingInitialChart, data: initialChartData },
	] = useLazyQuery(DASHBOARDDATABYID);
	const { loading: loadingdashboard, data: dashboardList } = useQuery(
		DASHBOARDLIST,
		{
			fetchPolicy: 'network-only',
		}
	);
	console.log(JSON.stringify(initialChartData));
	const { data: ChartSubsData, error: chartSubsError } = useSubscription(
		CHARTWSDATA,
		{
			variables: { topic: { topic: 'sensordata/' + email_id } },
		}
	);

	// const [editDashboardGqlFun] = useMutation('EDITDASHNAME, {
	// 	update(proxy, result) {
	// 		let data = proxy.readQuery({
	// 			query: DASHBOARDLIST,
	// 		});

	// 		data.getUserDashboardNames[active_tab].dashboard_name = dashboardNameEdit;
	// 		proxy.writeQuery({
	// 			query: DASHBOARDLIST,
	// 			data,
	// 		});
	// 		//setactiveDashboard();
	// 		setcircleloading(false);
	// 		setdisabled(false);
	// 		setdashboard_modal(false);
	// 	},
	// });
	//console.log(dashboardList);
	const [createDashboardNameGql] = useMutation(SAVEDASHBOARDNAME, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDLIST,
			});

			let res = result.data.save_dashboard_name;
			data.getUserDashboardNames = [...data.getUserDashboardNames, res];
			proxy.writeQuery({
				query: DASHBOARDLIST,
				data,
			});

			setactiveDashboard(data.getUserDashboardNames.length - 1);
			localStorage.setItem('active_tab', data.getUserDashboardNames.length - 1);
			setdisabled(false);
			setcircleloading(false);
			setdashboard_modal(false);

			getInitialDataFun({
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[
							parseInt(data.getUserDashboardNames.length - 1)
						].dashboard_id,
				},
			});
		},
	});

	const [editWidget, { loading: loadingEdit }] = useMutation(EDITWIDGET, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
			});

			let res = result.data.edit_sensor_widget;

			data.getUserDashboardWidgetInfo.map((li, ind) => {
				if (li.widget_id === res.widget_id) {
					li.widget_title = res.widget_title;
					li.data = res.data;
					li.rule_name = res.rule_name;
					li.rule_id = res.rule_id;
					li.multi_line_chart_data = res.multi_line_chart_data;
				}
			});
			proxy.writeQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
				data,
			});
			setshowEditMultiModal(false);
		},
	});

	const [DeleteDashboard] = useMutation(DELETEDASHBOARD, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDLIST,
			});
			data.getUserDashboardNames = data.getUserDashboardNames.filter(
				(d) =>
					d.dashboard_id !==
					dashboardList.getUserDashboardNames[parseInt(active_tab)].dashboard_id
			);
			proxy.writeQuery({
				query: DASHBOARDLIST,
				data,
			});
			if (data.getUserDashboardNames.length === 0) {
				setactiveDashboard(null);
				localStorage.removeItem('active_tab');
			} else {
				setactiveDashboard(data.getUserDashboardNames.length - 1);
				localStorage.setItem(
					'active_tab',
					data.getUserDashboardNames.length - 1
				);
			}
			setcircleloading(false);
			setdisabled(false);
			setshowModalDelete(false);
		},
		refetchQueries: [
			{
				query: GETDEVICEDATASET,
			},
		],
	});

	const [DuplicateWidgetFun, { loading: duplicateWidgetLoading }] = useMutation(
		DUPLICATEWIDGET,
		{
			update(proxy, result) {
				let chartRest = result.data.createDuplicateWidget;
				let count = chartRest.widget_data[0].duplicate_count;
				let data = proxy.readQuery({
					query: DASHBOARDDATABYID,
					variables: {
						dashboard_id:
							dashboardList.getUserDashboardNames[parseInt(active_tab)]
								.dashboard_id,
					},
				});
				widIndex = Number(widIndex);
				data.getUserDashboardWidgetInfo.map((li) => {
					if (li.widget_id === widId) {
						li.duplicate_count = count;
						return li;
					}
					return li;
				});
				data.getUserDashboardWidgetInfo = [
					...data.getUserDashboardWidgetInfo.slice(0, widIndex + 1),
					chartRest.widget_data[0],
					...data.getUserDashboardWidgetInfo.slice(widIndex + 1),
				];

				proxy.writeQuery({
					query: DASHBOARDDATABYID,
					variables: {
						dashboard_id:
							dashboardList.getUserDashboardNames[parseInt(active_tab)]
								.dashboard_id,
					},
					data,
				});

				//setData(updateWidget);

				setrules('');
				setallRules();
				setallDevices();
				setselected_device('');
				setselecteddataset('');
				setallDataSets('');
			},
			refetchQueries: [
				{
					query: GETDEVICEDATASET,
				},
			],

			awaitRefetchQueries: true,
		}
	);

	const [Savedashboarduser, { loading: updateWidgetLoading }] = useMutation(
		SAVEUSERDASHBOARD,
		{
			update(proxy, result) {
				setshowCreatewidgetModal(false);
				setdisabled(false);
				let chartRest = result.data.save_user_dashboard;

				// console.log(chartRest);
				let data = proxy.readQuery({
					query: DASHBOARDDATABYID,
					variables: {
						dashboard_id:
							dashboardList.getUserDashboardNames[parseInt(active_tab)]
								.dashboard_id,
					},
				});

				data.getUserDashboardWidgetInfo = [
					chartRest.widget_data[0],
					...data.getUserDashboardWidgetInfo,
				];

				proxy.writeQuery({
					query: DASHBOARDDATABYID,
					variables: {
						dashboard_id:
							dashboardList.getUserDashboardNames[parseInt(active_tab)]
								.dashboard_id,
					},
					data,
				});

				//setData(updateWidget);

				setrules('');
				setallRules();
				setallDevices();
				setselected_device('');
				setselecteddataset('');
				setallDataSets('');
			},
			refetchQueries: [
				{
					query: GETDEVICEDATASET,
				},
			],

			awaitRefetchQueries: true,
		}
	);
	const [DeleteWidget] = useMutation(DELETEWIDGET, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
			});
			let orgIdofDuplicates = [];
			for (let i = 0; i < checkedWidgetIds.length; i++) {
				for (let j = 0; j < data.getUserDashboardWidgetInfo.length; j++) {
					if (
						data.getUserDashboardWidgetInfo[j].widget_id ===
							checkedWidgetIds[i] &&
						!data.getUserDashboardWidgetInfo[j].original_widget
					) {
						orgIdofDuplicates.push(
							data.getUserDashboardWidgetInfo[j].original_widget_id
						);
					}
				}
			}
			if (orgIdofDuplicates.length > 0) {
				let count = 0;
				data.getUserDashboardWidgetInfo = data.getUserDashboardWidgetInfo.map(
					(li) => {
						if (orgIdofDuplicates.includes(li.widget_id)) {
							count = countOccurrences(orgIdofDuplicates, li.widget_id);
							li.duplicate_count -= count;
							return li;
						}
						return li;
					}
				);
			} else if (WIdgetDeletedata !== null) {
				data.getUserDashboardWidgetInfo = data.getUserDashboardWidgetInfo.map(
					(li) => {
						if (WIdgetDeletedata.original_widget_id === li.widget_id) {
							li.duplicate_count -= 1;
							return li;
						}
						return li;
					}
				);
			}
			WIdgetDeletedata !== null
				? (data.getUserDashboardWidgetInfo = data.getUserDashboardWidgetInfo.filter(
						(d) => d.widget_id !== WIdgetDeletedata.widget_id
				  ))
				: (data.getUserDashboardWidgetInfo = data.getUserDashboardWidgetInfo.filter(
						(d) => !checkedWidgetIds.includes(d.widget_id)
				  ));

			proxy.writeQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
				data,
			});
			// I(result.data.delete_widget);

			setcircleloading(false);
			setdisabled(false);
			setshowModalDelete(false);
			setCheckedWidgetIds([]);
			initialChartData.getUserDashboardWidgetInfo.forEach((widget_data) => {
				document.getElementById(
					'exportContainer' + widget_data.widget_id
				).style.backgroundColor = '#fff';
			});
		},
		refetchQueries: [
			{
				query: GETDEVICEDATASET,
			},
		],
	});

	const [updateComponents] = useMutation(UPDATECOMPONENTS, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
			});

			let resultdata = result.data.update_user_components[0];

			data.getUserDashboardWidgetInfo.map((widgetD, index) => {
				if (widgetD.widget_id === resultdata.widget_id) {
					widgetD.sensor_power_data = [resultdata];
				}
			});
			proxy.writeQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
				data,
			});

			context.clickEvent(false, null, false);
		},
	});

	const [showDataOninterval] = useMutation(DATAONTIMEINTERVEL, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
			});

			let resultData = result.data.getSensorDataOnTimeInterval;

			data.getUserDashboardWidgetInfo.map((widgetD, index) => {
				if (widgetD.widget_id === resultData.widget_id) {
					widgetD.data = resultData.data;
					widgetD.data_time_interval = resultData.data_time_interval;
				}
			});
			proxy.writeQuery({
				query: DASHBOARDDATABYID,
				variables: {
					dashboard_id:
						dashboardList.getUserDashboardNames[parseInt(active_tab)]
							.dashboard_id,
				},
				data,
			});
			context.clickEvent(false, null, false);
		},
	});

	//useeffect --------------------------
	useEffect(() => {
		if (dataSdataSensorPowerSubs) {
			initialChartData &&
				initialChartData.getUserDashboardWidgetInfo.map((li, index) => {
					if (
						li.component_id === dataSdataSensorPowerSubs.d2cMessage.component_id
					) {
						li.sensor_power_data[0].component_id =
							dataSdataSensorPowerSubs.d2cMessage.component_id;
						li.sensor_power_data[0].component_name =
							dataSdataSensorPowerSubs.d2cMessage.component_name;
						li.sensor_power_data[0].data_type =
							dataSdataSensorPowerSubs.d2cMessage.data_type;
						li.sensor_power_data[0].in_out =
							dataSdataSensorPowerSubs.d2cMessage.in_out;
						li.sensor_power_data[0].init_value =
							dataSdataSensorPowerSubs.d2cMessage.init_value;
						li.sensor_power_data[0].response = null;
						li.sensor_power_data[0].responseType = null;
						li.sensor_power_data[0].updated_at =
							dataSdataSensorPowerSubs.d2cMessage.updated_at;
					}
				});
		}
		if (errorSensorPowerSubs) {
			toast.error('SUbscription Error');
		}
		initialChartData && initialChartData.getUserDashboardWidgetInfo.length !== 0
			? setIsWidgets(true)
			: setIsWidgets(false);
	}, [
		dataSdataSensorPowerSubs,
		initialChartData,
		errorSensorPowerSubs,
		isWidgets,
	]);

	// useEffect(() => {
	// 	if (ChartSubsData) {
	// 		let timer_fun = setTimeout(() => {
	// 			alert('inside');
	// 			window.location.reload();
	// 		}, 60000);
	// 		return () => {
	// 			clearTimeout(timer_fun);
	// 		};
	// 	}
	// }, [ChartSubsData]);
	const MINUTE_MS = 20 * 60 * 1000;

	useEffect(() => {
		if (ChartSubsData) {
			const interval = setInterval(() => {
				window.location.reload();
			}, MINUTE_MS);

			return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
		}
	}, [ChartSubsData, MINUTE_MS]);

	useEffect(() => {
		let flag = false;
		for (let i = 0; i < selectedRulesToshow.length; i++) {
			if (selectedRulesToshow[i] !== '') {
				flag = true;
				break;
			}
		}
		flag ? setNoRulesSelected(false) : setNoRulesSelected(true);
	}, [selectedRulesToshow]);

	useEffect(() => {
		if (ChartSubsData) {
			initialChartData &&
				initialChartData.getUserDashboardWidgetInfo.map((li) =>
					ChartSubsData.sensordata.map((sData) => {
						if (sData.widget_id === li.widget_id) {
							if (li.widget_name === 'PieChart') {
								li.data = [];
								li.data = sData.data;
							} else {
								if (li.data.length > 150) {
									li.data.shift();
								}

								sData.data.map((te) => {
									li.data.push(te);
								});
							}
						}
					})
				);
			//  setchartLive(ChartSubsData);
		}
		if (chartSubsError) {
			toast.error('SUbscription Error');
		}
	}, [initialChartData, chartSubsError, ChartSubsData]);

	useEffect(() => {
		if (dashboardList !== undefined) {
			if (dashboardList.getUserDashboardNames.length > 0) {
				getInitialDataFun({
					variables: {
						dashboard_id:
							dashboardList?.getUserDashboardNames[parseInt(activeDashboard)]
								?.dashboard_id,
					},
				});
			}
		}
	}, [activeDashboard, active_tab, dashboardList, getInitialDataFun]);

	useEffect(() => {
		if (!loadingInitialChart) {
			checkedWidgetIds.length ===
			initialChartData?.getUserDashboardWidgetInfo?.length
				? setAllSelected(true)
				: setAllSelected(false);
		}
	}, [checkedWidgetIds, initialChartData, loadingInitialChart]);

	// active intervel useeffect
	//---------------- device useeffect -----------
	useEffect(() => {
		if (
			loadingDevice === false &&
			deviceData !== undefined &&
			deviceData?.get_device_dataset_name?.length > 0
		) {
			let d = {
				value: deviceData.get_device_dataset_name[0].device_id,
				label: deviceData.get_device_dataset_name[0].device_name,
			};

			setselected_device(d);

			let arr = [];
			deviceData.get_device_dataset_name.map((li) => {
				let d = {
					value: li.device_id,
					label: li.device_name,
				};
				arr.push(d);
			});

			setallDevices(arr);

			if (deviceData?.get_device_dataset_name[0]?.device_dataset?.length > 0) {
				setselecteddataset({
					value:
						deviceData.get_device_dataset_name[0].device_dataset[0]
							.component_id,
					label:
						deviceData.get_device_dataset_name[0].device_dataset[0]
							.dataset_name,
				});

				let arrDataset = [];
				deviceData.get_device_dataset_name[0].device_dataset.map((li) => {
					let d = {
						value: li.component_id,
						label: li.dataset_name,
					};
					arrDataset.push(d);
				});
				setallDataSets(arrDataset);

				if (
					deviceData.get_device_dataset_name[0].device_dataset[0].rules.length >
					0
				) {
					setrules({
						value:
							deviceData.get_device_dataset_name[0].device_dataset[0].rules[0]
								.rule_id,
						label:
							deviceData.get_device_dataset_name[0].device_dataset[0].rules[0]
								.rule_name,
					});
					let arrRules = [];
					deviceData.get_device_dataset_name[0].device_dataset[0].rules.map(
						(li) => {
							let d = {
								value: li.rule_id,
								label: li.rule_name,
							};
							arrRules.push(d);
						}
					);
					setallRules(arrRules);
				} else {
					setrules('');
				}
			} else {
				setselecteddataset();
			}

			if (
				deviceData?.get_device_dataset_name[0]?.dev_component_names?.length > 0
			) {
				setsensorSelected({
					value:
						deviceData.get_device_dataset_name[0].dev_component_names[0]
							.component_id,
					label:
						deviceData.get_device_dataset_name[0].dev_component_names[0]
							.component_name,
				});
				let sensorArea = [];
				deviceData.get_device_dataset_name[0].dev_component_names.map((li) => {
					let d = {
						value: li.component_id,
						label: li.component_name,
					};
					sensorArea.push(d);
				});
				setsensorData(sensorArea);
			} else {
				setsensorData([]);
				setsensorSelected();
			}
		}
	}, [deviceData, loadingDevice]);

	// --------------------------------------view details Modal-----------------------
	const ViewDetails = () => {
		setviewDetailsData(widgetActionData);
		setmodalViewDetails(true);
	};
	const closeDetailsModal = () => {
		setmodalViewDetails(false);
	};

	//functios --------------------------------------------
	const CreateDashoard_modal = (d) => {
		setcreateDash(d);
		seteditDashboard(null);
		setdashboard_modal(true);
	};

	const handleClose = () => {
		setdashboard_modal(false);
		setdisabled(false);
		setcircleloading(false);
	};

	const handleCloseDeleteModal = () => {
		setshowModalDelete(false);

		setcircleloading(false);
		setdisabled(false);
	};

	const widgetActionFun = (event, t) => {
		setsetPopoverWidget(true);
		setTarget(event.target);
		console.log(t);
		setwidgetActionData(t);
		// console.log(t);
	};

	const countOccurrences = (arr, val) => {
		return arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
	};

	// delete multiple widgets ----------------------
	const handleSelectAllWidget = () => {
		let allWidgets = document.querySelectorAll('.react-grid-item');
		for (let i = 0; i < allWidgets.length; i++) {
			allWidgets[i].style.backgroundColor = '#d4d4d4';
		}
		setCheckedWidgetIds([]);
		let allWidgetsArr = [];
		initialChartData.getUserDashboardWidgetInfo.map((widget) => {
			allWidgetsArr.push(widget.widget_id);
		});
		setCheckedWidgetIds(allWidgetsArr);
		setAllSelected(true);
	};

	const handleSelectNoneWidget = () => {
		let allWidgets = document.querySelectorAll('.react-grid-item');
		for (let i = 0; i < allWidgets.length; i++) {
			allWidgets[i].style.backgroundColor = '#fff';
		}
		setCheckedWidgetIds([]);
		setAllSelected(false);
	};

	const handleDeleteMultipleWidgets = () => {
		if (checkedWidgetIds.length === 1) {
			setdeleteMultiwidgets(false);
			setmodaldata(modalDelete.DELETE_MODAL);
			setshowModalDelete(true);
		} else {
			setdeleteMultiwidgets(true);
			setmodaldata(modalDelete.DELETE_MODAL);
			setshowModalDelete(true);
		}
	};

	const selectWidgetFun = (e) => {
		setsetSelectPopoverWidget(true);
		setSelectBarTarget(e.target);
	};

	// create widget --------------------------------
	const createWidget = (widget_name, widget_title) => {
		setshowCreatewidgetModal(true);
		setwidgetName(widget_title);
		setWidgettittle(widget_name);
		getDeviceDataset();
	};
	const tittleFocus = (event) => {
		event.target.select();
	};

	const CreateWidget = async (e) => {
		setdisabled(true);
		e.dashboard_id =
			dashboardList.getUserDashboardNames[active_tab].dashboard_id;
		e.widget_name = Widgettittle;
		e.device_id = selected_device.value;

		if (e.widget_name === 'SensorPower') {
			e.component_id = sensorSelected.value;
		} else if (e.widget_name === 'MultiLineChart') {
			let rulesSelected = compAndRules.filter((li) => {
				return li.component_id !== undefined;
			});
			e.multi_comp_chart_input = rulesSelected;
		} else {
			e.component_id = selecteddataset.value;
			e.rule_id = rules.value;
		}
		//	console.log(JSON.stringify(e));
		try {
			await Savedashboarduser({ variables: { input: e } }); // this is global fumction to create the chart
		} catch (err) {
			setshowCreatewidgetModal(false);
		}
	};

	const duplicateWidget = async (e) => {
		let duplicateCount = widgetActionData?.duplicate_count;
		let dupWidgetTitle = `${widgetActionData.widget_title}_duplicate${
			duplicateCount + 1
		}`;
		let selectedWidget = document.getElementById(
			'exportContainer' + widgetActionData.widget_id
		);
		widIndex = selectedWidget.getAttribute('index');
		widId = widgetActionData.widget_id;
		if (checkedWidgetIds.length > 0) {
			let allWid = document.getElementsByClassName('react-grid-item');
			for (let i = 0; i < allWid.length; i++) {
				allWid[i].style.backgroundColor = '#fff';
			}
			setCheckedWidgetIds([]);
		}
		try {
			await DuplicateWidgetFun({
				variables: {
					widgetId: widgetActionData.widget_id,
					widget_titl: dupWidgetTitle,
				},
			});
		} catch (err) {
			// setshowCreatewidgetModal(false);
		}
	};
	const closeCreateWidgetModal = () => {
		setshowCreatewidgetModal(false);
		setSelectedRulesToShow([]);
		setCompAndRules([]);
	};

	// ----------------------------------------------- widget actions -------------------

	const CreateDashoard = async (e) => {
		setcircleloading(true);
		setdisabled(true);
		setdashboardNameEdit(e.dashboard_name);
		if (createDash === 'create') {
			try {
				await createDashboardNameGql({
					variables: { dashboard_name: e.dashboard_name },
				});
			} catch (error) {
				setcircleloading(false);
				setdisabled(false);
				setdashboard_modal(false);
			}
		}
		// } else {
		// 	let dId = dashboardList.getUserDashboardNames[active_tab].dashboard_id;
		// 	try {
		// 		await editDashboardGqlFun({
		// 			variables: {
		// 				dashboard_id: dId,
		// 				new_name: e.dashboard_name,
		// 			},
		// 		});
		// 	} catch (error) {
		// 		setcircleloading(false);
		// 		setdisabled(false);
		// 	}
		// }
	};
	const Delete_widget = async () => {
		setmodaldata(modalDelete.DELETE_MODAL);
		setWIdgetDeletedata(widgetActionData);
		setshowModalDelete(true);
	};

	//Edit widget ------------------
	const EditWidget = () => {
		seteditmodaldata(widgetActionData);

		if (widgetActionData.widget_name === 'MultiLineChart') {
			setshowEditMultiModal(true);
		} else {
			setshowEditDetailsModal(true);
		}
	};
	const closeEditModal = () => {
		setshowEditDetailsModal(false);
	};

	const EditWidgetFunc = async (e) => {
		e.dashboard_id =
			dashboardList.getUserDashboardNames[active_tab]?.dashboard_id;
		e.device_id = parseInt(e.device_id);
		e.rule_id = parseInt(e.rule_id);
		e.widget_id = parseInt(e.widget_id);
		e.component_id = parseInt(e.component_id);
		e.multi_comp_chart_input = [];
		e.data_time_interval = widgetActionData.data_time_interval;
		try {
			await editWidget({ variables: { input: e } });
			setshowEditDetailsModal(false);
		} catch (err) {
			setshowEditDetailsModal(false);
		}
	};

	// check widgets ---------------------------------
	const handleWidgetCheck = (e, widgetData) => {
		e.persist();

		if (e.target.checked) {
			let dupWidgetIds = [];
			if (widgetData.duplicate_count > 0 && widgetData.original_widget) {
				initialChartData.getUserDashboardWidgetInfo.map((li) => {
					if (li.original_widget_id === widgetData.widget_id) {
						dupWidgetIds.push(li.widget_id);
					}
				});
			}
			dupWidgetIds.push(widgetData.widget_id);

			let allCheckedIds = [...checkedWidgetIds, ...dupWidgetIds];
			let distinctCheckedIds = [...new Set(allCheckedIds)];

			for (let i = 0; i < distinctCheckedIds.length; i++) {
				document.getElementById(
					'exportContainer' + distinctCheckedIds[i]
				).style.backgroundColor = '#d4d4d4';
			}

			setCheckedWidgetIds(distinctCheckedIds);
		}

		if (!e.target.checked) {
			let widgetElem = document.getElementById(
				'exportContainer' + widgetData.widget_id
			);
			if (
				!widgetData.original_widget &&
				checkedWidgetIds.includes(widgetData.original_widget_id)
			) {
				toast.warning(
					'Cannot uncheck the duplicate widget if the original widget is checked!!'
				);
			} else {
				let updatedWidgetIds = checkedWidgetIds.filter((widget_id) => {
					return widget_id !== widgetData.widget_id;
				});

				widgetElem.style.backgroundColor = '#f4f4f4';
				setCheckedWidgetIds(updatedWidgetIds);
			}
		}

		setIsWidgetsChecked({
			...isWidgetsChecked,
			dashboard_id:
				dashboardList.getUserDashboardNames[active_tab]?.dashboard_id,
			widget_ids: checkedWidgetIds,
		});
	};

	const AllOnclick_event = async (buttonAction, ind, widgetActionData) => {
		setindexDelete(ind);

		setcircleloading(true);
		setdisabled(true);
		let dId = dashboardList.getUserDashboardNames[active_tab].dashboard_id;
		if (buttonAction === 'Delete_dashboard') {
			setShowTopbar(false);
			try {
				await DeleteDashboard({
					variables: { dashboard_id: parseInt(dId) },
				});
				setShowTopbar(true);
			} catch (err) {
				setcircleloading(false);
				setdisabled(false);
				setshowModalDelete(false);
			}
		}

		if (buttonAction === 'Delete_widget') {
			let w_d = deleteMultiwidgets
				? checkedWidgetIds
				: WIdgetDeletedata === null
				? checkedWidgetIds
				: [WIdgetDeletedata.widget_id];
			let e = {
				dashboard_id:
					dashboardList.getUserDashboardNames[active_tab].dashboard_id,
				widget_ids: w_d,
			};
			try {
				await DeleteWidget({ variables: { input: e } });
				setWIdgetDeletedata(null);
			} catch (err) {
				setcircleloading(false);
				setdisabled(false);
				setshowModalDelete(false);
			}
		} else if ((buttonAction = 'Cancel')) {
			setshowModalDelete(false);
			setcircleloading(false);
			setdisabled(false);
			setdeleteMultiwidgets(false);
		}
	};

	const onchangeDeviceFun = (e) => {
		setselected_device(e);
		let arrDataset = [];
		let arrrules = [];
		deviceData?.get_device_dataset_name.map((li) => {
			if (li.device_name === e.label) {
				if (li?.device_dataset?.length > 0) {
					setselecteddataset({
						value: li.device_dataset[0].component_id,
						label: li.device_dataset[0].dataset_name,
					});

					li.device_dataset.map((l) => {
						let d = {
							value: l.component_id,
							label: l.dataset_name,
						};

						arrDataset.push(d);
					});
					setallDataSets(arrDataset);
					setsensorData(arrDataset);
				} else {
					setselecteddataset('');
					setallDataSets();
					setsensorData();
				}

				if (li.dev_component_names.length > 0) {
					setsensorSelected({
						value: li.dev_component_names[0].component_id,
						label: li.dev_component_names[0].component_name,
					});

					let sensorArr = [];
					li.dev_component_names.map((s) => {
						let d = {
							value: s.component_id,
							label: s.component_name,
						};
						sensorArr.push(d);
					});
					setsensorData(sensorArr);
				} else {
					setsensorSelected('');
					setsensorData();
				}

				if (li.device_dataset[0]?.rules.length > 0) {
					setrules({
						value: li.device_dataset[0].rules[0].rule_id,
						label: li.device_dataset[0].rules[0].rule_name,
					});
					li.device_dataset[0].rules.map((li) => {
						let d = {
							value: li.rule_id,
							label: li.rule_name,
						};
						arrrules.push(d);
					});

					setallRules(arrrules);
				} else {
					setrules('');
					setallRules();
				}
			}
		});
	};

	const onchangeDatasetFun = (d) => {
		if (d) {
			setselecteddataset(d);
			let rulesArr = [];
			deviceData.get_device_dataset_name.map((li) => {
				if (li.device_name === selected_device.label) {
					li.device_dataset.map((l) => {
						if (l.component_id === d.value) {
							if (l.rules.length > 0) {
								setrules({
									value: l.rules[0].rule_id,
									label: l.rules[0].rule_name,
								});

								l.rules.map((r) => {
									let d = {
										value: r.rule_id,
										label: r.rule_name,
									};
									rulesArr.push(d);
								});
								setallRules(rulesArr);
							} else {
								setrules('');
								setallRules();
							}
						}
					});
				}
			});
		}
	};

	const onchangeRules = (d) => {
		if (d) {
			setrules(d);
		}
	};
	const onChangeSenorData = (d) => {
		setsensorSelected(d);
	};
	// Multi line edit part

	if (loadingdashboard) {
		return <Loaders />;
	}

	return (
		<div>
			<ModalDash
				show={dashboard_modal}
				handleClose={handleClose}
				CreateDashoard={CreateDashoard}
				editDashboard={editDashboard}
				createDash={createDash}
				circleloading={circleloading}
				disabled={disabled}
			/>

			<DeleteModal
				Delete_data={modaldata}
				deleteMultiwidgets={deleteMultiwidgets}
				show={showModalDelete}
				handleClose={handleCloseDeleteModal}
				AllOnclick_event={AllOnclick_event}
				indexIdDelete={indexIdDelete}
				disabled={disabled}
				circleloading={circleloading}
			/>

			{dashboardList.getUserDashboardNames.length > 0 && (
				<>
					<TopBar
						name="Dashboard"
						searchbox={false}
						registerDevice={false}
						sidebarToggle={sidebarToggle}
					/>

					{showTopbar && (
						<DashboardTopBar
							dashboardList={dashboardList}
							initialChartData={initialChartData}
							layoutRightBAr={layoutRightBAr}
							createWidget={createWidget}
							active_tab={active_tab}
							seteditDashboard={seteditDashboard}
							setcreateDash={setcreateDash}
							setShowDashboardListPopver={setShowDashboardListPopver}
							setDashboardTarget={setDashboardTarget}
							setShowCurrentDashPopover={setShowCurrentDashPopover}
							setCurrentDashTarget={setCurrentDashTarget}
							showDashboardListPopover={showDashboardListPopover}
							dashboardTarget={dashboardTarget}
							showCurrentDashPopover={showCurrentDashPopover}
							currentDashTarget={currentDashTarget}
							setdashboard_modal={setdashboard_modal}
							setmodaldata={setmodaldata}
							setshowModalDelete={setshowModalDelete}
							CreateDashoard_modal={CreateDashoard_modal}
							setactiveDashboard={setactiveDashboard}
							getInitialDataFun={getInitialDataFun}
							checkedWidgetIds={checkedWidgetIds}
							allSelected={allSelected}
							handleSelectAllWidget={handleSelectAllWidget}
							handleSelectNoneWidget={handleSelectNoneWidget}
							selectWidgetFun={selectWidgetFun}
							setSelectPopoverWidget={setSelectPopoverWidget}
							selectBarTarget={selectBarTarget}
							setsetSelectPopoverWidget={setsetSelectPopoverWidget}
							handleDeleteMultipleWidgets={handleDeleteMultipleWidgets}
						/>
					)}
				</>
			)}
			{imageDownloading && (
				<div className="image-loading-overlay">
					<Loaders use="imageDownload" />
				</div>
			)}

			{dashboardList.getUserDashboardNames.length <= 0 && (
				<Empty create_dashboard={CreateDashoard_modal} />
			)}
			{dashboardList.getUserDashboardNames.length > 0 && (
				<div className="row mt-lg-0 mt-5 no-gutters">
					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 widget_container">
						<Widgets
							loadingInitialChart={loadingInitialChart}
							initialChartData={
								initialChartData && initialChartData.getUserDashboardWidgetInfo
							}
							activeDashboard={activeDashboard}
							dashboardId={
								dashboardList.getUserDashboardNames[active_tab]?.dashboard_id
							}
							active_tab={parseInt(activeDashboard) || 0}
							editWidget={editWidget}
							loadingEdit={loadingEdit}
							indexIdDelet={indexIdDelete}
							circleloading={circleloading}
							widgetActionFun={widgetActionFun}
							setPopoverWidget={setPopoverWidget}
							setsetPopoverWidget={setsetPopoverWidget}
							target={target}
							viewDetailsData={viewDetailsData}
							modalViewDetails={modalViewDetails}
							ViewDetails={ViewDetails}
							closeDetailsModal={closeDetailsModal}
							showEditDetailsModal={showEditDetailsModal}
							editmodaldata={editmodaldata}
							closeEditModal={closeEditModal}
							showEditMultiModal={showEditMultiModal}
							EditWidgetFunc={EditWidgetFunc}
							EditWidget={EditWidget}
							Delete_widget={Delete_widget}
							updateComponents={updateComponents}
							showDataOninterval={showDataOninterval}
							dataSdataSensorPowerSubs={dataSdataSensorPowerSubs}
							errorSensorPowerSubs={errorSensorPowerSubs}
							ChartSubsData={ChartSubsData}
							chartSubsError={chartSubsError}
							Widgettittle={Widgettittle}
							DuplicateWidget={duplicateWidget}
							widgetActionData={widgetActionData}
							duplicateWidgetLoading={duplicateWidgetLoading}
							isWidgetsChecked={setIsWidgetsChecked}
							setIsWidgetsChecked={setIsWidgetsChecked}
							checkedWidgetIds={checkedWidgetIds}
							setCheckedWidgetIds={setCheckedWidgetIds}
							handleWidgetCheck={handleWidgetCheck}
							setImageDownloading={setImageDownloading}
							setshowEditMultiModal={setshowEditMultiModal}
						/>
					</div>
				</div>
			)}

			<Modal
				show={showCreatewidgetModal}
				dialogClassName="save_chart_modal_class"
				onHide={closeCreateWidgetModal}
				backdrop="static"
				keyboard={true}>
				<div className="d-flex">
					<span className="modal_header ">{`${widgetName} widget`}</span>
					<i
						className="ri-close-line ri-lg ml-auto fs-4"
						onClick={closeCreateWidgetModal}></i>
				</div>
				<form onSubmit={handleSubmit(CreateWidget)}>
					<div className="row">
						<div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
							<label className="label" htmlFor="widget_title">
								Title
							</label>
							<input
								type="text"
								name="widget_title"
								id="widget_title"
								className={
									errors.widget_title
										? 'form-control error_input'
										: 'form-control'
								}
								placeholder="Title"
								ref={register({
									required: 'Title is required',
									maxLength: 28,
								})}
								onFocus={tittleFocus}
							/>

							{errors.widget_title && (
								<div>
									<span className="text-error">
										{errors.widget_title.message}
									</span>
								</div>
							)}
							{errors.widget_title && errors.widget_title.type === 'maxLength' && (
								<div>
									<span className="text-error">
										Max length of title exceeded{' '}
										<span className="text-info">(28)</span>
									</span>
								</div>
							)}
						</div>
						<div className="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
							<label className="label" htmlFor="group_name">
								Select device
							</label>
							<Select
								value={selected_device}
								onChange={(e) => onchangeDeviceFun(e)}
								options={allDevices}
								placeholder={'Select device'}
								isDisabled={loadingDevice}
								styles={styles}
							/>
							{loadingDevice && (
								<span className="spinner-border float-right loaderOnInput"></span>
							)}
							{errors.device_id && (
								<div className="text-error">{errors.device_id.message}</div>
							)}
						</div>

						{widgetName !== 'Sensor power' && (
							// widgetName !== 'Multi axis Line chart' && (
							<>
								{/* <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
										<label className="label" htmlFor="group_name">
											Select Dataset
										</label>

										<div className="form-group">
											<Select
												value={selecteddataset}
												onChange={(e) => onchangeDatasetFun(e)}
												options={allDataSets}
												placeholder={'Select dataset'}
												isDisabled={loadingDevice}
												styles={styles}
											/>
											{loadingDevice && (
												<span className="spinner-border float-right loaderOnInput"></span>
											)}
											{errors.device_dataset && (
												<div className="text-error">
													{errors.device_dataset.message}
												</div>
											)}
										</div>
									</div> */}
								<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
									<label className="label" htmlFor="group_name">
										Select capability
									</label>

									<div className="form-group">
										<Select
											value={rules}
											onChange={(e) => onchangeRules(e)}
											options={allRules}
											placeholder={'Select capability'}
											isDisabled={loadingDevice}
											styles={styles}
										/>
										{loadingDevice && (
											<span className="spinner-border float-right loaderOnInput"></span>
										)}
										{errors.device_dataset && (
											<div className="text-error">
												{errors.device_dataset.message}
											</div>
										)}
									</div>
								</div>
							</>
						)}

						{/* {widgetName === 'Multi axis Line chart' && (
							<>
								<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
									<label className="label" htmlFor="group_name">
										Select Dataset-Rule
									</label>

									<div className="form-group">
										<MultiLineChart
											selectedRulesToshow={selectedRulesToshow}
											setSelectedRulesToShow={setSelectedRulesToShow}
											noRulesSelected={noRulesSelected}
											setNoRulesSelected={setNoRulesSelected}
											compAndRules={compAndRules}
											setCompAndRules={setCompAndRules}
											selected_device={selected_device}
											datasetData={deviceData?.get_device_dataset_name}
											loadingDevice={loadingDevice}
										/>
										{loadingDevice && (
											<span className="spinner-border float-right loaderOnInput"></span>
										)}
										{errors.device_dataset && (
											<div className="text-error">
												{errors.device_dataset.message}
											</div>
										)}
									</div>
								</div>
							</>
						)} */}

						{widgetName === 'Sensor power' && (
							<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
								<div>
									<div className="">Select Device Component</div>
									<Select
										value={sensorSelected}
										onChange={(e) => onChangeSenorData(e)}
										options={sensorData}
										isDisabled={loadingDevice}
										styles={styles}
									/>
									{loadingDevice && (
										<span className="spinner-border float-right loaderOnInput"></span>
									)}
								</div>
							</div>
						)}
					</div>
					<div className="mt-3" align="right">
						<button
							className="btn btn-secondary mr-2"
							type="button"
							onClick={closeCreateWidgetModal}>
							Cancel
						</button>

						{widgetName === 'Sensor power' && (
							<button
								className="btn btn-primary"
								disabled={
									sensorSelected === '' ||
									sensorSelected === undefined ||
									sensorSelected === null ||
									selected_device === null ||
									selected_device === undefined ||
									selected_device === ''
										? true
										: updateWidgetLoading
								}>
								Done
								{updateWidgetLoading === true && (
									<span className="spinner-border float-right mt-3"></span>
								)}
							</button>
						)}

						{widgetName !== 'Sensor power' && (
							<button
								className="btn btn-primary"
								disabled={
									widgetName !== 'Multi axis Line chart'
										? rules === null ||
										  rules === undefined ||
										  rules === '' ||
										  selected_device === undefined ||
										  selected_device === null ||
										  selected_device === '' ||
										  selecteddataset === undefined ||
										  selecteddataset === null ||
										  selecteddataset === ''
											? true
											: updateWidgetLoading
										: selected_device === undefined ||
										  selected_device === null ||
										  selected_device === '' ||
										  noRulesSelected ||
										  updateWidgetLoading
								}>
								Done
								{updateWidgetLoading === true && (
									<span className="spinner-border float-right mt-3"></span>
								)}
							</button>
						)}
					</div>
				</form>
			</Modal>
		</div>
	);
}

export default DashboardBar;
