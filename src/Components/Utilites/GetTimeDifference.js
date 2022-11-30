import React, { useState, useEffect, useContext } from 'react';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

function GetTimedifference(PassedDate) {
	const [timeDifferene, settimeDifferene] = useState({
		timeLeft: undefined,
	});

	useEffect(() => {
		var expiry_time = PassedDate;
		// console.log("rxpirty_time",expiry_time)

		if (expiry_time) {
			var datearray = expiry_time.split('/');
			// console.log("datearray",datearray)

			var newdate = datearray[0] + '/' + datearray[1] + '/' + datearray[2];
			// console.log("newdate",newdate)

			let difference = +new Date(newdate) - +new Date();

			let timeLeft = {};

			if (difference > 0) {
				timeLeft = {
					year: Math.floor(difference / (1000 * 60 * 60 * 24 * 31 * 12)),
					months: Math.floor(difference / (1000 * 60 * 60 * 24 * 31)),
					weeks: Math.floor(difference / (1000 * 60 * 60 * 24 * 7)),
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				};
			}

			settimeDifferene(timeLeft);
		}
	}, []);
	return timeDifferene;
}
export default GetTimedifference;
