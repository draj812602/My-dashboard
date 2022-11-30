// dashboard context

import React, { createContext, useReducer, useContext } from 'react';

const WidgetStateContext = createContext();
const WidgetDispatchContext = createContext();

let widgetDatacpy = [];

const WidgetReducer = (state, action) => {
	switch (action.type) {
		case 'STORE_CREATE_CHART_TITTLE':
			return {
				...state,
				ChartTittle: action.payload,
			};
		case 'WIDGET_DATA_ONLOAD':
			let wData = action.payload;
			return {
				...state,
				widgetData: wData,
			};
		case 'DEVICE_AND_CAPABILITIES':
			return {
				...state,
				device_and_capabilities: action.payload,
			};

		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
};

export const WidgetProvider = ({ children }) => {
	const [state, dispatch] = useReducer(WidgetReducer, {
		ChartTittle: null,
		widgetData: null,
		device_and_capabilities: null,
	});

	return (
		<WidgetDispatchContext.Provider value={dispatch}>
			<WidgetStateContext.Provider value={state}>
				{children}
			</WidgetStateContext.Provider>
		</WidgetDispatchContext.Provider>
	);
};

export const useWidgetState = () => useContext(WidgetStateContext);
export const useWidgetDispatch = () => useContext(WidgetDispatchContext);
