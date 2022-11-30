/** @format */

import React from "react";

import "../../Styles/dashboard.css";

function EmptyDashboard() {
	return (
		<div>
			<div align="center" className="empty_content_header">
				<div className="fs-3 text-primary mb-4 empty_content">
					<p>No data available.</p>
				</div>
			</div>
		</div>
	);
}

export default EmptyDashboard;
