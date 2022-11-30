/** @format */

import authentication from 'ad-b2c-react';
import decodeJWT from 'jwt-decode';

class Auth {
	isLoggedIn() {
		if (authentication.getAccessToken()) {
			localStorage.setItem('btoken', authentication.getAccessToken());
			return true;
		} else {
			return false;
		}
	}

	logout() {
		authentication.signOut();
	}

	getToken() {
		return authentication.getAccessToken();
	}

	currentUser() {
		let token = localStorage.getItem('btoken');
		//	console.log(token);

		if (token !== null && token) {
			const decoded = decodeJWT(token);
			return {
				name: decoded.name,
				firstName: decoded.given_name,
				lastName: decoded.family_name,
				familyName: decoded.family_name,
				giveName: decoded.given_name,
				emails: decoded.emails,
				city: decoded.city,
				country: decoded.country,
			};
		}
	}
}

export default Auth;
