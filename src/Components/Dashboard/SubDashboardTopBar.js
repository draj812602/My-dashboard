import React, { useState, useContext, useEffect } from 'react';
import { Popover, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';

// apollo react

import { useQuery, useMutation } from '@apollo/react-hooks';
import {
	PUBLISHTEMPLATE,
	BLOCKUNBLOCKDEVICE,
	ADD_COMPONENTS_TEMPLATE,
} from '../../Mutations';

import {
	GETTEMPLATEPUBLISHSTATUS,
	GETDEVICEDATABYID,
	GETTEMPLATESLIST,
	GET_COMPONENTS_OF_TEMPLATES,
} from '../../Queries';

import GenerateRendomText from '../Utilites/GenerateRendomText';

//onClick components
import AddDeviceModal from '../Modals/addDeviceModal';
import AddComponentModal from '../Modals/AddComponentModal';
import CreateTemplateModal from '../Modals/CreateNewTemplateModal';
import ShowConnInfo from '../Modals/ConnectionInfoDevice';
import TemplateListModal from '../Modals/SelectTemplate';
import CommonConfermationBox from '../Modals/CommonConfermationBox';

import SearchBar from '../Utilites/SerachBar';

//COntect
import { GlobalContextMain } from '../../Context/GlobalContextOne';

export default function SubTopBar(props) {
	const randText = GenerateRendomText();
	const context = useContext(GlobalContextMain);

	let urlTemp = parseInt(
		context.currUrlNameTemplate?.split(
			'780003a2-2b90-46d2-9af8-f58e9eb41e06'
		)[1]
	);
	let urlDevice = parseInt(
		context.currUrlNameDevice?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
	);

	const [triggerAddDeviceModal, settriggerAddDeviceModal] = useState(false);
	const [button_hover, setbutton_hover] = useState(null);
	const [PopoverDevice, setPopoverDevice] = useState(false);
	const [showtemplateListmodal, setshowtemplateListmodal] = useState(false);

	// Confermation box
	const [ShowConfermationBox, setShowConfermationBox] = useState(false);

	const [triggerCreateTemplateModal, settriggerCreateTemplateModal] = useState(
		false
	);
	const [target, setTarget] = useState(false);
	const [deviceDataFromContext, setdeviceDataFromContext] = useState();
	const [targetModalEvent, setTargettargetModalEvent] = useState(false);
	// connection info modal
	const [showCOnnectionInfoModal, setshowCOnnectionInfoModal] = useState(false);

	// queries mutations

	const [
		publishtemplateFunc,
		{ loading: loadingTemplatePublish, error: PublishError },
	] = useMutation(PUBLISHTEMPLATE, {
		update(proxy, result) {
			context.setTemplatePublishStatus(true);
			setShowConfermationBox(false);
		},

		refetchQueries: [
			{
				query: GETTEMPLATEPUBLISHSTATUS,
				variables: { template_id: urlTemp },
			},
			{ query: GETTEMPLATESLIST },
		],
		awaitRefetchQueries: true,
	});
	const [
		blockUnBlockDeviceFunc,
		{ loading: loadingBlockUnblock },
	] = useMutation(BLOCKUNBLOCKDEVICE, {
		update(proxy, { data: { blockOrUnblockDevice } }) {
			setTarget(false);

			let sta = blockOrUnblockDevice ? 'true' : 'false';
			let d = {
				__typename: 'DeviceInfo',
				device_block_status: sta,
				device_conn_status: false,
				device_identifier: 'tBBW2g2d9B',
				device_name: 'djeetaj',
				device_status: 'Registered',
				template_id: null,
				template_name: 'unassigned',
			};

			context.setDeviceDataById(d);
		},
		refetchQueries: [
			{
				query: GETDEVICEDATABYID,
				variables: { device_id: urlDevice },
			},
		],
		awaitRefetchQueries: true,
	});

	useEffect(() => {
		setdeviceDataFromContext(context.deviceDataById);
	}, [context.deviceDataById]);

	useEffect(() => {
		if (context.modalOpenDeviceTemplate === 'Add Device') {
			settriggerAddDeviceModal(true);
		} else if (context.modalOpenDeviceTemplate === 'Create Template') {
			settriggerCreateTemplateModal(true);
		} else if (context.modalOpenDeviceTemplate === 'Add component') {
			props.setshowAddComponentModal(true);
		}
	}, [context.modalOpenDeviceTemplate]);

	const btnClickEvent = async (e, li) => {
		setTargettargetModalEvent(true);
		if (li.button_name === 'New' && li.pageRenderedOn === 'Device') {
			settriggerAddDeviceModal(true);
		} else if (li.button_name === 'New' && li.pageRenderedOn === 'Template') {
			settriggerCreateTemplateModal(true);
		} else if (
			li.button_name === 'Connection Information' &&
			li.pageRenderedOn === 'DeviceDetails'
		) {
			setshowCOnnectionInfoModal(true);
		} else if (
			li.button_name === 'Assign template' &&
			li.pageRenderedOn === 'DeviceDetails'
		) {
			setshowtemplateListmodal(true);
		} else if (
			li.button_name === 'Add component' &&
			li.pageRenderedOn === 'TemplateDetails'
		) {
			props.setshowAddComponentModal(true);
		} else if (
			li.button_name === 'Publish' &&
			li.pageRenderedOn === 'TemplateDetails'
		) {
			setShowConfermationBox(true);
		}
	};

	const closeAddDeviceModal = () => {
		setTargettargetModalEvent(false);
		settriggerAddDeviceModal(false);
		context.stemodalOpenDeviceTemplate(null);
	};
	const closeTemplateModal = () => {
		setTargettargetModalEvent(false);
		settriggerCreateTemplateModal(false);
		context.stemodalOpenDeviceTemplate(null);
	};
	const CloseConnModal = () => {
		setTargettargetModalEvent(false);
		setshowCOnnectionInfoModal(false);
	};

	const closeTemplateListModal = () => {
		setshowtemplateListmodal(false);
	};

	const renderZoomTooltip = (props, li) => (
		<Tooltip id="button-tooltip-TEST" {...props}>
			{button_hover}
		</Tooltip>
	);
	const mouse_enter = (val) => {
		setbutton_hover(val);
	};
	const manageDeviceClick = (event, t) => {
		setPopoverDevice(true);
		setTarget(event.target);

		// console.log(t);
	};

	const BlockUnblockClick = async (dta) => {
		let sta = dta === 'false' ? 'disabled' : 'enabled';

		try {
			await blockUnBlockDeviceFunc({
				variables: {
					device_id: urlDevice,
					status: sta,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	const closeAddComponentsModal = () => {
		props.setshowAddComponentModal(false);
		context.stemodalOpenDeviceTemplate(null);
	};

	const CreateTemplate = async (dta) => {
		try {
			await props.addComponentGql({
				variables: {
					template_id: urlTemp,
					component_name: dta.component_name,
				},
			});
		} catch (error) {
			props.setshowAddComponentModal(false);
		}
	};

	const closeConfermationModal = () => {
		setShowConfermationBox(false);
	};
	const YesClick = async () => {
		try {
			await publishtemplateFunc({
				variables: {
					template_id: urlTemp,
				},
			});
		} catch (error) {
			console.log(error);

			setShowConfermationBox(false);
		}
	};

	return (
		<>
			<CommonConfermationBox
				closeConfermationModal={closeConfermationModal}
				YesClick={YesClick}
				ShowConfermationBox={ShowConfermationBox}
				loadingC={loadingTemplatePublish}
				headingText="Publish this device template to the application"
				SubHeading="Publish the device template once you have finished building the template
		and are ready to create real or simulated devices. If you have connected
		devices, publishing the device template will push the latest changes to
		those devices."
				openIn={'PublishTemplate'}
			/>

			<AddDeviceModal
				triggerAddDeviceModal={triggerAddDeviceModal}
				closeAddDeviceModal={closeAddDeviceModal}
				settriggerAddDeviceModal={settriggerAddDeviceModal}
				randText={randText(10)}
			/>
			<AddComponentModal
				showAddComponentModal={props.showAddComponentModal}
				closeAddComponentsModal={closeAddComponentsModal}
				CreateTemplate={CreateTemplate}
				loadingAddComponentMutation={props.loadingAddComponentMutation}
			/>

			<CreateTemplateModal
				closeTemplateModal={closeTemplateModal}
				triggerCreateTemplateModal={triggerCreateTemplateModal}
				settriggerCreateTemplateModal={settriggerCreateTemplateModal}
			/>
			<ShowConnInfo
				showCOnnectionInfoModal={showCOnnectionInfoModal}
				setshowCOnnectionInfoModal={setshowCOnnectionInfoModal}
				CloseConnModal={CloseConnModal}
			/>

			<TemplateListModal
				showtemplateListmodal={showtemplateListmodal}
				closeTemplateListModal={closeTemplateListModal}
				setshowtemplateListmodal={setshowtemplateListmodal}
			/>
			<div className="row no-gutters mt-3 mr-2">
				{props.btnname.length > 0 && (
					<div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 mt-5">
						<div className="d-flex  ">
							{props.btnname.map((li, ind) =>
								li.button_name === 'New' ? (
									<>
										{!targetModalEvent ? (
											<OverlayTrigger
												placement="bottom"
												overlay={renderZoomTooltip}>
												<button
													className={`btn mr-2 mt-1 ${li.classN}`}
													key={ind}
													onMouseEnter={() =>
														mouse_enter(
															li.pageRenderedOn === 'Device'
																? 'Add Device'
																: 'Create Template'
														)
													}
													onClick={(e) => btnClickEvent(e, li)}>
													<span className={`${li.icon}`}></span>
													{li.button_name}
												</button>
											</OverlayTrigger>
										) : (
											<button
												className={`btn mr-2 mt-1 ${li.classN}`}
												key={ind}
												onClick={(e) => btnClickEvent(e, li)}>
												<span className={`${li.icon}`}></span>
												{li.button_name}
											</button>
										)}
									</>
								) : (
									<button
										className={`btn mr-2 mt-1 ${li.classN}`}
										onClick={(e) => btnClickEvent(e, li)}
										disabled={li.button_name === 'Published' ? true : false}
										key={ind}>
										{li.button_name}

										{li.button_name === 'Manage Device' ? (
											<span
												className={`${li.icon}`}
												onClick={(e) => {
													manageDeviceClick(e, li);
												}}></span>
										) : li.disabled ? (
											''
										) : (
											<span className={`${li.icon}`}></span>
										)}
									</button>
								)
							)}
						</div>
					</div>
				)}
				<Overlay
					show={PopoverDevice}
					target={target}
					rootClose
					onHide={() => setPopoverDevice()}
					placement="bottom">
					<Popover id="popover_option_click">
						<div className="option_container">
							<div
								className={
									loadingBlockUnblock
										? 'fs-7 px-3 py-1 popoverElements duplicateLoading'
										: 'fs-7 px-3 py-1 popoverElements'
								}
								onClick={() =>
									!loadingBlockUnblock &&
									BlockUnblockClick(context.deviceDataById.device_block_status)
								}>
								{context.deviceDataById.device_block_status === 'true' ||
								context.deviceDataById.device_block_status === true
									? 'Un block'
									: 'Block'}
								{loadingBlockUnblock && (
									<span className="spinner-border float-right  mb-1"></span>
								)}
							</div>
						</div>
					</Popover>
				</Overlay>
				{props.searchbox && (
					<div
						className={
							props.btnname.length > 0
								? 'col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 mt-md-2 mt-lg-5'
								: 'col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 mt-md-5 mt-lg-5'
						}>
						<div className="row no-gutters">
							<div className="col-12 col-sm-12 col-md-8 col-lg-12 col-xl-7  pr-lg-2  pr-xl-1  input-icons">
								<SearchBar placeholderName={props.placeHolderForSearch} />
							</div>
						</div>
					</div>
				)}
			</div>
			<hr></hr>
		</>
	);
}
