/* eslint-disable array-callback-return */
import React from 'react';

import BooleanComp from './BooleanComp';
import TextComp from './Text';

function SensorPowerComponent(props) {
	return (
		<div>
			{props.data.map((li) => {
				if (li.data_type === 'String') {
					return <TextComp data={li} />;
				}
				if (li.data_type === 'Boolean') {
					return <BooleanComp data={li} />;
				}
			})}
		</div>
	);
}

export default SensorPowerComponent;
