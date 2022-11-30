import React, { useContext } from 'react';
import TemplateTable from '../../Components/Templates/TemplateTable.js';
import TopBar from '../../Components/Navigation/TopBar.js';
import SubTopBar from '../../Components/Dashboard/SubDashboardTopBar.js';
import AlldeviceTopBar from '../../Components/NewDevice/AlldeviceTopBar';

import { useQuery } from '@apollo/react-hooks';
import { GETTEMPLATES } from '../../Queries';

import Loaders from '../../Components/Loader/Loader';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

import NoTemplate from '../../Components/Utilites/NoDataPage';

function Templates() {
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	let context = useContext(GlobalContextMain);

	const { loading: tempLoading } = useQuery(GETTEMPLATES, {
		onCompleted: (data) => {
			context.createTemplateClick(data.getTemplate);
		},
		fetchPolicy: 'network-only',
	});

	return (
		<div>
			<TopBar
				name="Template"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<SubTopBar
				searchbox={
					context.templatetableData.length === 0 ||
					context.templatetableData?.data.length === 0
						? false
						: true
				}
				placeHolderForSearch="search template"
				btnname={[
					{
						button_name: 'New',
						pageRenderedOn: 'Template',
						classN: 'btn-primary pl-2',
						icon: 'ri-add-line ri-lg float-left mr-1 addline',
					},
				]}
			/>
			<AlldeviceTopBar mainHeading={'Templates'} information={[]} />
			{
				<div className="mr-3">
					{tempLoading ? (
						<Loaders margin_top={80} />
					) : context.templatetableData.length === 0 ||
					  context.templatetableData?.data.length === 0 ? (
						<NoTemplate Text="Create Template" buttonName="Create Template" />
					) : (
						<TemplateTable />
					)}
				</div>
			}
		</div>
	);
}

export default Templates;
