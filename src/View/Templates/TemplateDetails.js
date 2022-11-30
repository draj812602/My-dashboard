import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import TopBar from '../../Components/Navigation/TopBar';
import SubTopBar from '../../Components/Dashboard/SubDashboardTopBar';
import AlldeviceTopBar from '../../Components/NewDevice/AlldeviceTopBar';
import CapabilitiesForm from '../../Components/Templates/CapabilitiesForm';
import MenuComponent from '../../Components/Utilites/ActiveInactiveMenu';
import Breadcrumbs from '../../Components/Utilites/Breadcrumbs';
import GoBackBreadcrumbs from '../../Components/Utilites/GoBackBreadcrumbs';

import NoTemplate from '../../Components/Utilites/NoDataPage';

import Loaders from '../../Components/Loader/Loader';
import TemplateComponents from '../../Components/Templates/TemplateComponents';
import DeleteModal from '../../Components/Modals/GlobalDeleteModal';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_COMPONENTS_OF_TEMPLATES } from '../../Queries';
import { GETTEMPLATEPUBLISHSTATUS, GETCAPABILITIES } from '../../Queries';
import GlobalSearchComp from '../../Components/GlobalSearch';

import {
	ADD_COMPONENTS_TEMPLATE,
	DELETE_COMPONENT_TEMPLATE,
} from '../../Mutations';

import { useParams } from 'react-router-dom';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

function TemplateDetails() {
	let sidebarToggle = localStorage.getItem('sidebarTstate');
	let params = useParams();
	let history = useHistory();
	let tempUrl = parseInt(
		params.template_id?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
	);
	let tempName = params.template_id?.split(
		'780003a2-2b90-46d2-9af8-f58e9eb41e06'
	)[0];
	let context = useContext(GlobalContextMain);
	const [showDeleteModal, setshowDeleteModal] = useState(false);
	const [showAddComponentModal, setshowAddComponentModal] = useState(false);
	const [deleteComponentData, setdeleteComponentData] = useState(null);

	const { loading: getCOmponentsLoading, data: getComponentsData } = useQuery(
		GET_COMPONENTS_OF_TEMPLATES,
		{
			variables: { template_id: tempUrl },
		}
	);

	const {
		loading: loadinfTemplatePublish,
		data: templatePublishStatus,
	} = useQuery(GETTEMPLATEPUBLISHSTATUS, {
		variables: {
			template_id: parseInt(
				params.template_id.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
			),
		},
		fetchPolicy: 'network-only',
	});

	const [
		addComponentGql,
		{ loading: loadingAddComponentMutation },
	] = useMutation(ADD_COMPONENTS_TEMPLATE, {
		update(proxy, result) {
			let res = result.data.addComponent;

			let data = proxy.readQuery({
				query: GET_COMPONENTS_OF_TEMPLATES,
				variables: { template_id: tempUrl },
			});

			data.getComponents = [res, ...data.getComponents];
			proxy.writeQuery({
				query: GET_COMPONENTS_OF_TEMPLATES,
				variables: { template_id: tempUrl },
				data,
			});
			context.stemodalOpenDeviceTemplate(null);
			setshowAddComponentModal(false);
		},
	});
	const [
		deleteComponent,
		{ loading: loadingDeleteComponentMutation },
	] = useMutation(DELETE_COMPONENT_TEMPLATE, {
		update(proxy, result) {
			let res = result.data.addComponent;

			let data = proxy.readQuery({
				query: GET_COMPONENTS_OF_TEMPLATES,
				variables: { template_id: tempUrl },
			});

			data.getComponents = data.getComponents.filter(
				(d) => d.component_id !== deleteComponentData.component_id
			);
			proxy.writeQuery({
				query: GET_COMPONENTS_OF_TEMPLATES,
				variables: { template_id: tempUrl },
				data,
			});
			setdeleteComponentData(null);
			setshowDeleteModal(false);
		},
	});

	useEffect(() => {
		if (!loadinfTemplatePublish) {
			context.setTemplatePublishStatus(
				templatePublishStatus.getTemplatedPublishedStatus
			);
		}
	}, [loadinfTemplatePublish]);

	useEffect(() => {
		context.currUrlSetTemplate(params.template_id);
	}, [params.template_id]);

	const DeleteClickToOpenModal = (dta, ind) => {
		setdeleteComponentData(dta);
		setshowDeleteModal(true);
	};
	const ShowDeleteModalFunc = () => {
		setshowDeleteModal(false);
	};
	const DeleteButtonClickModal = async () => {
		try {
			await deleteComponent({
				variables: {
					template_id: deleteComponentData.template_id,
					component_id: deleteComponentData.component_id,
				},
			});
		} catch (error) {
			setshowDeleteModal(false);
		}
	};
	const createCapabilitiesClick = (dta) => {
		history.push(
			`/Templates/${tempName}780003a2-2b90-46d2-9af8-f58e9eb41e06${dta.template_id}/${dta.component_name}780003a2-2b90-46d2-9af8-f58e9eb41e06${dta.component_id}`
		);
	};

	let TemplateComponentData = getComponentsData?.getComponents?.filter(
		(item) => {
			return (
				item.component_name
					?.toLowerCase()
					.includes(context.globalSearchValue.toLowerCase()) ||
				!context.globalSearchValue
			);
		}
	);
	console.log(
		!loadinfTemplatePublish &&
			templatePublishStatus?.getTemplatedPublishedStatus,
		getComponentsData?.getComponents.length
	);

	return (
		<div>
			<DeleteModal
				showDeleteModal={showDeleteModal}
				ShowDeleteModalFunc={ShowDeleteModalFunc}
				heading={'Do you want to delete this Components ?'}
				openIn={'Template'}
				DeleteButtonClickModal={DeleteButtonClickModal}
				loading={loadingDeleteComponentMutation}
			/>

			<TopBar
				name="Components"
				searchbox={false}
				registerDevice={false}
				sidebarToggle={sidebarToggle}
			/>
			<div className="fix_menu">
				<SubTopBar
					searchbox={true}
					placeHolderForSearch="Search component"
					addComponentGql={addComponentGql}
					loadingAddComponentMutation={loadingAddComponentMutation}
					setshowAddComponentModal={setshowAddComponentModal}
					showAddComponentModal={showAddComponentModal}
					btnname={[
						{
							button_name: 'Add component',
							classN: 'btn-primary pl-2',
							pageRenderedOn: 'TemplateDetails',
							icon: 'ri-add-circle-line ri-lg float-left mr-1 addline',
						},
						getComponentsData?.getComponents.length > 0 &&
						!loadinfTemplatePublish &&
						!templatePublishStatus?.getTemplatedPublishedStatus
							? {
									button_name: 'Publish',
									classN: 'btn-primary pl-2',
									pageRenderedOn: 'TemplateDetails',
									icon: 'ri-upload-line ri-lg float-left mr-1 addline',
							  }
							: {
									button_name: 'Published',
									classN: 'btn-primary pl-2',
									pageRenderedOn: 'TemplateDetails',
									icon: 'ri-upload-line ri-lg float-left mr-1 addline',
							  },
					]}
				/>
				<div className="breadcrumbs">
					<GoBackBreadcrumbs />
					<Breadcrumbs />
				</div>
				<AlldeviceTopBar mainHeading={'Components'} information={[]} />

				<div>
					<MenuComponent
						menus={[
							{
								menuName: 'Components',
							},
						]}
					/>
				</div>
			</div>

			{getCOmponentsLoading ? (
				<Loaders margin_main={-120} margin_top={50} />
			) : (
				<div className="row no-gutters mt-3">
					{getComponentsData.getComponents.length <= 0 ? (
						<NoTemplate Text="Add component" buttonName="Add component" />
					) : TemplateComponentData?.length > 0 ? (
						TemplateComponentData.map((li, ind) => {
							return (
								<div
									className="col-md-5 col-lg-3 col-xl-3 Common-box-shadow-radius bg-white mr-lg-4 mr-md-2 mb-md-3 p-2"
									key={ind}>
									<TemplateComponents
										compList={li}
										ind={ind}
										DeleteComponent={DeleteClickToOpenModal}
										createCapabilitiesClick={createCapabilitiesClick}
									/>
								</div>
							);
						})
					) : (
						<GlobalSearchComp
							searchData={context.globalSearchValue}
							searchFor={'Components'}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default TemplateDetails;
