import React, { useContext, useEffect, useState } from 'react';

//GQL QUERIES

import SHOWHISTORY from '../NewDevice/ShowHistory';
import Loaders from '../../Components/Loader/Loader';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

const RightSidebar = ({
	historyData,
	CloseRightBAr,
	loading,
	historyClickedUIData,
}) => {
	let context = useContext(GlobalContextMain);
	const [tittleName, settittleName] = useState(null);
	const [hData, sethData] = useState(null);
	useEffect(() => {
		if (!loading) {
			settittleName(historyClickedUIData);
			sethData(historyData);
		}
	}, [historyClickedUIData, historyData, loading]);

	return (
		<div
			className={`rightbar_overlay ${
				context.rightBarTOgglestate === true ? 'visible' : ''
			}`}>
			<div
				className={
					context.rightBarTOgglestate === true ? 'rightBar' : 'rightBar_shrink'
				}>
				<div className="d-flex">
					<div className="fs-4 font-weight-bold mb-3">
						{`History - ${tittleName?.widget_title}`}
					</div>
					<i
						className="ri-close-line ri-lg ml-auto mr-3"
						title="Close"
						onClick={CloseRightBAr}></i>
				</div>

				{loading ? (
					<Loaders margin_top={20} />
				) : historyData?.getCapabilityhistory?.history.length > 0 ? (
					<SHOWHISTORY historyData={hData} />
				) : (
					<div className="d-flex justify-content-center mt-5 pt-5 fs-3 text-black-50">
						No history found
					</div>
				)}
			</div>
		</div>
	);
};

export default RightSidebar;
