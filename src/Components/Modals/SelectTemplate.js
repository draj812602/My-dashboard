import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, NavLink } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import GlobalSearchComp from '../GlobalSearch';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { ASSIGNTEMPLATETODEVICE } from '../../Mutations';
import { GETDEVICEDATABYID } from '../../Queries';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

function TestModal({
	showtemplateListmodal,
	closeTemplateListModal,
	setshowtemplateListmodal,
}) {
	let history = useHistory();
	const context = useContext(GlobalContextMain);
	let url = parseInt(
		context?.currUrlNameDevice?.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[2]
	);

	const [tempData, settempData] = useState([]);
	const [selectedTemplate, setselectedTemplate] = useState({});

	const [createTemplatefun, { loading }] = useMutation(ASSIGNTEMPLATETODEVICE, {
		update(proxy, { data }) {
			let dd = context.deviceDataById;
			context.setDeviceRawData(data.assignTemplate);
			setshowtemplateListmodal(false);

			history.push(
				`/Device/${
					context?.currUrlNameDevice?.split(
						'780003a2-2b90-46d2-9af8-f58e9eb41e06'
					)[0]
				}780003a2-2b90-46d2-9af8-f58e9eb41e06${
					context?.currUrlNameDevice?.split(
						'780003a2-2b90-46d2-9af8-f58e9eb41e06'
					)[1]
				}780003a2-2b90-46d2-9af8-f58e9eb41e06${selectedTemplate}`
			);
		},

		refetchQueries: [
			{
				query: GETDEVICEDATABYID,
				variables: {
					device_id: parseInt(
						context?.currUrlNameDevice?.split(
							'780003a2-2b90-46d2-9af8-f58e9eb41e06'
						)[1]
					),
				},
			},
		],
		awaitRefetchQueries: true,
	});
	useEffect(() => {
		setselectedTemplate(url);
	}, [url]);

	useEffect(() => {
		if (context.templateList)
			settempData(context.templateList.getTemplateNames);
	}, [context.templateList]);

	const [searchValue, setSearchValue] = useState('');

	const tempDataS = tempData?.filter((item) => {
		return (
			item.template_name.toLowerCase().includes(searchValue.toLowerCase()) ||
			!searchValue
		);
	});

	const Templateclick = (dta) => {
		setselectedTemplate(dta.template_id);
	};

	const CreateNewTemplate = () => {
		history.push('/Templates');
	};
	const TemplateClick = async () => {
		let device_id = parseInt(
			context.currUrlNameDevice?.split(
				'780003a2-2b90-46d2-9af8-f58e9eb41e06'
			)[1]
		);

		try {
			await createTemplatefun({
				variables: {
					device_id: device_id,
					template_id: selectedTemplate,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<Modal
				size="sm"
				show={showtemplateListmodal}
				dialogClassName="template_modal_class"
				backdrop="static"
				onHide={closeTemplateListModal}>
				{/* <Modal.Body > */}
				<div className="mb-2 modal_header d-flex  text-dark fs-5">
					Assign Template
					<i
						className="ri-close-line ri-lg fs-4 ml-auto "
						onClick={closeTemplateListModal}></i>
				</div>

				{tempData.length > 0 && (
					<div className="form-group  mt-1 input-icons">
						<input
							type="search"
							placeholder="Search template"
							className="form-control"
							onChange={(e) => setSearchValue(e.target.value)}
							value={searchValue}
						/>
						<span className="fa fa-search"></span>
					</div>
				)}

				<span
					className={
						tempData.length > 5
							? ' border  fs-6 text-primary  scrollTemplate'
							: 'border  fs-6 text-primary  scrollTemplate'
					}>
					{tempData.length > 0 ? (
						tempDataS?.length > 0 ? (
							tempDataS.map((li, i) => (
								<div
									className={
										li.template_id === selectedTemplate
											? 'pl-2 py-1 bg-primary text-white testtemplate rounded'
											: 'pl-2 py-1 testtemplate rounded'
									}
									key={li.template_id}
									onClick={() => {
										Templateclick(li);
									}}>
									{li.template_name}
								</div>
							))
						) : (
							<GlobalSearchComp
								searchData={searchValue}
								searchFor={'Template'}
							/>
						)
					) : (
						<div className="ml-3 text-primary p-3 text-center mt-5">
							You have not created any template
							<button className="btn btn-link" onClick={CreateNewTemplate}>
								Click here to create new template
							</button>
						</div>
					)}
				</span>

				{tempData.length > 0 && (
					<div className="float-right mt-3 mb-2">
						<button
							className="btn btn-primary ml-2 float-right"
							onClick={TemplateClick}
							disabled={loading}>
							Assign
							{loading && <span className="spinner-border float-right"></span>}
						</button>
						<button
							className="btn btn-secondary  float-right"
							onClick={closeTemplateListModal}>
							Cancel
						</button>
					</div>
				)}
			</Modal>
		</div>
	);
}

export default TestModal;
