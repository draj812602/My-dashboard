import React from "react";
import TopBar from "../../../Components/Navigation/TopBar";

function Authentication() {
	let sidebarToggle = localStorage.getItem("sidebarTstate");
	return (
		<div>
			<TopBar
				name="API"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<h1>Authentication</h1>
		</div>
	);
}

export default Authentication;
