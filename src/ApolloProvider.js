/** @format */

import React, { useContext } from 'react';

import { ApolloClient, ApolloLink, HttpLink, split } from 'apollo-boost';
import { ApolloProvider as Provider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { toast } from 'react-toastify';

import Jwt_Decode from 'jwt-decode';
import { onError } from 'apollo-link-error';
import authentication from 'ad-b2c-react';
import Substoken from './Components/Utilites/SubsToken';

let httpLink = new HttpLink({
	uri:
		//	'https://winciotserverdev.azurewebsites.net/graphql?code=BCAlOaxmSZP/pZYqkD5BDuAhQF7fbS2yvhYariRATMQ40aqhLkKW9w==',
		'https://wiznet-iot-backend-usersite-api.azurewebsites.net/graphql',

	//'https://winkbackenddashboardapi-dev.azurewebsites.net/graphql',

	//'https://dashboardbackendapitestapp.azurewebsites.net/graphql',
});
const authLink = setContext((_, { headers }) => {
	let token = authentication.getAccessToken();
	if (token) {
		console.log(token);
		const jwt_Token_decoded = Jwt_Decode(token);

		if (jwt_Token_decoded.exp * 1000 <= Date.now()) {
			localStorage.clear();
			authentication.signOut();
		} else {
			return {
				headers: {
					...headers,
					authorization: token ? `Bearer ${token}` : '',
				},
			};
		}
	}
});

const wsLink = new WebSocketLink({
	uri: 'wss://wiznet-iot-backend-usersite-api.azurewebsites.net/graphql',
	//dev
	//uri: `wss://winkbackenddashboardapi.azurewebsites.net/graphql`,
	options: {
		reconnect: true,
		timeout: 5000,

		connectionParams: {
			authToken: localStorage.getItem('SubsToken'),
		},
	},
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);

		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},

	wsLink,
	authLink.concat(httpLink)
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) => {
			toast.error(`${message}`, {
				position: 'top-right',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			console.log(message);
			console.log(locations);
			console.log(path);
		});
	if (networkError) {
		console.log(`[Network error]: ${networkError}`);
		toast.error(`${networkError}`, {
			position: 'top-right',
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		});
	}
});

const client = new ApolloClient({
	link: ApolloLink.from([errorLink, splitLink]),
	cache: new InMemoryCache(),
});

export default function ApolloProvider(props) {
	return <Provider client={client} {...props} />;
}
