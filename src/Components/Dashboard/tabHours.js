import React from 'react';

function tabHours({
	tabHrsClick,
	wIdTabClick,
	TabHrsState,
	wData,
	ind,
	ld,
	timeInterval,
}) {
	return (
		<span
			className={
				timeInterval === ld
					? 'tabHrsActive  py-1 fs-7'
					: 'tabHrs  py-1 text-muted fs-7'
			}
			onClick={timeInterval === ld ? '' : () => tabHrsClick(ld, ind, wData)}>
			{ld}
		</span>
	);
}

export default tabHours;
