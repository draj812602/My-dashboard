import React from 'react';
import TopBar from '../../../Components/Navigation/TopBar';

function Overview() {
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	return (
		<div>
			<TopBar
				name="API"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
		</div>
	);
}

export default Overview;
