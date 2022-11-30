/** @format */

import React from 'react';
import imgC from '../../Images/underConstruction.png';

function commingSoon() {
	return (
		<div align="center" className="error_container">
			<div className="woops">Coming soon!</div>
			<div className="error_content">PAGE UNDER CONSTRUCTION</div>
			<img
				src={imgC}
				alt="THis page is under construction"
				className="notFoundImg"></img>
		</div>
	);
}

export default commingSoon;
