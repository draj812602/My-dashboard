/** @format */

import React from 'react';
import img_not_found from '../../Images/notfound.png';

import '../../Styles/Error.css';

function Pagenotfound() {
	return (
		<div align="center" className="error_container">
			<div className="woops">Whoops!</div>
			<div className="error_content">PAGE NOT FOUND</div>
			<img
				src={img_not_found}
				alt="Page not found"
				className="notFoundImg"></img>
		</div>
	);
}

export default Pagenotfound;
