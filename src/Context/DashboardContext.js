// dashboard context

import React, { createContext, useReducer, useContext } from 'react';

const DashboardActiveStateContext = createContext();
const DashboardActiveDispatchContext = createContext();

const DashboardActiveReducer = (state, action) => {
	switch (action.type) {
		case 'SET_ACTIVE_DASHBOARD_DATA':
			return {
				...state,
				activeDashboard: action.payload,
			};
		case 'SET_ACTIVE_DASHBOARD_IND':
			localStorage.setItem('activeDashboardIndex', action.payload || 0);

			return {
				...state,
				activeDashboardIndex: action.payload,
			};
		case 'SET_PREVIOUS_ACTIVE_DASHBOARD':
			return {
				...state,
				previousActiveDashboard: action.payload,
			};
		case 'SET_DASHBOARD_LIST':
			return {
				...state,
				dashboardList: action.payload,
			};

		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
};

export const DashboardActiveProvider = ({ children }) => {
	const [state, dispatch] = useReducer(DashboardActiveReducer, {
		activeDashboard: null,
		activeDashboardIndex: null,
		previousActiveDashboard: null,
		dashboardList: [],
	});

	return (
		<DashboardActiveDispatchContext.Provider value={dispatch}>
			<DashboardActiveStateContext.Provider value={state}>
				{children}
			</DashboardActiveStateContext.Provider>
		</DashboardActiveDispatchContext.Provider>
	);
};

export const useDashboardActiveState = () =>
	useContext(DashboardActiveStateContext);
export const useDashboardActiveDispatch = () =>
	useContext(DashboardActiveDispatchContext);
