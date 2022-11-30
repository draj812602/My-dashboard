/** @format */

import React from "react";

import "../../Styles/dashboard.css";

function Empty(props) {
	return (
		<div>
			<div align="center" className="empty_content_header">
				<div className="fs-3 text-primary mb-4 empty_content">
					<p>
						You currently don’t have any dashboard. All working dashboard will
						be here. Create upto 5 different dashboards
					</p>
				</div>
				<div className="btn_create">
					<button
						className="btn btn-primary"
						onClick={() => props.create_dashboard("create")}
					>
						Create Dashboard
					</button>
				</div>
			</div>
		</div>
	);
}

export default Empty;
