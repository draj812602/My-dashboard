import React from 'react';
import { useHistory } from 'react-router-dom';

function GoBack() {
	let history = useHistory();
	return (
		<div>
			<span className="goBack_class" onClick={() => history.goBack()}>
				<i className="ri-arrow-left-line mr-2 goBack_icon"></i>
			</span>
		</div>
	);
}

export default GoBack;
