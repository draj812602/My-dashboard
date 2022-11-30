/** @format */
import React, { useReducer, createContext } from 'react';

const GlobalContextMain = createContext({
	emailData: null,
	loading: false,
	indSensorPower: null,
	loadingTimeiNtervel: false,
	widgetId: null,
	templatetableData: [],
	deviceTableData: [],
	globalSearchValue: null,
	currUrlNameDevice: null,
	connectionInfoData: {},
	templateList: null,
	currUrlNameTemplate: null,
	deviceDataById: {},
	templatePubluishStatus: null,
	modalOpenDeviceTemplate: false,
	DeviceRawData: null,
	SubscriptionToken: null,
	rightBarTOgglestate: false,

	activeMenuState: null,
	globalsearchOnchange: (val) => {},
	createTemplateClick: (tableData) => {},
	addDeviceClick: (dta) => {},
	MenuClickAI: (menu) => {},
	clickEvent: (boolData, indSensorPower, loadingTimeiNtervel) => {},
	widgetClickId: (widgetId) => {},
	currUrlSetDevice: (url) => {},
	connectionInfoDataFunc: (dta) => {},
	getTemplateListFunc: (dta) => {},
	currUrlSetTemplate: (url) => {},
	setDeviceDataById: (dta) => {},
	setTemplatePublishStatus: (dta) => {},
	stemodalOpenDeviceTemplate: (dta) => {},
	setDeviceRawData: (dta) => {},
	setSubscriptionToken: (dta) => {},
	setRightBarToggleState: (dta) => {},
});

const GlobalConextMainReducer = (state, action) => {
	//console.log(action.payload);
	switch (action.type) {
		case 'ONCLICK':
			return {
				...state,
				loading: action.payload,
			};
		case 'ONCLICKIND':
			return {
				...state,
				indSensorPower: action.payload,
			};
		case 'ONCLICKINTERVAL':
			return {
				...state,
				loadingTimeiNtervel: action.payload,
			};
		case 'WIDGETID':
			return {
				...state,
				widgetId: action.payload,
			};
		case 'MENUCLICK':
			return {
				...state,
				activeMenuState: action.payload,
			};
		case 'CREATETEMPLATE':
			return {
				...state,
				templatetableData: action.payload,
			};
		case 'ADDDEVICE':
			return {
				...state,
				deviceTableData: action.payload,
			};
		case 'GLOBALSEARCH':
			return {
				...state,
				globalSearchValue: action.payload,
			};
		case 'CURRURLFUNDEVICE':
			return {
				...state,
				currUrlNameDevice: action.payload,
			};

		case 'CONNECTIONINFOFUN':
			return {
				...state,
				connectionInfoData: action.payload,
			};
		case 'GETTEMPLATELIST':
			return {
				...state,
				templateList: action.payload,
			};
		case 'CURRENTURLFUNCTEMPLATE':
			return {
				...state,
				currUrlNameTemplate: action.payload,
			};
		case 'DEVICEDATABYID':
			return {
				...state,
				deviceDataById: action.payload,
			};
		case 'TEMPLATEPUBLISHSTATUS':
			return {
				...state,
				templatePubluishStatus: action.payload,
			};
		case 'OPENMODAL':
			return {
				...state,
				modalOpenDeviceTemplate: action.payload,
			};
		case 'SETDEVICERAWDATA':
			return {
				...state,
				DeviceRawData: action.payload,
			};
		case 'SETSUBSCRIPTIONTOKEN':
			return {
				...state,
				SubscriptionToken: action.payload,
			};
		case 'SETRIGHTBARTOGGLESTATE':
			return {
				...state,
				rightBarTOgglestate: action.payload,
			};

		default:
			return state;
	}
};

const GlobalContextMainProvider = (props) => {
	const [state, dispatch] = useReducer(GlobalConextMainReducer, {
		loading: false,
		indSensorPower: null,
		loadingTimeiNtervel: false,
		widgetId: null,
		globalSearchValue: '',
		templatetableData: [],
		deviceTableData: [],
		currUrlNameDevice: null,
		connectionInfoData: {},
		templateList: null,
		currUrlNameTemplate: null,
		deviceDataById: {},
		templatePubluishStatus: null,
		modalOpenDeviceTemplate: null,
		DeviceRawData: null,
		SubscriptionToken: null,
		activeMenuState: null,
		rightBarTOgglestate: false,
	});
	const clickEvent = (
		boolData,
		indSensorpower,
		loadingIntgerval,
		activeMenuState,
		templatetableData,
		globalSearchValue,
		deviceTableData,
		currUrlNameDevice,
		connectionInfoData,
		templateList,
		currUrlNameTemplate,
		deviceDataById,
		templatePubluishStatus,
		modalOpenDeviceTemplate,
		DeviceRawData,
		SubscriptionToken,
		rightBarTOgglestate
	) => {
		dispatch({
			type: 'ONCLICK',
			payload: boolData,
		});
		dispatch({
			type: 'ONCLICKIND',
			payload: indSensorpower,
		});
		dispatch({
			type: 'ONCLICKINTERVAL',
			payload: loadingIntgerval,
		});
		dispatch({
			type: 'MENUCLICK',
			payload: activeMenuState,
		});
		dispatch({
			type: 'CREATETEMPLATE',
			payload: templatetableData,
		});
		dispatch({
			type: 'ADDDEVICE',
			payload: deviceTableData,
		});
		dispatch({
			type: 'GLOBALSEARCH',
			payload: globalSearchValue,
		});
		dispatch({
			type: 'CURRURLFUNDEVICE',
			payload: currUrlNameDevice,
		});
		dispatch({
			type: 'CONNECTIONINFOFUN',
			payload: connectionInfoData,
		});
		dispatch({
			type: 'GETTEMPLATELIST',
			payload: templateList,
		});
		dispatch({
			type: 'CURRENTURLFUNCTEMPLATE',
			payload: currUrlNameTemplate,
		});

		dispatch({
			type: 'DEVICEDATABYID',
			payload: deviceDataById,
		});
		dispatch({
			type: 'TEMPLATEPUBLISHSTATUS',
			payload: templatePubluishStatus,
		});
		dispatch({
			type: 'OPENMODAL',
			payload: modalOpenDeviceTemplate,
		});
		dispatch({
			type: 'SETDEVICERAWDATA',
			payload: DeviceRawData,
		});
		dispatch({
			type: 'SETSUBSCRIPTIONTOKEN',
			payload: SubscriptionToken,
		});
		dispatch({
			type: 'SETRIGHTBARTOGGLESTATE',
			payload: rightBarTOgglestate,
		});
	};
	const widgetClickId = (wId) => {
		dispatch({
			type: 'WIDGETID',
			payload: wId,
		});
	};
	const MenuClickAI = (menu) => {
		dispatch({
			type: 'MENUCLICK',
			payload: menu,
		});
	};
	const createTemplateClick = (tableData) => {
		dispatch({
			type: 'CREATETEMPLATE',
			payload: tableData,
		});
	};
	const addDeviceClick = (dta) => {
		dispatch({
			type: 'ADDDEVICE',
			payload: dta,
		});
	};
	const globalsearchOnchange = (val) => {
		dispatch({
			type: 'GLOBALSEARCH',
			payload: val,
		});
	};
	const currUrlSetDevice = (val) => {
		dispatch({
			type: 'CURRURLFUNDEVICE',
			payload: val,
		});
	};
	const connectionInfoDataFunc = (val) => {
		dispatch({
			type: 'CONNECTIONINFOFUN',
			payload: val,
		});
	};

	const getTemplateListFunc = (val) => {
		dispatch({
			type: 'GETTEMPLATELIST',
			payload: val,
		});
	};
	const currUrlSetTemplate = (val) => {
		dispatch({
			type: 'CURRENTURLFUNCTEMPLATE',
			payload: val,
		});
	};
	const setDeviceDataById = (val) => {
		dispatch({
			type: 'DEVICEDATABYID',
			payload: val,
		});
	};
	const setTemplatePublishStatus = (val) => {
		dispatch({
			type: 'TEMPLATEPUBLISHSTATUS',
			payload: val,
		});
	};

	const stemodalOpenDeviceTemplate = (val) => {
		dispatch({
			type: 'OPENMODAL',
			payload: val,
		});
	};
	const setDeviceRawData = (val) => {
		dispatch({
			type: 'SETDEVICERAWDATA',
			payload: val,
		});
	};
	const setSubscriptionToken = (val) => {
		dispatch({
			type: 'SETSUBSCRIPTIONTOKEN',
			payload: val,
		});
	};
	const setRightBarToggleState = (val) => {
		dispatch({
			type: 'SETRIGHTBARTOGGLESTATE',
			payload: val,
		});
	};

	return (
		<GlobalContextMain.Provider
			value={{
				loading: state.loading,
				indSensorPower: state.indSensorPower,
				loadingTimeiNtervel: state.loadingTimeiNtervel,
				widgetId: state.widgetId,
				activeMenuState: state.activeMenuState,
				templatetableData: state.templatetableData,
				globalSearchValue: state.globalSearchValue,
				deviceTableData: state.deviceTableData,
				currUrlNameDevice: state.currUrlNameDevice,
				connectionInfoData: state.connectionInfoData,
				templateList: state.templateList,
				currUrlNameTemplate: state.currUrlNameTemplate,
				deviceDataById: state.deviceDataById,
				templatePubluishStatus: state.templatePubluishStatus,
				modalOpenDeviceTemplate: state.modalOpenDeviceTemplate,
				DeviceRawData: state.DeviceRawData,
				SubscriptionToken: state.SubscriptionToken,
				rightBarTOgglestate: state.rightBarTOgglestate,
				globalsearchOnchange,
				clickEvent,
				widgetClickId,
				MenuClickAI,
				createTemplateClick,
				addDeviceClick,
				currUrlSetDevice,
				connectionInfoDataFunc,
				getTemplateListFunc,
				currUrlSetTemplate,
				setDeviceDataById,
				setTemplatePublishStatus,
				stemodalOpenDeviceTemplate,
				setDeviceRawData,
				setSubscriptionToken,
				setRightBarToggleState,
			}}
			{...props}
		/>
	);
};

export { GlobalContextMain, GlobalContextMainProvider };
