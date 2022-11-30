import React from "react";

function DisplayUserToken(props) {
	let token = localStorage.getItem("btoken");

	return (
		<div className="row box_style px-2">
			<p className="fs-profile">{token}</p>
			<button
				className="copyButton mb-5 mr-4 ml-auto"
				onClick={props.copyToken}
			>
				Copy
			</button>
		</div>
	);
}

export default DisplayUserToken;
