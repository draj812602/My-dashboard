import React, { useReducer, createContext, useEffect } from "react";

const initialstate = {
	emailData: null,
};

const GlobalCOntext = createContext({
	emailData: null,
	emailSubmitClick: (emailData) => { },
});
const AuthReducer = (state, action) => {

	switch (action.type) {
		case "EMAILCLICK":
			return {
				...state,
				emailData: action.payload,
			};

		default:
			return state;
	}
};

const GlobalProvider = (props) => {
	const [state, dispatch] = useReducer(AuthReducer, initialstate);
	const emailSubmitClick = (emailData) => {
		dispatch({
			type: "EMAILCLICK",
			payload: emailData,
		});
	};

	return (
		<GlobalCOntext.Provider
			value={{ emailData: state.emailData, emailSubmitClick }}
			{...props}
		/>
	);
};

export { GlobalCOntext, GlobalProvider };
