import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../../Components/Navigation/TopBar';
import DashboardNameBar from '../../Components/Dashboard/DashboardNew/DashboardNameBar';
import Widgets from '../../Components/Dashboard/DashboardNew/WidgetsCopm';
import NoTemplate from '../../Components/Utilites/NoDataPage';
import CreateWidgetModal from '../../Components/Modals/CreateWidgetModal';
import Loaders from '../../Components/Loader/Loader';
import _ from 'lodash';
import { Responsive, WidthProvider } from 'react-grid-layout';
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";
//gql
import {
	useLazyQuery,
	useMutation,
	useSubscription,
} from '@apollo/react-hooks';
import { CREATEWIDGET, DELETEWIDGET } from '../../Mutations';
import { GET_WIDGET_DATA, GETDEVICE_CAPABILITIES } from '../../Queries';
import { WIDGETSSUBSCRIPTION } from '../../Subscriptions';
import decodeJWT from 'jwt-decode';
import DeleteModal from '../../Components/Modals/GlobalDeleteModal';
import { useDashboardActiveState } from '../../Context/DashboardContext';
import { useWidgetDispatch, useWidgetState } from '../../Context/WidgetContext';
import { GlobalContextMain } from '../../Context/GlobalContextOne';
import GlobalSearchComp from '../../Components/GlobalSearch';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
function DashboardList() {
	let token = localStorage.getItem('btoken');
	let email_id = '';
	if (token) {
		const decoded = decodeJWT(token);
		email_id = decoded.emails[0];
	}
	let test = [];
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	const dispatch = useWidgetDispatch();
	let { activeDashboard, activeDashboardIndex } = useDashboardActiveState();
	let { ChartTittle, widgetData } = useWidgetState();
	const [widgetIdOnDelete, setwidgetIdOnDelete] = useState(null);
	// grid layout ----------------------
	const [layouts, setlayouts] = useState({});
	const [DOM, setDOM] = useState(null);
	//edit modal
	const [showEditMdoal, setshowEditMdoal] = useState(false);
	// Widget create Modal states
	const [ShowCreateWidgetModal, setShowCreateWidgetModal] = useState(false);
	const [showDeleteModal, setshowDeleteModal] = useState(false);
	const [
		getDeviceAndCapabilities,
		{ data: deviceAndCapabilities, loading: loadingDeviceAndCapabilities },
	] = useLazyQuery(GETDEVICE_CAPABILITIES, {
		fetchPolicy: 'network-only',
	});
	let context = useContext(GlobalContextMain);
	console.log('active dashboard initially: ', activeDashboard);
	console.log('active dashboard Index : ', activeDashboardIndex);
	const [DeleteWidgetGql, { loading: deleteWidgitLoading }] = useMutation(
		DELETEWIDGET,
		{
			update(proxy, result) {
				let res = result.data.deleteWidget;
				let data = proxy.readQuery({
					query: GET_WIDGET_DATA,
					variables: { dashboard_id: activeDashboard.dashboard_id },
				});
				data.getWidget.widgets = data.getWidget.widgets.filter(
					(d) => d.widget_id !== res
				);
				proxy.writeQuery({
					query: GET_WIDGET_DATA,
					variables: { dashboard_id: activeDashboard.dashboard_id },
					data,
				});
				dispatch({
					type: 'WIDGET_DATA_ONLOAD',
					payload: data.getWidget.widgets,
				});
				setshowDeleteModal(false);
			},
		}
	);
	const [createWidgetGql, { loading: CreateWidgetLoading }] = useMutation(
		CREATEWIDGET,
		{
			update(proxy, result) {
				let res = result.data.createWidget.widgets;
				widgetData.push(res[0]);
				dispatch({ type: 'WIDGET_DATA_ONLOAD', payload: widgetData });
				setShowCreateWidgetModal(false);
			},
		}
	);
	const [
		getwidgetDataGqlFunc,
		{ loading: loadingWidget, error: widgetError, data: wData },
	] = useLazyQuery(GET_WIDGET_DATA, {
		fetchPolicy: 'network-only',
	});
	useEffect(() => {
		if (widgetError) {
			dispatch({
				type: 'WIDGET_DATA_ONLOAD',
				payload: [],
			});
		}
	}, [dispatch, widgetError]);
	useEffect(() => {
		if (!loadingWidget && wData) {
			dispatch({
				type: 'WIDGET_DATA_ONLOAD',
				payload: wData.getWidget.widgets,
			});
		}
	}, [dispatch, loadingWidget, wData]);
	useEffect(() => {
		if (activeDashboard) {
			getwidgetDataGqlFunc({
				variables: { dashboard_id: activeDashboard.dashboard_id },
			});
		}
	}, [activeDashboard, getwidgetDataGqlFunc]);
	const {
		data: dataSdataSensorPowerSubs,
		error: errorSensorPowerSubs,
	} = useSubscription(WIDGETSSUBSCRIPTION, {
		variables: { topic: { topic: 'UPDATE_LIVE_DATA/' + email_id } },
	});
	useEffect(() => {
		if (!errorSensorPowerSubs && dataSdataSensorPowerSubs) {
			widgetData.map((li) => {
				console.log(dataSdataSensorPowerSubs.UpdateLiveDataOnWidget);
				if (
					li.component_cap_id ===
					dataSdataSensorPowerSubs.UpdateLiveDataOnWidget.component_cap_id
				) {
					li.telemetry.push(
						dataSdataSensorPowerSubs.UpdateLiveDataOnWidget.telemetry[0]
					);
					dispatch({ type: 'WIDGET_DATA_ONLOAD', payload: widgetData });
				}
			});
		}
	}, [dataSdataSensorPowerSubs, dispatch, errorSensorPowerSubs, widgetData]);
	const showWidgetList = (cName, name) => {
		dispatch({ type: 'STORE_CREATE_CHART_TITTLE', payload: { cName, name } });
		getDeviceAndCapabilities();
		setShowCreateWidgetModal(true);
	};
	const CreateWidget = async (data) => {
		console.log(data);
		let device_id = Number(data.device_id);
		let component_id = Number(data.component_id);
		let component_cap_id = Number(data.component_cap_id);
		let d = {
			...data,
			device_id,
			component_id,
			component_cap_id,
			widget_name: ChartTittle.cName,
			dashboard_id: activeDashboard.dashboard_id,
		};
		console.log('what is : ', JSON.stringify(d));
		try {
			await createWidgetGql({ variables: { input: d } });
		} catch (error) {
			console.log(error);
		}
	};
	const ShowDeleteModalFunc = () => {
		setshowDeleteModal(false);
	};
	const DeleteButtonClickModal = async () => {
		try {
			await DeleteWidgetGql({
				variables: { widget_id: widgetIdOnDelete },
			});
		} catch (error) {
			setshowDeleteModal(false);
		}
	};
	const DeleteWidget = (data) => {
		setwidgetIdOnDelete(data.widget_id);
		setshowDeleteModal(true);
		localStorage.removeItem(DashID_Active);
	};
	let WidgetData_item = widgetData?.filter((item) => {
		return (
			item.widget_title
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			!context.globalSearchValue
		);
	});
	//  console.log("widget data : ", widgetData);
	const DashID_Active = activeDashboard?.dashboard_id;
	//console.log("LatestDashID is : ", DashID_Active);
	useEffect(() => {
		if (widgetData !== null && widgetData.length > 0) {
			console.log('wwwdata', widgetData);
			const generateDOM = (li, key) => {
				console.log('li has :', li);
				const layout = generateLayout();
				return _.map(layout, function (l) {
					return (
						<div
							key={l.i + '0'}
							data-grid={l}
							index={l.i}
							id={li[l.i].widget_id}
							className="pt-2 commonClassWidget">
							<Widgets data={li[l.i]} ind={l.i} DeleteWidget={DeleteWidget} />
						</div>
					);
				});
			};
			const generateLayout = () => {
				return (
					widgetData !== undefined &&
					widgetData !== null &&
					widgetData.map(function (item, i) {
						//console.log("item is", item);
						let h = 5;
						return {
							x: (i * 4) % 12,
							y: Math.floor(i / 6),
							h: 5,
							w: 4,
							minW: 4,
							maxW: 12,
							minH: 5,
							maxH: 5,
							i: i.toString(),
						};
					})
				);
			};
			setDOM(generateDOM(widgetData, 'layouts'));
		}
	}, [
		widgetData,
		activeDashboard,
		DashID_Active,
		CreateWidgetLoading,
		deleteWidgitLoading,
	]);
	useEffect(() => {
		if (widgetData && widgetData.length > 0 && widgetData !== null) {
			const originalLayouts = getFromLS('layouts', DashID_Active) || {};
			setlayouts(originalLayouts);
			console.log('active dashboard inside originalLayouts', DashID_Active);
			console.log('originalLayouts is : ', originalLayouts);
			// alert(" dashbaord :" + activeDashboardIndex +
			//  "  and originalLayouts is : " + JSON.stringify(originalLayouts, null, 2))
		}
	}, [widgetData, DashID_Active]);
	let compactType = 'vertical';
	const onLayoutChange = (layout, layouts) => {
		saveToLS('layouts', layouts, DashID_Active);
		setlayouts(layouts);
		console.log('activeDashboardIndex when layout changed :', DashID_Active);
		console.log('layouts when changed:', JSON.stringify(layouts, null, 2));
	};
	return (
		<div>
			<DeleteModal
				showDeleteModal={showDeleteModal}
				ShowDeleteModalFunc={ShowDeleteModalFunc}
				heading={'Do you want to delete this widget ?'}
				openIn={'Widget'}
				DeleteButtonClickModal={DeleteButtonClickModal}
				loading={deleteWidgitLoading}
			/>
			{
				<CreateWidgetModal
					setShowCreateWidgetModal={setShowCreateWidgetModal}
					ShowCreateWidgetModal={ShowCreateWidgetModal}
					CreateWidget={CreateWidget}
					CreateWidgetLoading={CreateWidgetLoading}
					deviceAndCapabilities={deviceAndCapabilities}
					loadingDeviceAndCapabilities={loadingDeviceAndCapabilities}
				/>
			}
			<TopBar
				name="Dashboard"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<DashboardNameBar showWidgetList={showWidgetList} />
			<br />
			{loadingWidget ? (
				<Loaders />
			) : (
				<div className="row">
					{activeDashboard && widgetData && widgetData.length > 0 ? (
						WidgetData_item?.length > 0 ? (
							// WidgetData_item.map((li, ind) => (
							//  <div className="col-md-12 col-lg-4 mb-4">
							//      {/* {console.log("widgets", WidgetData_item)} */}
							//      <div className="col-12 commonClassWidget">
							//          {/* <Widgets data={li} ind={ind} DeleteWidget={DeleteWidget} /> */}
							//      </div>
							//  </div>
							// ))
							<ResponsiveReactGridLayout
								className="layout col-12"
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
						) : (
							<GlobalSearchComp
								searchData={context.globalSearchValue}
								searchFor={'widgets'}
							/>
						)
					) : (
						<div></div>
					)}
				</div>
			)}
		</div>
	);
}

DashboardList.defaultProps = {
	isDraggable: true,
	isResizable: true,
	rowHeight: 30,
	onLayoutChange: function () {},
	cols: 12,
};

export default DashboardList;
function getFromLS(key, DashID_Active) {
	let ls = {};
	if (global.localStorage) {
		try {
			ls = JSON.parse(global.localStorage.getItem(DashID_Active)) || {};
		} catch (e) {
			/*Ignore*/
		}
	}
	return ls[key];
}
function saveToLS(key, value, DashID_Active) {
	if (global.localStorage) {
		global.localStorage.setItem(
			DashID_Active,
			JSON.stringify({
				[key]: value,
			})
		);
	}
}
