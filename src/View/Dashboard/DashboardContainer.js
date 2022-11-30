import React, { useState, useEffect, useContext } from 'react';
import TopBar from '../../Components/Navigation/TopBar';
import DashboardNameBar from '../../Components/Dashboard/DashboardNew/DashboardNameBar';

import Widgets from '../../Components/Dashboard/DashboardNew/WidgetsCopm';

import NoTemplate from '../../Components/Utilites/NoDataPage';

import CreateWidgetModal from '../../Components/Modals/CreateWidgetModal';

import Loaders from '../../Components/Loader/Loader';

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
	const [DeleteWidgetGql, { loading: deleteWidgitLoading }] = useMutation(
		DELETEWIDGET,
		{
			update(proxy, result) {
				let data = proxy.readQuery({
					query: GET_WIDGET_DATA,
					variables: { dashboard_id: activeDashboard.dashboard_id },
				});
				let res = result.data.deleteWidget;
console.log("dta",data)

data.getWidget.widgets = data.getWidget.widgets.filter(
	(d) => d.widget_id !== res)

				
	
		

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
				// console.log("widgetdatw",widgetData)
				// console.log("adding live data",li)
				if (
					li.component_cap_id ===
					dataSdataSensorPowerSubs.UpdateLiveDataOnWidget.component_cap_id  && li.device_id ===
					dataSdataSensorPowerSubs.UpdateLiveDataOnWidget.device_id
				) {
					li.telemetry.push(
						dataSdataSensorPowerSubs.UpdateLiveDataOnWidget.telemetry[0]
					);
					dispatch({ type: 'WIDGET_DATA_ONLOAD', payload: widgetData });
				}
			});
		}
	}, [dataSdataSensorPowerSubs, dispatch, errorSensorPowerSubs]);

	const showWidgetList = (cName, name) => {
		dispatch({ type: 'STORE_CREATE_CHART_TITTLE', payload: { cName, name } });
		getDeviceAndCapabilities();
		setShowCreateWidgetModal(true);
	};
	const CreateWidget = async (data) => {
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
	};
	let WidgetData_item = widgetData?.filter((item) => {
		return (
			item.widget_title
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			!context.globalSearchValue
		);
	});
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
			<br />
			<br />
			<br />
			<br />
			<br />

			{loadingWidget ? (
				<Loaders />
			) : (
				<div className="row">
					{activeDashboard && widgetData && widgetData.length > 0 ? (
						WidgetData_item?.length > 0 ? (
							WidgetData_item.map((li, ind) => (
								<div className="col-md-12 col-lg-4 mb-4">
									<div className="col-12 commonClassWidget">
										<Widgets data={li} ind={ind} DeleteWidget={DeleteWidget} />
									</div>
								</div>
							))
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

export default DashboardList;
