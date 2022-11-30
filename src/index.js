/** @format */

import React from 'react';
import ReactDOM from 'react-dom';

import ApolloProvider from './ApolloProvider';

import App from './App';

import { ToastContainer } from 'react-toastify';

import authentication from 'ad-b2c-react';


////////////////////////////////// old authentication code /////////////////////////////////
// authentication.initialize({
// 	instance: 'https://wiznetwink.b2clogin.com/',
// 	tenant: 'wiznetwink.onmicrosoft.com',
// 	signInPolicy: 'B2C_1_react_signup',
// 	applicationId: 'ac371074-8c89-4ba4-aa3b-66558b402235',
// 	resetPolicy: 'B2C_1_passwordReset', //if pass edit enable
// 	scopes: ['https://wiznetwink.onmicrosoft.com/api/api.access'],
// 	//	postLogoutRedirectUri: 'https://dashboard.wizcloud.io',
// 	postLogoutRedirectUri: 'https://winciotdashboarddev.azurewebsites.net/',
// 	// postLogoutRedirectUri: 'http://localhost:3000/',
// 	validateAuthority: false,
// 	silentLoginOnly: false,
// });
authentication.initialize({

	instance: 'https://wiznetiotb2c.b2clogin.com/',
	tenant: 'wiznetiotb2c.onmicrosoft.com',
	signInPolicy: 'B2C_1_wiznetIoT_signup_signin',
	applicationId: '493e4e9b-ec0a-4dde-a717-8ed25c4b6a7d',
	editPolicy: 'B2C_1_wiznetioT-profileediting',
	scopes: ['https://wiznetiotb2c.onmicrosoft.com/api/api.access'],
	//redirectUri:'http://localhost:3000/logout',
	postLogoutRedirectUri: 'https://winciotdashboarddev.azurewebsites.net',
	//postLogoutRedirectUri: 'http://localhost:3000',    // localhost
	validateAuthority: false,
	silentLoginOnly: false,

});

authentication.run(() => {
	ReactDOM.render(
		<ApolloProvider>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnVisibilityChange
				draggable
				pauseOnHover
			/>
			<App />
		</ApolloProvider>,
		document.getElementById('root')
	);
});
