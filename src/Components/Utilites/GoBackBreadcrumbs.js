import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function GoBackBreadcrumbs() {
	let history = useHistory();

	return (
		<div>
			<span onClick={() => history.goBack()}>
				<i className="ri-arrow-left-line breadcrumbsbackarrow"></i>
			</span>
		</div>
	);
}

export default GoBackBreadcrumbs;
