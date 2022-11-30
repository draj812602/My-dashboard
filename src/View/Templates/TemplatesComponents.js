import React, { useEffect, useContext } from 'react';

import TopBar from '../../Components/Navigation/TopBar';
import MenuComponent from '../../Components/Utilites/ActiveInactiveMenu';
import SubTopBar from '../../Components/Dashboard/SubDashboardTopBar';
import AlldeviceTopBar from '../../Components/NewDevice/AlldeviceTopBar';

import Breadcrumbs from '../../Components/Utilites/Breadcrumbs';
import GoBackBreadcrumbs from '../../Components/Utilites/GoBackBreadcrumbs';
import { GlobalContextMain } from '../../Context/GlobalContextOne';
import Loaders from '../../Components/Loader/Loader';
import CapabilitiesForm from '../../Components/Templates/CapabilitiesForm';

import { useParams } from 'react-router-dom';

import { GETCAPABILITIES } from '../../Queries';

import { useQuery } from '@apollo/react-hooks';

const TemplatesComponents = () => {
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	let params = useParams();
	let compUrl = parseInt(
		params.component_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
	);
	let context = useContext(GlobalContextMain);

	const { loading: getCapabilitiesLoading, data: getCapData } = useQuery(
		GETCAPABILITIES,
		{
			variables: { component_id: compUrl },
			fetchPolicy: 'no-cache',
		}
	);

	return (
		<div>
			<TopBar
				name="Capabilities"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<div className="fix_menu">
				<SubTopBar
					searchbox={true}
					placeHolderForSearch="Search capability"
					btnname={[]}
				/>
				<div className="breadcrumbs">
					<GoBackBreadcrumbs />
					<Breadcrumbs />
				</div>
				<AlldeviceTopBar mainHeading={'Capabilities'} information={[]} />

				<div>
					<MenuComponent
						menus={[
							{
								menuName: 'Components',
							},
						]}
					/>
				</div>

				{getCapabilitiesLoading ? (
					<Loaders margin_main={-120} margin_top={50} />
				) : (
					<CapabilitiesForm
						getCapabilitiesLoading={getCapabilitiesLoading}
						getCapData={getCapData}
					/>
				)}
			</div>
		</div>
	);
};

export default TemplatesComponents;
